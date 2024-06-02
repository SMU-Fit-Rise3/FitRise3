import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet  } from 'react-native';
import { calculateAngle } from './calculate';
import { poseMatcher } from './PoseMatcher';

const Curl = ({  exerciseData, poses, updateSets, updateCount, onFeedback, onExerciseComplete }) => {
  const [count, setCount] = useState(0);
  const [sets, setSets] = useState(0);
  const [checkCurl, setCheckCurl] = useState(false);

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
const right_shoulder = keypoints['right_shoulder'];
const right_elbow = keypoints['right_elbow'];
const right_wrist = keypoints['right_wrist'];

const left_elbow_angle = calculateAngle(left_shoulder, left_elbow, left_wrist); 
const right_elbow_angle = calculateAngle(right_shoulder, right_elbow, right_wrist);

if(left_elbow_angle !=null && right_elbow_angle != null ) {
  console.log(left_elbow_angle)


if (poseMatcher(left_elbow_angle ,160) && poseMatcher(right_elbow_angle,160)) {
 console.log('dddddddd',checkCurl)
  if(checkCurl){ 
    console.log('잘했어요')
    onFeedback('잘했어요');
    setCheckCurl(false);
  }else{
    console.log("올리세요");
    onFeedback('올리세요');
  }
  
} else if (poseMatcher(left_elbow_angle,20) && poseMatcher(right_elbow_angle,20)) {
  console.log(checkCurl)
  if (!checkCurl) {
    setCount(count => count + 1);
    updateCount(count)
    setCheckCurl(true);
      console.log(count);

  }
 
} else if (!checkCurl && !poseMatcher(left_elbow_angle,40) &&  poseMatcher(right_elbow_angle,40)) {
  console.log("더 올리세요");
  onFeedback('더 올리세요');
}

}else {
  onFeedback('상체가 나오도록 자세를 잡아주세요.')
}


};


export default Curl;
