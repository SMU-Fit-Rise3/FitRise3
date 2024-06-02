import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { calculateAngle } from './calculate';
import { poseMatcher } from './PoseMatcher';

const LegRaise = ({ exerciseData, poses, updateSets, updateCount, onFeedback, onExerciseComplete }) => {

  const [count, setCount] = useState(0);
  const [sets, setSets] = useState(0);
  const [checkLeg, setCheckLeg] = useState(false);

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
    const left_hip = keypoints['left_hip'];
    const left_knee = keypoints['left_knee'];
    const right_shoulder = keypoints['right_shoulder'];
    const right_hip = keypoints['right_hip'];
    const right_knee = keypoints['right_knee'];
  
   
    const left_hip_angle = calculateAngle(left_shoulder,left_hip,left_knee)
    const right_hip_angle = calculateAngle(right_shoulder,right_hip,right_knee);

    if(left_hip_angle || right_hip_angle){
      console.log(left_hip_angle)

      if ( poseMatcher(left_hip_angle,140) && poseMatcher(right_hip_angle,140)) {
         console.log('좋아요')
         onFeedback('좋아요')
         if(!checkLeg){
            setCount(count => count + 1)
            setCheckLeg(true);
         }
        
     } else if (poseMatcher(left_hip_angle,100) && poseMatcher(right_hip_angle,100)){
        if(checkLeg){
          console.log("잘했어요");
          onFeedback('잘했어요')
          setCheckLeg(false)
        } else{
          console.log("다리를 천천히 내리세요")
          onFeedback('다리를 천천히 내리세요')
        }

     }  else if( poseMatcher(left_hip_angle,160) && poseMatcher(right_hip_angle,160)){
        console.log('허리가 뜨지 않을 만큼만 내리세요')
     }

    }else{
      onFeedback('전신이 나오도록 측면으로 자세를 잡아주세요')
    }

 
};


export default LegRaise;
