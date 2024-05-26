IP_URL = process.env.EXPO_PUBLIC_IP_URL;
PORT = process.env.EXPO_PUBLIC_PORT;

//오늘의 식단 데이터 가져오기 (app/dietScreen.js)
export const getTodayMeal = async (userId) => {
    try {
    const response = await fetch(`${IP_URL}:${PORT}/users/${userId}/todayMeal`, {
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