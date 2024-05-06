IP_URL = process.env.EXPO_PUBLIC_IP_URL;
PORT = process.env.EXPO_PUBLIC_PORT;

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

export const insertCalories = async (userId, calorieGoal, carbs, protein, fat) => {
    try {
        const response = await fetch(`${IP_URL}:${PORT}/users/${userId}/calories`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                calorieGoal : calorieGoal,
                carbs : carbs,
                protein : protein,
                fat : fat
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        console.log("Calorie information updated successfully")
        return result;
    } catch (error) {
        return console.error('Error:', error);
        return null;
    }
};