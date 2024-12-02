const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();
app.use(express.json()) // body parsing 관련
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
const port = 8083;


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    console.log(req)
    res.status(200).json({ name: "true", server: "fitrise_server", data: req.body });
})

//스트레스 관련 api
const stressAPI = require('./api/stressData');
app.patch('/users/:id/stress/calculate', stressAPI.updateStressData);  //스트레스 계산 && DB저장
app.get('/users/:id/stress', stressAPI.getStressData);  //스트레스 데이터 가져오기


//유저 정보 관련 api
const userInfoAPI = require('./api/userInfo');
app.post('/users',userInfoAPI.postUserData); //유저 데이터 생성
app.put('/users/:id/calories',userInfoAPI.insertCalorieData); //칼로리 정보 insert 
app.get('/namecheck/:name', userInfoAPI.nameCheck);  //닉네임 중복체크

//운동 루틴 관련 api
const exerciseAPI = require('./api/exerciseData');
app.get('/users/:id/exercise',exerciseAPI.getExerciseData); //유저 운동루틴 가져오기
app.post('/users/:id/exercise/:exerciseId/complete',exerciseAPI.completedExercise) // 해당 운동 ex_plans에서 삭제 && calendar에 추가
app.get('/users/:id/doExercise',exerciseAPI.getDoExerciseData); //유저 오늘 한 운동 가져오기

//달력 관련 api
const calendarAPI = require('./api/calendarData');
app.get('/users/:id/calendar',calendarAPI.getCalendarData); //캘린더 데이터 가져오기
app.patch('/users/:id/weight',calendarAPI.updateWeightData); //유저 몸무게 저장
app.post('/users/:id/eatFood',calendarAPI.postEatFood); //유저 식단 데이터 생성

//식단 화면 관련 api
const mealAPI = require('./api/mealData');
app.get('/users/:id/todayMeal',mealAPI.getTodayMealData); //오늘의 식단 데이터 가져오기

//분석 화면 관련 api
const analysisAPI = require('./api/analysisData');
app.get('/users/:id/analysis',analysisAPI.getAnalysisData);

//사용자 Gif 관련 api
const gifAPI = require('./api/gifData');
app.patch('/users/:id/gif',gifAPI.patchGifUrl); //gif url 저장

//사용자 Music 관련 api
const musicAPI = require('./api/musicData');
app.get('/users/:id/music',musicAPI.getMusicData);
app.post('/users/:id/music',musicAPI.postMusicData);