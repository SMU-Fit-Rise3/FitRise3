const math = require('mathjs');

exports.updateStressData = async function (req, res) {
    const userId = parseInt(req.params.userId);  // URL 파라미터에서 userId 가져오기
    const gValues = req.body.gValues;


    try {
        //fft적용
        let fftArray = math.fft(math.complex(gValues));
        let sampleRate = 25; //프레임
        // 파워 스펙트럼 계산=복수수의 절대값의 제곱
        const powerSpectrum = fftArray.map(c => calculateMagnitude(c) ** 2);

        // 주파수 분해능 = 주파수 점과 점사이의 거림 = 샘플레이트/fft길이
        const fftLength = fftArray.length;
        const frequencyResolution = sampleRate / fftLength;

        // LF와 HF 범위 인덱스 계산
        const lfRange = [0.04 / frequencyResolution, 0.15 / frequencyResolution];
        const hfRange = [0.15 / frequencyResolution, 0.4 / frequencyResolution];

        // LF 및 HF 파워 계산 floor:올림 ceil:내림 reduce 배열 값을 하나로 줄여 주는 함수(acc 누적값, val 현재 값 , 0 초기값)
        const lfPower = powerSpectrum.slice(Math.floor(lfRange[0]), Math.ceil(lfRange[1])).reduce((acc, val) => acc + val, 0);
        const hfPower = powerSpectrum.slice(Math.floor(hfRange[0]), Math.ceil(hfRange[1])).reduce((acc, val) => acc + val, 0);

        // 스트레스 비율 계산
        let stressRatio;
        if (hfPower >= 2 * lfPower) {
            stressRatio = lfPower / hfPower;
        } else {
            stressRatio = hfPower / lfPower;
        }

        console.log(`Stress Ratio: ${stressRatio}`);
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { stressIndex: stressRatio }
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/*
요청 코드
const gChannelValues = [128, 200, 150, 175]; // 예시 G 채널 값

fetch('http://211.58.143.157:50123/users/:id/stress', {
    method: 'PATCH', // PATCH 메서드를 사용
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        gValues: gChannelValues
    })
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch((error) => console.error('Error:', error));
*/