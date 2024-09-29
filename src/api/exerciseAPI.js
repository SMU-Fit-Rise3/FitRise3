IP_URL = process.env.EXPO_PUBLIC_IP_URL;
PORT = process.env.EXPO_PUBLIC_PORT;

//운동루틴 가져오기 (List/ExerciseList.js)
export const getExercise = async (userId) => {
    console.log(IP_URL)
    try {
        const response = await fetch(`http://${IP_URL}:${PORT}/users/${userId}/exercise`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log('Success:', data);
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};

//운동 완료 클릭시 로직 (app/postureCorrection.js)
export const completedExercise = async (userId, exerciseId) => {
    try {
        const response = await fetch(`http://${IP_URL}:${PORT}/users/${userId}/exercise/${exerciseId}/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }      
        const data = await response.json();
        console.log('Success:', data);
        return data;
    } catch (error) {
        console.error('Error:',error);
    }
}

//다한 운동 가져오기 (List/ExerciseList.js)
export const getDoExercise = async (userId) => {
    try {
        const response = await fetch(`http://${IP_URL}:${PORT}/users/${userId}/doExercise`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    
        const data = await response.json();
        console.log(data);
        console.log('Success:', data);
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
  };
