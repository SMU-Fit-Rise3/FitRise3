IP_URL = process.env.EXPO_PUBLIC_IP_URL;
PORT = process.env.EXPO_PUBLIC_PORT;

//운동루틴 가져오기 (List/ExerciseList.js)
export const getExercise = async (userId) => {
    try {
        const response = await fetch(`${IP_URL}:${PORT}/users/${userId}/exercise`, {
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
