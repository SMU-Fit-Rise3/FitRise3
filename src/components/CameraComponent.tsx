import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO, cameraWithTensors } from '@tensorflow/tfjs-react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { ExpoWebGLRenderingContext } from 'expo-gl';
import * as posedetection from '@tensorflow-models/pose-detection';
import * as ScreenOrientation from 'expo-screen-orientation';
import '@tensorflow/tfjs-react-native';
import * as blazeface from '@tensorflow-models/blazeface';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api';
//ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
const TensorCamera = cameraWithTensors(Camera);

const IS_ANDROID = Platform.OS === 'android';
const IS_IOS = Platform.OS === 'ios';

const CAM_PREVIEW_WIDTH = Dimensions.get('window').width;
const CAM_PREVIEW_HEIGHT = CAM_PREVIEW_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);

// The score threshold for pose detection results.
const MIN_KEYPOINT_SCORE = 0.3;

const OUTPUT_TENSOR_WIDTH = 180;
const OUTPUT_TENSOR_HEIGHT = OUTPUT_TENSOR_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);


// Whether to load model from app bundle (true) or through network (false).
const LOAD_MODEL_FROM_BUNDLE = false;

// Whether to auto-render TensorCamera preview.
const AUTO_RENDER = false;

type Rotation = 0 | 90 | 180 | 270;

const CameraComponent = ({ isModalVisible }: { isModalVisible: boolean; }) => {
  const cameraRef = useRef(null);
  const [tfReady, setTfReady] = useState(false);
  const [model, setModel] = useState<posedetection.PoseDetector>(); //포즈감지 모델
  const [poses, setPoses] = useState<posedetection.Pose[]>();
  const [fps, setFps] = useState(0);
  const [cameraType, setCameraType] = useState<CameraType>(CameraType.front);
  const [rotation, setRotation] = useState<Rotation | undefined>(undefined);
  const [orientation, setOrientation] = useState<ScreenOrientation.Orientation | null>(null);
  const [faceModel, setFaceModel] = useState<blazeface.BlazeFaceModel | undefined>();
  const [facebox, setFacebox] = useState<blazeface.NormalizedFace[]>();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [gChannel, setGChannel] = useState<number[]>([]);
  const isModalVisibleRef = useRef(isModalVisible);
  const rafId = useRef<number | null>(null);
  // 카메라 권한 요청 함수
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    async function prepare() {
      rafId.current = null;

      // Camera permission.
      await Camera.requestCameraPermissionsAsync();

      // Wait for tfjs to initialize the backend.
      await tf.ready();

      // Load movenet model.
      const movenetModelConfig: posedetection.MoveNetModelConfig = {
        modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true,
      };

      const model = await posedetection.createDetector(
        posedetection.SupportedModels.MoveNet,
        movenetModelConfig
      );
      setModel(model);

      const facemodel = await blazeface.load();
      setFaceModel(facemodel);
      // Ready!
      setTfReady(true);
    }

    prepare();
  }, []);

  useEffect(() => {
    // Called when the app is unmounted.
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
      // 현재 화면 방향을 비동기적으로 조회합니다.
      const orientation = await ScreenOrientation.getOrientationAsync();
      // 조회된 화면 방향을 상태 변수에 저장합니다.
      setOrientation(orientation);
    };

    // 화면 방향이 변경될 때마다 updateOrientation 함수를 호출합니다.
    const subscription = ScreenOrientation.addOrientationChangeListener(
      (event) => {
        setOrientation(event.orientationInfo.orientation);
      }
    );

    // 컴포넌트가 마운트될 때 현재 화면 방향을 업데이트합니다.
    updateOrientation();

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);


  useEffect(() => {
    isModalVisibleRef.current = isModalVisible;
    if (!isModalVisible) {
      if (gChannel.length > 0) {
        //스트레스 계산 요청
        AsyncStorage.getItem('userId').then((userId) => {
          API.updateStress(userId, gChannel);
        })
      }
    }
  }, [isModalVisible]);

  const handleCameraStream = async (
    images: IterableIterator<tf.Tensor3D>,
    updatePreview: () => void,
    gl: ExpoWebGLRenderingContext
  ) => {
    const gChannelMeans: number[] = [];
    const loop = async () => {

      // Get the tensor and run pose detection.
      const imageTensor = images.next().value as tf.Tensor3D;

      const startTs = Date.now();

      if (isModalVisibleRef.current) {
        // webview모달이 켜져있을때
        // 얼굴감지 처리
        const predictions = await faceModel!.estimateFaces(
          imageTensor,
          false, // 반환된 데이터 타입 (텐서:true /JSON:false)
          false,// 웹캠 이미지가 미러 모드인 경우 true(미러모드 이미지가 좌우 반전되는 모드) 
          true// 얼굴 경계 상자 true/false
        );

        if (predictions.length > 0) {
          for (let i = 0; i < predictions.length; i++) {
            const start = predictions[i].topLeft as [number, number];   //start[0]=x start[1]=y
            const end = predictions[i].bottomRight as [number, number];  //end[0]=x end[1]=y
            const size = [end[0] - start[0], end[1] - start[1]];

            // 얼굴 경계 상자의 위치와 크기 정보를 사용합니다.
            console.log(`Face ${i}: x=${start[0]}, y=${start[1]}, width=${size[0]}, height=${size[1]}`);
            //얼굴상자가 화면 경계값일경우 전처리
            const clampedY = Math.min(Math.round(start[1]), imageTensor.shape[0] - 1);
            const clampedHeight = Math.min(Math.round(size[1]), imageTensor.shape[0] - clampedY);
            const clampedX = Math.min(Math.round(start[0]), imageTensor.shape[1] - 1);
            const clampedWidth = Math.min(Math.round(size[0]), imageTensor.shape[1] - clampedX);

            tf.tidy(() => {// 함수 종료 시 slicedTensor는 자동으로 메모리에서 해제됩니다.

              //얼굴영역만 자르기
              const faceTensor = tf.slice(imageTensor, [clampedY, clampedX, 0], [clampedHeight, clampedWidth, 3]);
              console.log("faceTensor:" + faceTensor);

              // RGB 채널 분리
              let [r, g, b] = tf.split(faceTensor, 3, 2);

              // YCrCb 변환
              let y = r.mul(0.299).add(g.mul(0.587)).add(b.mul(0.114));
              let cb = b.sub(y).mul(0.564).add(128);
              let cr = r.sub(y).mul(0.713).add(128);

              // 피부 색상 범위 필터링
              let skinMask = y.greaterEqual(0).logicalAnd(y.lessEqual(255))
                .logicalAnd(cb.greaterEqual(85)).logicalAnd(cb.lessEqual(135))
                .logicalAnd(cr.greaterEqual(135)).logicalAnd(cr.lessEqual(180));

              // 피부 영역만 추출하여 G 채널만을 가져옵니다.
              let skinGChannel = tf.where(skinMask, g, tf.zerosLike(g));
              console.log("피부영역G채널 :" + skinGChannel);

              // 0이 아닌 G 채널 값들의 평균 계산
              //0이 아닌값 true false
              let nonzeroSkinGChannel = skinGChannel.greater(0);
              //true와 곱해서 의미있는 값들의 배열
              let nonzeroValues = skinGChannel.mul(nonzeroSkinGChannel);
              //true의 수
              let nonzeroCount = nonzeroSkinGChannel.sum();

              // 평균 계산
              let meanValue = nonzeroValues.sum().div(nonzeroCount);
              meanValue.data().then(data => {
                gChannelMeans.push(data[0]);
                setGChannel(gChannelMeans);
              })
            });
          }
        }
        setFacebox(predictions);
      } else {
        //webview모달 꺼졌을때
        //포즈 감지 처리
        const poses = await model!.estimatePoses(
          imageTensor,
          undefined,
          Date.now()
        );
        setPoses(poses);
      }





      const latency = Date.now() - startTs;
      setFps(Math.floor(1000 / latency));

      tf.dispose([imageTensor]);
      if (rafId.current === 0) {
        return;
      }

      // Render camera preview manually when autorender=false.
      if (!AUTO_RENDER) {
        updatePreview();
        gl.endFrameEXP();
      }

      rafId.current = requestAnimationFrame(loop);
    };

    loop();
  };

  const renderPose = () => {
    if (poses != null && poses.length > 0) {
      console.log(poses[0].keypoints);
      const keypoints = poses[0].keypoints
        .filter((k) => (k.score ?? 0) > MIN_KEYPOINT_SCORE)
        .map((k) => {
          // Flip horizontally on android or when using back camera on iOS.
          const flipX = IS_ANDROID || cameraType === CameraType.front;
          const x = flipX ? getOutputTensorWidth() - k.x : k.x;
          const y = k.y;
          const cx =
            (x / getOutputTensorWidth()) *
            (isPortrait() ? CAM_PREVIEW_WIDTH : CAM_PREVIEW_HEIGHT);
          const cy =
            (y / getOutputTensorHeight()) *
            (isPortrait() ? CAM_PREVIEW_HEIGHT : CAM_PREVIEW_WIDTH);
          return (
            <Circle
              key={`skeletonkp_${k.name}`}
              cx={cx}
              cy={cy}
              r='4'
              strokeWidth='2'
              fill='#00AA00'
              stroke='white'
            />
          );
        });

      const adjacentKeyPoints = posedetection.util.getAdjacentPairs(posedetection.SupportedModels.MoveNet);
      const skeleton = adjacentKeyPoints?.map(([i, j]) => {
        const kp1 = poses[0].keypoints[i];
        const kp2 = poses[0].keypoints[j];
        const score1 = kp1?.score != null ? kp1.score : 1;
        const score2 = kp2?.score != null ? kp2.score : 1;
        const scoreThreshold = MIN_KEYPOINT_SCORE || 0;

        if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
          // Flip horizontally on android or when using back camera on iOS.
          const flipX = IS_ANDROID || cameraType === CameraType.front;

          // Adjust keypoints according to the output tensor and screen size
          const adjustedX1 = flipX ? getOutputTensorWidth() - kp1.x : kp1.x;
          const adjustedY1 = kp1.y;
          const adjustedX2 = flipX ? getOutputTensorWidth() - kp2.x : kp2.x;
          const adjustedY2 = kp2.y;

          // Convert keypoints to match the actual screen position
          const x1 = (adjustedX1 / getOutputTensorWidth()) * (isPortrait() ? CAM_PREVIEW_WIDTH : CAM_PREVIEW_HEIGHT);
          const y1 = (adjustedY1 / getOutputTensorHeight()) * (isPortrait() ? CAM_PREVIEW_HEIGHT : CAM_PREVIEW_WIDTH);
          const x2 = (adjustedX2 / getOutputTensorWidth()) * (isPortrait() ? CAM_PREVIEW_WIDTH : CAM_PREVIEW_HEIGHT);
          const y2 = (adjustedY2 / getOutputTensorHeight()) * (isPortrait() ? CAM_PREVIEW_HEIGHT : CAM_PREVIEW_WIDTH);

          return <Line
            key={`skeletonls_${i}${j}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke='white'
            strokeWidth='2'
          />;
        }
      });



      return (
        <Svg style={styles.svg}>
          {keypoints}
          {skeleton}
        </Svg>
      );
    } else {
      return <View></View>;
    }
  };

  const renderFps = () => {
    return (
      <View style={styles.fpsContainer}>
        <Text>FPS: {fps}</Text>
      </View>
    );
  };

  const renderCameraTypeSwitcher = () => {
    return (
      <View
        style={styles.cameraTypeSwitcher}
        onTouchEnd={handleSwitchCameraType}
      >
        <Text>
          Switch to{' '}
          {cameraType === CameraType.front ? 'back' : 'front'} camera
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
    // On iOS landscape mode, switch width and height of the output tensor to
    // get better result. Without this, the image stored in the output tensor
    // would be stretched too much.
    //
    // Same for getOutputTensorHeight below.
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
    // On Android, the camera texture will rotate behind the scene as the phone
    // changes orientation, so we don't need to rotate it in TensorCamera.
    if (IS_ANDROID) {
      return 0;
    }


    // For iOS, the camera texture won't rotate automatically. Calculate the
    // rotation angles here which will be passed to TensorCamera to rotate it
    // internally.
    switch (orientation) {
      // Not supported on iOS as of 11/2021, but add it here just in case.
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
  //얼굴 경계 상자 렌더링 사용:{renderFaceBoxes()}
  const renderFaceBoxes = () => {
    //텐서 x,y좌표와 화면좌표 차이조정
    const scaleX = CAM_PREVIEW_WIDTH / OUTPUT_TENSOR_WIDTH;
    const scaleY = CAM_PREVIEW_HEIGHT / OUTPUT_TENSOR_HEIGHT;

    return facebox?.map((prediction, index) => {
      const { topLeft, bottomRight } = prediction as { topLeft: [number, number], bottomRight: [number, number] };

      // width, height, left, top을 계산할 때 숫자 타입이 확실히 보장되도록 합니다.
      const width = (bottomRight[0] - topLeft[0]) * scaleX;
      const height = (bottomRight[1] - topLeft[1]) * scaleY;
      const left = topLeft[0] * scaleX;
      const top = topLeft[1] * scaleY;
      // 각 얼굴 경계 상자의 스타일을 계산합니다.
      const boxStyle = {
        position: 'absolute' as 'absolute', // 'absolute' 타입을 명시적으로 지정
        left: left,
        top: top,
        width: width,
        height: height,
        borderWidth: 2,
        borderColor: 'red',
        zIndex: 20, // 확실한 시각화를 위해 zIndex를 설정합니다.
      };

      // 계산된 스타일로 View 컴포넌트를 반환합니다.
      return <View key={`face-${index}`} style={boxStyle} />;
    });
  };

  if (!tfReady) {
    return (
      <View style={styles.loadingMsg}>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      // Note that you don't need to specify `cameraTextureWidth` and
      // `cameraTextureHeight` prop in `TensorCamera` below.
      <View style={styles.container}>
        <TensorCamera
          ref={cameraRef}
          style={styles.camera}
          autorender={AUTO_RENDER}
          type={cameraType}
          // tensor related props 
          resizeWidth={getOutputTensorWidth()}
          resizeHeight={getOutputTensorHeight()}
          resizeDepth={3}
          rotation={rotation}
          useCustomShadersToResize={false}
          cameraTextureWidth={CAM_PREVIEW_WIDTH}
          cameraTextureHeight={CAM_PREVIEW_HEIGHT}
          onReady={handleCameraStream}
        />
        {renderPose()}
        {renderFps()}
        {renderCameraTypeSwitcher()}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'gray',
  },
  cameraView: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 36,
  },
  takePictureButton: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  takePictureText: {
    fontSize: 30,
    color: 'white',
  },
  containerPortrait: {
    position: 'relative',
    width: CAM_PREVIEW_WIDTH,
    height: CAM_PREVIEW_HEIGHT,
    marginTop: Dimensions.get('window').height / 2 - CAM_PREVIEW_HEIGHT / 2,
  },
  containerLandscape: {
    position: 'relative',
    width: CAM_PREVIEW_HEIGHT,
    height: CAM_PREVIEW_WIDTH,
    marginLeft: Dimensions.get('window').height / 2 - CAM_PREVIEW_HEIGHT / 2,
  },
  loadingMsg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  svg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 30,
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
  cameraTypeSwitcher: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 180,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .7)',
    borderRadius: 2,
    padding: 8,
    zIndex: 20,
  },
});

export default CameraComponent;