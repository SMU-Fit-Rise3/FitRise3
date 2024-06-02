
// Score 임계값 설정
const SCORE_THRESHOLD = 0.5;

export function calculateAngle(A, B, C) {
  if(A.score > SCORE_THRESHOLD && B.score > SCORE_THRESHOLD && C.score > SCORE_THRESHOLD){
  const angleABtoBC = Math.atan2(C.y - B.y, C.x - B.x) - Math.atan2(A.y - B.y, A.x - B.x);
  let angleDegrees = angleABtoBC * (180 / Math.PI);
  if (angleDegrees < 0) {
    angleDegrees += 360;  // 음수 각도를 양수로 조정
  }
  if (angleDegrees > 180) {
    angleDegrees = 360 - angleDegrees;
}
  return angleDegrees;
  }else{
    return null;
  }
}
  

export function calculateDistance(point1, point2) {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
}
  
  