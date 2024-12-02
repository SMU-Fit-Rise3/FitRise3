IP_URL = process.env.EXPO_PUBLIC_IP_URL;
PORT = process.env.EXPO_PUBLIC_PORT;
FLASK_IP=process.env.EXPO_PUBLIC_FLASK_IP_URL
FLASK_PORT=process.env.EXPO_PUBLIC_SOCKET_PORT

export const getMusic = async (userId) => {
    try {
        const response = await fetch(`http://${IP_URL}:${PORT}/users/${userId}/music`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            if (response.status === 404) {
                // 데이터가 없는 경우
                console.log('No music data. Show create button.');
                return false
            } else {
                throw new Error(`HTTP error: ${response.status}`);
            }
        } else {
            // 데이터가 있는 경우
            const data = await response.json();
            console.log('Music data:', data);
            return data
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

export const generateMusic = async (userId, stressLevel) => {
    try {
        // Flask 서버로 요청
        const response = await fetch(`http://${FLASK_IP}:${FLASK_PORT}/generate-audio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                stressLevel,
            }),
        });

        // 응답 상태 확인
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        // JSON 응답 데이터 처리
        const data = await response.json();
        console.log('Generated audio data:', data);
        return data; // 생성된 오디오 URL 정보 반환
    } catch (error) {
        // 오류 처리
        console.error('Error generating audio:', error);
        return { error: error.message }; // 호출 측에서 상태를 처리할 수 있도록 반환
    }
};
