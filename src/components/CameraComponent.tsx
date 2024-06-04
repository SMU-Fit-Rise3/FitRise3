import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { ExpoWebGLRenderingContext } from 'expo-gl';
import * as posedetection from '@tensorflow-models/pose-detection';
import * as ScreenOrientation from 'expo-screen-orientation';
import '@tensorflow/tfjs-react-native';
import { LoadingModal } from './UI'
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api';
import Curl from '../../backend/posture/Curl';
import Fly from '../../backend/posture/Fly';
import LegRaise from '../../backend/posture/LegRaise';
import PushUp from '../../backend/posture/PushUp';
import ShoulderPress from '../../backend/posture/ShoulderPress';
import SideLateralRaise from '../../backend/posture/SideLateralRaise';
import SitUp from '../../backend/posture/SitUp';
import Squat from '../../backend/posture/Squat';
import Triceps from '../../backend/posture/Triceps';

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

const CameraComponent = ({ 
  isModalVisible,
  exerciseData, 
  onFeedback,
  onExerciseComplete
}: {
  isModalVisible: boolean;
  exerciseData: {
    title: string;
    count: string;
    id: string;
    sets: number;
    reps: number;
  };
  onFeedback: (feedback: string) => void;
  onExerciseComplete: boolean;
}) => {

  const cameraRef = useRef(null);
  const [tfReady, setTfReady] = useState(false);
  const [model, setModel] = useState<posedetection.PoseDetector>(); // 포즈 감지 모델
  const [poses, setPoses] = useState<posedetection.Pose[]>();
  const [fps, setFps] = useState(0);
  const [cameraType, setCameraType] = useState<CameraType>(CameraType.front);
  const [rotation, setRotation] = useState<Rotation | undefined>(undefined);
  const [orientation, setOrientation] = useState<ScreenOrientation.Orientation | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const rafId = useRef<number | null>(null);
  const [sets, setSets] = useState(0);
  const [count, setCount] = useState(0);

  // 카메라 권한 요청 함수
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleSetUpdate = (newSets: number) => {
    setSets(newSets);
  };

  const renderSet = () => {
    return (
      <View style={styles.setsContainer}>
        <Text style={styles.text}>Sets: {exerciseData.sets}/{sets}</Text>
      </View>
    );
  };

  const handleCountUpdate = (newCount: number) => {
    setCount(newCount);
  };

  const renderCount = () => {
    return (
      <View style={styles.countsContainer}>
        <Text style={styles.text}>Reps: {exerciseData.reps}/{count}</Text>
      </View>
    );
  };

  useEffect(() => {
    if (onExerciseComplete) {
      setPoses([]);
    }
  }, [onExerciseComplete]);

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

  const handleCameraStream = async (
    images: IterableIterator<tf.Tensor3D>,
    updatePreview: () => void,
    gl: ExpoWebGLRenderingContext
  ) => {
    const loop = async () => {

      // Get the tensor and run pose detection.
      const imageTensor = images.next().value as tf.Tensor3D;

      const startTs = Date.now();

      // 포즈 감지 처리
      const poses = await model!.estimatePoses(
        imageTensor,
        undefined,
        Date.now()
      );
      setPoses(poses);
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
              fill='white'
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
            strokeWidth='3'
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
        <Text style={styles.text}>
          {cameraType === CameraType.front ? 'back' : 'front'} 카메라로 전환
        </Text>
      </View>
    );
  };

  const handleSwitchCameraType = () => {
    setCameraType(prev => (prev === CameraType.front ? CameraType.back : CameraType.front));
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

  if (!tfReady) {
    return (
      <View style={styles.loadingMsg}>
        <LoadingModal visible={true} />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <TensorCamera
          ref={cameraRef}
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
        {renderPose()}
        {renderSet()}
        {renderCount()}
        {/* {renderFps()} */}
        {exerciseData.title === 'dumbbell curl' && <Curl exerciseData={exerciseData} poses={poses} updateSets={handleSetUpdate} updateCount={handleCountUpdate} onFeedback={onFeedback} onExerciseComplete={onExerciseComplete} />}
        {exerciseData.title === 'dumbbell fly' && <Fly exerciseData={exerciseData} poses={poses} updateSets={handleSetUpdate} updateCount={handleCountUpdate} onFeedback={onFeedback} onExerciseComplete={onExerciseComplete} />}
        {exerciseData.title === 'leg raise' && <LegRaise exerciseData={exerciseData} poses={poses} updateSets={handleSetUpdate} updateCount={handleCountUpdate} onFeedback={onFeedback} onExerciseComplete={onExerciseComplete} />}
        {exerciseData.title === 'push up' && <PushUp exerciseData={exerciseData} poses={poses} updateSets={handleSetUpdate} updateCount={handleCountUpdate} onFeedback={onFeedback} onExerciseComplete={onExerciseComplete} />}
        {exerciseData.title === 'dumbbell shoulder press' && <ShoulderPress exerciseData={exerciseData} poses={poses} updateSets={handleSetUpdate} updateCount={handleCountUpdate} onFeedback={onFeedback} onExerciseComplete={onExerciseComplete} />}
        {exerciseData.title === 'side lateral raise' && <SideLateralRaise exerciseData={exerciseData} poses={poses} updateSets={handleSetUpdate} updateCount={handleCountUpdate} onFeedback={onFeedback} onExerciseComplete={onExerciseComplete} />}
        {exerciseData.title === 'sit up' && <SitUp exerciseData={exerciseData} poses={poses} updateSets={handleSetUpdate} updateCount={handleCountUpdate} onFeedback={onFeedback} onExerciseComplete={onExerciseComplete} />}
        {exerciseData.title === 'squat' && <Squat exerciseData={exerciseData} poses={poses} updateSets={handleSetUpdate} updateCount={handleCountUpdate} onFeedback={onFeedback} onExerciseComplete={onExerciseComplete} />}
        {exerciseData.title === 'dumbbell tricep extension' && <Triceps exerciseData={exerciseData} poses={poses} updateSets={handleSetUpdate} updateCount={handleCountUpdate} onFeedback={onFeedback} onExerciseComplete={onExerciseComplete} />}
        {(!exerciseData.title || exerciseData.title === '') && <Text>No exercise selected</Text>}
        {renderCameraTypeSwitcher()}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
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
    top: 40,
    left: 10,
    width: 100,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 5,
    padding: 8,
    zIndex: 20,
  },
  cameraTypeSwitcher: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    padding: 10,
    zIndex: 20,
  },
  setsContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    padding: 10,
    zIndex: 20,
  },
  countsContainer: {
    position: 'absolute',
    top: 100,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    padding: 10,
    zIndex: 20,
  },
  text: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default CameraComponent;
