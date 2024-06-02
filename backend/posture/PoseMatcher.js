export function poseMatcher (angle, targetAngle) {
    
    const OFFSET = 15.0;
    

    return angle < targetAngle + OFFSET && angle > targetAngle - OFFSET;

}

