import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { calculateAngle } from './calculate';
import { poseMatcher } from './PoseMatcher';

const ShoulderPress = ({ exerciseData, poses, updateSets, updateCount, onFeedback, onExerciseComplete }) => {
  //console.log(poses)

  const [count, setCount] = useState(0);
  const [sets, setSets] = useState(0);
  const [checkPress, setCheckPress] = useState(false);

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
    const left_elbow = keypoints['left_elbow'];
    const left_wrist = keypoints['left_wrist'];
    const left_hip = keypoints['left_hip']
    const right_shoulder = keypoints['right_shoulder'];
    const right_elbow = keypoints['right_elbow'];
    const right_wrist = keypoints['right_wrist'];
    const right_hip = keypoints['right_hip']
  
    const left_elbow_angle = calculateAngle(left_shoulder, left_elbow, left_wrist);
    const left_shoulder_angle = calculateAngle(left_elbow,left_shoulder,right_shoulder);
    const right_elbow_angle = calculateAngle(right_shoulder, right_elbow, right_wrist);
    const right_shoulder_angle = calculateAngle(right_elbow,right_shoulder,left_shoulder);

    
      if(left_elbow_angle !=null && left_shoulder_angle != null && right_elbow_angle != null && right_shoulder_angle !=null) {
        console.log('left_shoulder_angle',left_shoulder_angle, 'right_shoulder_angle',left_elbow_angle)
       
    
        if (poseMatcher(left_elbow_angle,120) && poseMatcher(left_shoulder_angle, 120) 
         
        ) {
            
            if(checkPress){ 
                console.log('잘했어요')
                onFeedback('잘했어요')
                setCheckPress(false); 
            }else{
              console.log('올리세요');
              onFeedback('올리세요')
            }
           
        } else if (poseMatcher(left_elbow_angle,170) && poseMatcher(left_shoulder_angle, 170)
        ) {
          if (!checkPress) { 
              console.log('좋아요');
              onFeedback('좋아요')
               setCount(count => count + 1)
               console.log(count)
               setCheckPress(true); //초기화
            }
           
        } else if (!checkPress && poseMatcher(left_shoulder_angle, 175) 
             && poseMatcher(right_shoulder_angle,175)
        ) {
          console.log('과도하게 내리지 마세요');
        } 
      }else{
        onFeedback('누운 자세에서 정수리가 보이도록 자세를 잡아주세요')
      }

};


export default ShoulderPress;
