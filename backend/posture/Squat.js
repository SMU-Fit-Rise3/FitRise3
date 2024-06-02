// PostureSquat.js
import React,{ useEffect, useState }from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { calculateAngle } from './calculate';
import { poseMatcher } from './PoseMatcher';


const Squat = ({ exerciseData, poses, updateSets, updateCount, onFeedback, onExerciseComplete }) => {
  console.log("들어왔음~~~~~~~~~~")
  
  const [count, setCount] = useState(0);
  const [sets, setSets] = useState(0);
  const [checkSquat,setCheckSquat] = useState(false);

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
  }


  const keypoints = poses[0].keypoints.reduce((acc, keypoint) => {
    //console.log('ddddd')
      acc[keypoint.name] = { x: keypoint.x, y: keypoint.y, score: keypoint.score };
      //console.log(keypoint.name); 
    return acc;
  }, {});
  
 // console.log(keypoints)

  const left_shoulder = keypoints['left_shoulder'];
  const right_shoulder = keypoints['right_shoulder'];
  const left_hip = keypoints['left_hip'];
  const right_hip = keypoints['right_hip'];
  const left_knee = keypoints['left_knee'];
  const right_knee = keypoints['right_knee'];
  const left_ankle = keypoints['left_ankle'];
  const right_ankle = keypoints['right_ankle'];


  // const disp_feedback_1 = 'Lift your back a little';
  // //const disp_feedback_2 = 'Bend your back forward';
  // const disp_feedback_3 = 'Knee is falling over toe';
  // const disp_feedback_4 = 'Squat is too deep';

  const left_hip_angle = calculateAngle(left_shoulder,left_hip,left_knee);
  const right_hip_angle = calculateAngle(right_shoulder,right_hip,right_knee);
  const left_knee_angle = calculateAngle(left_hip,left_knee,left_ankle);
  const right_knee_angle = calculateAngle(right_hip,right_knee,right_ankle);

  console.log(left_hip_angle)

    if(left_hip_angle != null && right_hip_angle != null && left_knee_angle != null && right_knee_angle != null ){
      console.log(left_knee_angle)
      if (poseMatcher(left_hip_angle,60) && poseMatcher(right_hip_angle,60)
          && poseMatcher(left_knee_angle,70) && poseMatcher(right_knee_angle,70)
      ){
        console.log('올라가세요')
        onFeedback('올라가세요')
        if(!checkSquat){
           setCheckSquat(true);
           setCount(count => count + 1 );

        }
     
      }
      else if(poseMatcher(left_knee_angle,180) && poseMatcher(right_knee_angle,180)){
        //console.log(disp_feedback_2);
        if(checkSquat){
          onFeedback('잘했어요')
          console.log('잘했어요')
          setCheckSquat(false)
        }
      } else if(poseMatcher(left_hip_angle,20) && poseMatcher(right_hip_angle,20)){
        onFeedback('허리를 구부리지 마세요')
        console.log('허리를 구부리지 마세요')

      } else if(poseMatcher(left_knee_angle,50) && poseMatcher(right_knee_angle,50)){
        onFeedback('너무 앉으셨어요')
        console.log('너무 앉으셨어요')

      } else if (left_knee.x > left_ankle.x + 25|| right_knee.x > right_ankle.x + 25) {
        onFeedback('Knees should not pass your toes. Try to sit back more.');
        console.log('무릎이 발끝보다 나오지 않도록 하세요')

      } else if (left_shoulder.x > left_knee.x + 5 || right_shoulder.x > right_knee.x +5){
        onFeedback('허리를 구부리지 마세요')
        console.log('허리를 구부리지 마세요')
      }
    }else{
      onFeedback('전신이 나오도록 측면으로 서 주세요')
    }


};


export default Squat;
