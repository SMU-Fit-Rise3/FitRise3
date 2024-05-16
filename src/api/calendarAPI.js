IP_URL = process.env.EXPO_PUBLIC_IP_URL;
PORT = process.env.EXPO_PUBLIC_PORT;

//달력 정보 가져오기 (app/calendarScreen.js)
export const getCalendar = async (userId) => {
    try {
        const response = await fetch(`${IP_URL}:${PORT}/users/${userId}/calendar`, {
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
