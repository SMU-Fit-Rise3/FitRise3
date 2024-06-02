import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { calculateAngle, calculateDistance } from './calculate';
import { poseMatcher } from './PoseMatcher';

const Triceps = ({ exerciseData, poses, updateSets, updateCount, onFeedback, onExerciseComplete }) => {

  const [count, setCount] = useState(0);
  const [sets, setSets] = useState(0);
  const [checkTriceps, setCheckTriceps] = useState(false);

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
    const left_eye = keypoints['left_eye'];
    const left_elbow = keypoints['left_elbow'];
    const left_wrist = keypoints['left_wrist'];
    const left_hip = keypoints['left_hip']
    const right_shoulder = keypoints['right_shoulder'];
    const right_eye = keypoints['right_eye'];
    const right_elbow = keypoints['right_elbow'];
    const right_wrist = keypoints['right_wrist'];
    const right_hip = keypoints['right_hip']
  
    const left_elbow_angle = calculateAngle(left_shoulder, left_elbow, left_wrist);
    const left_shoulder_angle = calculateAngle(left_elbow,left_shoulder,left_hip);
    const right_elbow_angle = calculateAngle(right_shoulder, right_elbow, right_wrist);
    const right_shoulder_angle = calculateAngle(right_elbow,right_shoulder,right_hip);

    
    if(left_elbow_angle !=null && left_shoulder_angle != null && right_elbow_angle != null && right_shoulder_angle !=null) {
        //console.log('left_shoulder_angle',left_elbow_angle, 'right_shoulder_angle',right_elbow_angle)
       
        console.log( calculateDistance(left_wrist, left_eye))
    
        if (poseMatcher(left_elbow_angle,150) && poseMatcher(right_elbow_angle, 150)) {
            
          console.log('좋아요');
          onFeedback('좋아요');
          if (!checkTriceps) { 
               // speakDumbbellEnd();
               setCount(count => count + 1)
               console.log(count)
               setCheckTriceps(true); 
            }
      
        } else if (calculateDistance(left_wrist, left_eye) < 10 || calculateDistance(right_wrist,right_eye) < 10) {
         
          if(checkTriceps){ 
            // speakDumbbellStart();
             console.log('잘했어요')
             onFeedback('잘했어요')
             setCheckTriceps(false); 
         }else{
           console.log('올리세요');
           onFeedback('올리세요')
         }
        }  else if(left_elbow.x - right_elbow.x > 90){
          console.log('팔꿈치를 벌리면서 들지 마세요')  
          onFeedback('팔꿈치를 벌리면서 들지 마세요')   
        }

      }else{
        onFeedback('상체가 나오도록 자세를 잡아주세요')
      }

};


export default Triceps;
