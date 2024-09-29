IP_URL = process.env.EXPO_PUBLIC_IP_URL;
PORT = process.env.EXPO_PUBLIC_PORT;

//날짜별 분석 관련 정보 가져오기 (app/analysisScreen.js)
export const getAnalysis = async (userId) => {
    try {
        const response = await fetch(`http://${IP_URL}:${PORT}/users/${userId}/analysis`, {
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