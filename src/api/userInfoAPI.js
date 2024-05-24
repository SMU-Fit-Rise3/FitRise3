IP_URL = process.env.EXPO_PUBLIC_IP_URL;
PORT = process.env.EXPO_PUBLIC_PORT;

//유저생성(app/InfoInput.js)
export const createUser = async (userData) => {
  try {
    const response = await fetch(`${IP_URL}:${PORT}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending user data:', error);
    return null;
  }
}

//목표 칼로리 생성(UI/MacroCalculator.js)
export const insertCalories = async (userId, totalCalories, carbs, protein, fat) => {
  try {
    const response = await fetch(`${IP_URL}:${PORT}/users/${userId}/calories`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        calorie_goal: totalCalories,
        carbs: carbs,
        protein: protein,
        fat: fat
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending user data:', error);
    return null;
  }
}


//닉네임 중복 체크 (app/InfoInput.js, app/login.js)
export const checkNickName = async (name) => {
  try {
    const response = await fetch(`${IP_URL}:${PORT}/namecheck/${name}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    console.error('Error:', error);
  }
};


