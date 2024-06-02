import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { calculateAngle } from './calculate';
import { poseMatcher } from './PoseMatcher';

const PushUp = ({ exerciseData, poses, updateSets, updateCount, onFeedback, onExerciseComplete }) => {

  //console.log(poses)
  const [count, setCount] = useState(0);
  const [sets, setSets] = useState(0);
  const [checkPushUp, setCheckPushUp] = useState(false);
  

  useEffect(()=>{

    if (exerciseData.sets == sets) {
      onExerciseComplete(true);
    }

    if (count % exerciseData.reps == 0 && count !== 0) {
      setSets(sets => sets + 1);
      setCount(0);
    }

  },[count,sets])

  useEffect(() => {
    updateSets(sets);
    updateCount(count);
  }, [sets, count]);


 // console.log(poses);
    if (!poses || poses.length === 0) {
      return <View><Text>No pose detected</Text></View>;
    };
  
    const keypoints = poses[0].keypoints.reduce((acc, keypoint) => {
  
      acc[keypoint.name] = { x: keypoint.x, y: keypoint.y, score: keypoint.score };
      return acc;
    }, {});

    //console.log('========',keypoints)
  
    const left_shoulder = keypoints['left_shoulder'];
    const left_elbow = keypoints['left_elbow'];
    const left_wrist = keypoints['left_wrist'];
    const left_knee = keypoints['left_knee'];
    const left_hip = keypoints['left_hip'];
    const right_shoulder = keypoints['right_shoulder'];
    const right_elbow = keypoints['right_elbow'];
    const right_wrist = keypoints['right_wrist'];
    const right_knee = keypoints['right_knee'];
    const right_hip = keypoints['right_hip'];

    const left_elbow_angle = calculateAngle(left_shoulder, left_elbow, left_wrist);
    const right_elbow_angle = calculateAngle(right_shoulder, right_elbow, right_wrist);
    const left_hip_angle = calculateAngle(left_shoulder,left_hip,left_knee);
    const right_hip_angle = calculateAngle(right_shoulder,right_hip,right_knee);
    const left_shoulder_angle = calculateAngle(left_elbow,left_shoulder,left_hip);
    const right_shoulder_angle = calculateAngle(right_elbow,right_shoulder,right_hip);

    if((left_hip_angle != null || right_hip_angle != null) && (left_elbow_angle != null || right_elbow_angle != null )
      && (left_shoulder_angle != null || right_shoulder_angle != null)
     ){
      console.log(left_elbow_angle,' ', right_elbow_angle)

    if ( poseMatcher(left_elbow_angle,160) || poseMatcher(right_elbow_angle,160)) {
        if(checkPushUp){
            onFeedback('잘했어요')
            console.log("잘했어요");
            setCheckPushUp(false);
        }
       
     } else if ( poseMatcher(left_elbow_angle,90) || poseMatcher(right_elbow_angle,90)){
       
        console.log("올라가세요");
        onFeedback('올라가세요')
        if(!checkPushUp){
          setCount(count => count + 1);
          console.log(count);
            setCheckPushUp(true);
        }
       
     } else if (poseMatcher(left_hip_angle,100) || poseMatcher(right_hip_angle,100)){
        console.log("허리를 내리고 척추 중립을 유지하세요")
        onFeedback('허리를 내리고 척추 중립을 유지하세요')

     }  else if (poseMatcher(left_hip_angle,150) || poseMatcher(right_hip_angle,150)) {
      console.log('허리가 꺾이지 않게 척추 중립을 유지하세요')
      onFeedback('허리가 꺾이지 않게 척추 중립을 유지하세요')

     } 
    }else{
      onFeedback('전신이 나오도록 측면으로 자세를 잡아주세요')
    }


};

export default PushUp;
