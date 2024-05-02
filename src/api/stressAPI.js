IP_URL=process.env.IP_URL;
PORT=process.env.PORT;
//스트레스 업데이트 (components/CameraComponent.tsx)
export const updateStress = async (userId, gMeanValues) => {
    try {
    const response = await fetch(`${IP_URL}:${PORT}/users/${userId}/stress/calculate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        gValues: gMeanValues
      })
    });
    const data = await response.json();
    return console.log('Success:', data);
  } catch (error) {
    return console.error('Error:', error);
  }
};

//스트레스 데이터 가져오기 ()
export const getStress = async (userId) => {
    try {
    const response = await fetch(`${IP_URL}:${PORT}/users/${userId}/stress`, {
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
