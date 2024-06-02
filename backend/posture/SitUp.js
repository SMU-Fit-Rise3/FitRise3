import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { calculateAngle, calculateDistance } from './calculate';
import { poseMatcher } from './PoseMatcher';

const SitUp = ({ exerciseData, poses, updateSets, updateCount, onFeedback, onExerciseComplete }) => {

  const [count, setCount] = useState(0);
  const [sets, setSets] = useState(0);
  const [checkSitUp, setCheckSitUp] = useState(false);
  

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


    if (!poses || poses.length === 0) {
      return <View><Text>No pose detected</Text></View>;
    };
  
    const keypoints = poses[0].keypoints.reduce((acc, keypoint) => {
  
      acc[keypoint.name] = { x: keypoint.x, y: keypoint.y, score: keypoint.score };
      return acc;
    }, {});

    const left_shoulder = keypoints['left_shoulder'];
    const left_ear = keypoints['left_ear'];
    const left_wrist = keypoints['left_wrist'];
    const left_knee = keypoints['left_knee'];
    const left_hip = keypoints['left_hip'];
    const right_shoulder = keypoints['right_shoulder'];
    const right_ear = keypoints['right_ear'];
    const right_wrist = keypoints['right_wrist'];
    const right_knee = keypoints['right_knee'];
    const right_hip = keypoints['right_hip'];

    const left_hip_angle = calculateAngle(left_shoulder,left_hip,left_knee);
    const right_hip_angle = calculateAngle(right_shoulder,right_hip,right_knee);

    if(left_hip_angle != null || right_hip_angle != null
      && left_ear && right_ear && left_wrist && right_wrist
    ){
      

    if ( poseMatcher(left_hip_angle,140) || poseMatcher(right_hip_angle,140)) {
        if(checkSitUp){
            setCheckSitUp(false);
        }else{
          console.log("올라가세요");
          onFeedback('올라가세요')
        }
       
     } else if ( poseMatcher(left_hip_angle,120) || poseMatcher(left_hip_angle,120)){
          
        if(!checkSitUp){
          onFeedback('좋아요')
          console.log("좋아요");
          setCount(count => count + 1);
          console.log(count);
          setCheckSitUp(true);
        }
       
     } else if (poseMatcher(left_hip_angle,80) || poseMatcher(right_hip_angle,80)){
        console.log("허리에 무리가 갈 수 있으니 약간만 올리세요")
        onFeedback('허리에 무리가 갈 수 있으니 약간만 올리세요')

     }  else if(calculateDistance(left_wrist, left_ear) < 5 || calculateDistance(right_wrist,right_ear) < 5){
      console.log('목을 당기지 마세요')     
      onFeedback('목을 당기지 마세요')
    }
  }else{
    onFeedback('전신이 나오도록 측면으로 자세를 잡아주세요')
  }

 
};


export default SitUp;
