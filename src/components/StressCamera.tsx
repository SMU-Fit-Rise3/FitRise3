import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, Image, StatusBar } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { ExpoWebGLRenderingContext } from 'expo-gl';
import * as ScreenOrientation from 'expo-screen-orientation';
import '@tensorflow/tfjs-react-native';
import * as blazeface from '@tensorflow-models/blazeface';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api';
import LoadingModal from './UI/LoadingModal';
import { useRouter } from "expo-router";
import * as Progress from 'react-native-progress';

const TensorCamera = cameraWithTensors(Camera);

const IS_ANDROID = Platform.OS === 'android';
const IS_IOS = Platform.OS === 'ios';

const CAM_PREVIEW_WIDTH = Dimensions.get('window').width;
const CAM_PREVIEW_HEIGHT = CAM_PREVIEW_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);

const OUTPUT_TENSOR_WIDTH = 180;
const OUTPUT_TENSOR_HEIGHT = OUTPUT_TENSOR_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);

const AUTO_RENDER = false;

type Rotation = 0 | 90 | 180 | 270;

const StressCamera = () => {
  const [tfReady, setTfReady] = useState(false);
  const [fps, setFps] = useState(0);
  const [cameraType, setCameraType] = useState<CameraType>(CameraType.front);
  const [rotation, setRotation] = useState<Rotation | undefined>(undefined);
  const [orientation, setOrientation] = useState<ScreenOrientation.Orientation | null>(null);
  const [faceModel, setFaceModel] = useState<blazeface.BlazeFaceModel | undefined>();
  const [facebox, setFacebox] = useState<blazeface.NormalizedFace[]>();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [gChannel, setGChannel] = useState<number[]>([]);
  const [faceInBox, setFaceInBox] = useState(false);
  const [faceInBoxTime, setFaceInBoxTime] = useState(0);
  const rafId = useRef<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    async function prepare() {
      try {
        rafId.current = null;

        await Camera.requestCameraPermissionsAsync();

        await tf.ready();

        const facemodel = await blazeface.load();
        setFaceModel(facemodel);
        setTfReady(true);
      } catch (error) {
        console.error('Error during TensorFlow.js or Blazeface initialization:', error);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    return () => {
      if (rafId.current != null && rafId.current !== 0) {
        cancelAnimationFrame(rafId.current);
        rafId.current = 0;
      }
    };
  }, []);

  useEffect(() => {
    const updateRotation = async () => {
      const calculatedRotation = await getTextureRotationAngleInDegrees(cameraType);
      setRotation(calculatedRotation);
    };

    updateRotation();
  }, [cameraType]);

  useEffect(() => {
    const updateOrientation = async () => {
      const orientation = await ScreenOrientation.getOrientationAsync();
      setOrientation(orientation);
    };

    const subscription = ScreenOrientation.addOrientationChangeListener(
      (event) => {
        setOrientation(event.orientationInfo.orientation);
      }
    );

    updateOrientation();

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (faceInBox) {
      intervalId = setInterval(() => {
        setFaceInBoxTime((prevTime) => {
          if (prevTime + 1 >= 30) {
            clearInterval(intervalId);
            console.log(gChannel);
            if (gChannel.length > 0) {
              AsyncStorage.getItem('userId').then((userId) => {
                cleanupAndNavigate(() => {
                  API.updateStress(userId, gChannel).then(() => { router.push('/tabs/stressScreen'); });
                });
              });
            }
          }
          return prevTime + 1;
        });
      }, 1000);
    } else {
      setFaceInBoxTime(0);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [faceInBox, router, gChannel]);

  const cleanupAndNavigate = (callback: () => void) => {
    if (rafId.current != null && rafId.current !== 0) {
      cancelAnimationFrame(rafId.current);
      rafId.current = 0;
    }
    tf.engine().disposeVariables();
    callback();
  };

  const handleCameraStream = async (
    images: IterableIterator<tf.Tensor3D>,
    updatePreview: () => void,
    gl: ExpoWebGLRenderingContext
  ) => {
    let gChannelMeans: number[] = [];
    const loop = async () => {
      try {
        const startTs = Date.now();
        const imageTensor = images.next().value as tf.Tensor3D;
        const predictions = await faceModel!.estimateFaces(
          imageTensor,
          false,
          false,
          true
        );

        if (predictions.length > 0) {
          const faceDetectedInBox = isFaceInStaticBox(predictions[0]);

          if (faceDetectedInBox) {
            setFaceInBox(true);
            for (let i = 0; i < predictions.length; i++) {
              const start = predictions[i].topLeft as [number, number];
              const end = predictions[i].bottomRight as [number, number];
              const size = [end[0] - start[0], end[1] - start[1]];

              console.log(`Face ${i}: x=${start[0]}, y=${start[1]}, width=${size[0]}, height=${size[1]}`);
              const clampedY = Math.min(Math.round(start[1]), imageTensor.shape[0] - 1);
              const clampedHeight = Math.min(Math.round(size[1]), imageTensor.shape[0] - clampedY);
              const clampedX = Math.min(Math.round(start[0]), imageTensor.shape[1] - 1);
              const clampedWidth = Math.min(Math.round(size[0]), imageTensor.shape[1] - clampedX);

              tf.tidy(() => {
                const faceTensor = tf.slice(imageTensor, [clampedY, clampedX, 0], [clampedHeight, clampedWidth, 3]);

                let [r, g, b] = tf.split(faceTensor, 3, 2);

                let y = r.mul(0.299).add(g.mul(0.587)).add(b.mul(0.114));
                let cb = b.sub(y).mul(0.564).add(128);
                let cr = r.sub(y).mul(0.713).add(128);

                let skinMask = y.greaterEqual(0).logicalAnd(y.lessEqual(255))
                  .logicalAnd(cb.greaterEqual(85)).logicalAnd(cb.lessEqual(135))
                  .logicalAnd(cr.greaterEqual(135)).logicalAnd(cr.lessEqual(180));

                let skinGChannel = tf.where(skinMask, g, tf.zerosLike(g));

                let nonzeroSkinGChannel = skinGChannel.greater(0);
                let nonzeroValues = skinGChannel.mul(nonzeroSkinGChannel);
                let nonzeroCount = nonzeroSkinGChannel.sum();

                let meanValue = nonzeroValues.sum().div(nonzeroCount);
                meanValue.data().then(data => {
                  gChannelMeans.push(data[0]);
                  setGChannel(gChannelMeans);
                  console.log(gChannelMeans);
                });
              });
            }
          } else {
            setFaceInBox(false);
            setFaceInBoxTime(0);
            gChannelMeans = [];
          }
        }
        setFacebox(predictions);
        
        tf.dispose([imageTensor]);
        if (rafId.current === 0) {
          return;
        }
        const latency = Date.now() - startTs;
        setFps(Math.floor(1000 / latency));
        const waitTime = Math.max(0, 50 - latency); // 남은 시간 계산
        await new Promise(resolve => setTimeout(resolve, waitTime)); // 남은 시간 대기
        
        if (!AUTO_RENDER) {
          updatePreview();
          gl.endFrameEXP();
        }

        rafId.current = requestAnimationFrame(loop);
      } catch (error) {
        console.error('Error during camera stream handling:', error);
      }
    };
    loop();
  };

  const isFaceInStaticBox = (prediction: blazeface.NormalizedFace) => {
    let { topLeft, bottomRight } = prediction;
    if (!Array.isArray(topLeft)) {
      topLeft = Array.from(tf.round(topLeft).dataSync()) as [number, number];
    }
    if (!Array.isArray(bottomRight)) {
      bottomRight = Array.from(tf.round(bottomRight).dataSync()) as [number, number];
    }
    const staticBoxLeft = (CAM_PREVIEW_WIDTH - 200) / 2;
    const staticBoxTop = (CAM_PREVIEW_HEIGHT - 300) / 2;
    const staticBoxRight = staticBoxLeft + 200;
    const staticBoxBottom = staticBoxTop + 300;

    const faceLeft = topLeft[0] * CAM_PREVIEW_WIDTH / OUTPUT_TENSOR_WIDTH;
    const faceTop = topLeft[1] * CAM_PREVIEW_HEIGHT / OUTPUT_TENSOR_HEIGHT;
    const faceRight = bottomRight[0] * CAM_PREVIEW_WIDTH / OUTPUT_TENSOR_WIDTH;
    const faceBottom = bottomRight[1] * CAM_PREVIEW_HEIGHT / OUTPUT_TENSOR_HEIGHT;

    const tolerance = 25;

    const isSimilarToStaticBoxLeft = Math.abs(faceLeft - staticBoxLeft) <= tolerance;
    const isSimilarToStaticBoxTop = Math.abs(faceTop - staticBoxTop) <= tolerance;
    const isSimilarToStaticBoxRight = Math.abs(faceRight - staticBoxRight) <= tolerance;
    const isSimilarToStaticBoxBottom = Math.abs(faceBottom - staticBoxBottom) <= tolerance;

    return isSimilarToStaticBoxLeft && isSimilarToStaticBoxTop &&
      isSimilarToStaticBoxRight && isSimilarToStaticBoxBottom;
  };

  const renderFps = () => {
    return (
      <View style={styles.fpsContainer}>
        <Text style={styles.fpsText}>FPS: {fps}</Text>
      </View>
    );
  };

  const renderCameraTypeSwitcher = () => {
    return (
      <View
        style={styles.cameraTypeSwitcher}
        onTouchEnd={handleSwitchCameraType}
      >
        <Text style={styles.btnText}>
           {cameraType === CameraType.front ? 'back' : 'front'} camera로 전환
        </Text>
      </View>
    );
  };

  const handleSwitchCameraType = () => {
    if (cameraType === CameraType.front) {
      setCameraType(CameraType.back);
    } else {
      setCameraType(CameraType.front);
    }
  };

  const isPortrait = () => {
    return (
      orientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
      orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN
    );
  };

  const getOutputTensorWidth = () => {
    return isPortrait() || IS_ANDROID
      ? OUTPUT_TENSOR_WIDTH
      : OUTPUT_TENSOR_HEIGHT;
  };

  const getOutputTensorHeight = () => {
    return isPortrait() || IS_ANDROID
      ? OUTPUT_TENSOR_HEIGHT
      : OUTPUT_TENSOR_WIDTH;
  };

  const getTextureRotationAngleInDegrees = async (cameraType: CameraType) => {
    if (IS_ANDROID) {
      return 0;
    }

    switch (orientation) {
      case ScreenOrientation.Orientation.PORTRAIT_DOWN:
        return 180;
      case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
        return cameraType === CameraType.front ? 270 : 90;
      case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
        return cameraType === CameraType.front ? 90 : 270;
      default:
        return 0;
    }
  };

  const renderFaceBoxes = () => {
    const scaleX = CAM_PREVIEW_WIDTH / OUTPUT_TENSOR_WIDTH;
    const scaleY = CAM_PREVIEW_HEIGHT / OUTPUT_TENSOR_HEIGHT;

    return facebox?.map((prediction, index) => {
      const { topLeft, bottomRight } = prediction as { topLeft: [number, number], bottomRight: [number, number] };

      const width = (bottomRight[0] - topLeft[0]) * scaleX;
      const height = (bottomRight[1] - topLeft[1]) * scaleY;
      const left = topLeft[0] * scaleX;
      const top = topLeft[1] * scaleY;

      const boxStyle = {
        position: 'absolute' as 'absolute',
        left: left,
        top: top,
        width: width,
        height: height,
        borderWidth: 2,
        borderColor: '#fff',
        zIndex: 20,
      };

      return <View key={`face-${index}`} style={boxStyle} />;
    });
  };

  const renderStaticFaceBox = () => {
    const width = 200;
    const height = 300;
    const left = (CAM_PREVIEW_WIDTH - width) / 2;
    const top = (CAM_PREVIEW_HEIGHT - height) / 2;

    const boxStyle = {
      position: 'absolute' as 'absolute',
      left: left,
      top: top,
      width: width,
      height: height,
      borderWidth: 2,
      borderColor: '#99aff8',
      zIndex: 20,
      borderRadius: width / 2,
    };

    return <View style={boxStyle} />;
  };

  if (!tfReady) {
    return (
      <LoadingModal visible={true} />
    );
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'android' && <StatusBar barStyle="dark-content" />}
        <TensorCamera
          style={styles.camera}
          autorender={AUTO_RENDER}
          type={cameraType}
          resizeWidth={getOutputTensorWidth()}
          resizeHeight={getOutputTensorHeight()}
          resizeDepth={3}
          rotation={rotation}
          useCustomShadersToResize={false}
          cameraTextureWidth={CAM_PREVIEW_WIDTH}
          cameraTextureHeight={CAM_PREVIEW_HEIGHT}
          onReady={handleCameraStream}
        />
        {renderFps()}
        {renderStaticFaceBox()}
        {renderFaceBoxes()}
        {renderCameraTypeSwitcher()}
        <View style={styles.progressBarContainer}>
          <Progress.Bar progress={faceInBoxTime / 30} color='#99aff8' animated={true} />
          <Text style={styles.progressText}>{faceInBoxTime}s / 30s</Text>
        </View>
        <Image
          source={require('../assets/images/faceimage5.png')}
          style={styles.overlayImage}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  fpsContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 80,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .7)',
    borderRadius: 2,
    padding: 8,
    zIndex: 20,
  },
  fpsText: {
    fontFamily: "Jua",
    fontSize: 12,
  },
  cameraTypeSwitcher: {
    position: 'absolute',
    top: 30,
    right: 10,
    width: 180,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .7)',
    borderRadius: 20,
    padding: 8,
    zIndex: 20,
  },
  btnText: {
    fontFamily: "Jua",
    fontSize: 12,
  },
  countdownContainer: {
    position: 'absolute',
    bottom: 10,
    left: '50%',
    width: 100,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .7)',
    borderRadius: 2,
    padding: 8,
    zIndex: 20,
  },
  overlayImage: {
    position: 'absolute',
    left: (CAM_PREVIEW_WIDTH - 200) / 2,
    top: (CAM_PREVIEW_HEIGHT - 300) / 2,
    width: 200,
    height: 300,
    zIndex: 20,
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 70,
    left: '50%',
    transform: [{ translateX: -100 }],
    width: 200,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .7)',
    borderRadius: 20,
    padding: 8,
    zIndex: 20,
  },
  progressText: {
    fontSize: 12,
    fontFamily: "Jua",
  },
});

export default StressCamera;
