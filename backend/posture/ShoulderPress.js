
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

    //console.log('========',keypoints)
  
    const left_shoulder = keypoints['left_shoulder'];
    const left_elbow = keypoints['left_elbow'];
    const left_wrist = keypoints['left_wrist'];
    const left_hip = keypoints['left_hip']
    const right_shoulder = keypoints['right_shoulder'];
    const right_elbow = keypoints['right_elbow'];
    const right_wrist = keypoints['right_wrist'];
    const right_hip = keypoints['right_hip']
  
    const left_elbow_angle = calculateAngle(left_shoulder, left_elbow, left_wrist);
    const left_shoulder_angle = calculateAngle(left_elbow,left_shoulder,left_hip);
    const right_elbow_angle = calculateAngle(right_shoulder, right_elbow, right_wrist);
    const right_shoulder_angle = calculateAngle(right_elbow,right_shoulder,right_hip);

      if(left_elbow_angle !=null && left_shoulder_angle != null && right_elbow_angle != null && right_shoulder_angle !=null) {
       // console.log('left_shoulder_angle',left_shoulder_angle, 'right_shoulder_angle',right_shoulder_angle)
       console.log(left_wrist.x - right_wrist.x)
    
        if (poseMatcher(left_shoulder_angle,80) && poseMatcher(right_shoulder_angle,80)
        ) {    
            if(checkPress){ 
                console.log('잘했어요')
                onFeedback('잘했어요')
                setCheckPress(false); 
            }else{
              console.log('올리세요');
              onFeedback('올리세요')
            }
           
        } else if (poseMatcher(left_elbow_angle,150) && poseMatcher(left_shoulder_angle, 150)
          && poseMatcher(left_shoulder_angle,150) && poseMatcher(right_shoulder_angle,150)
        ) {
          if (!checkPress) { 
              console.log('좋아요');
              onFeedback('좋아요');
               setCount(count => count + 1)
               console.log(count)
               setCheckPress(true); 
            }
           
        } else if (checkPress & poseMatcher(left_shoulder_angle,110) && poseMatcher(right_shoulder_angle,110)
        ) {
          console.log('팔꿈치가 직각이 되도록 더 내리세요');
          onFeedback('팔꿈치가 직각이 되도록 더 내리세요')
        }  else if ( poseMatcher(left_elbow_angle,175) && poseMatcher(left_shoulder_angle, 175) )
         {
          console.log('팔을 과도하게 들어올리지 마세요');
          onFeedback('팔을 과도하게 들어올리지 마세요');

        } else if(left_wrist.x - right_wrist.x > 140){
          console.log('팔꿈치를 벌리면서 들지 마세요')     
        } else if(left_wrist.x - right_wrist.x < 70){
          console.log('팔꿈치를 모으면서 들지 마세요')     
        }

      }else {
        onFeedback('상체가 나오도록 자세를 잡아주세요.')
      }

};


export default ShoulderPress;
