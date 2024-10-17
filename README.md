# FitRise-Plus
### :즐거움을 추구하는 건강관리 어플리케이션
<img src="/src/assets/images/FitRise_Plus-Logo.png" height="400" width="100%">

### 시연 영상 (App demo video)
[Youtube]
https://www.youtube.com/watch?v=WapTDf8Xljw

<br/><br/>

# 목차

<details open="open">
  <ol>
    <li><a href="#features"> 기능 설명 (detail of fuction) </a></li>
    <li><a href="#stacks"> 시스템 아키텍처 및 기술 스택 (System Architecture
&& Techniques Used) </a></li>
    <li><a href="#install"> 프로젝트 사용법 (Getting Started)</a></li>
    <li><a href="#team"> 팀 정보 (Team Information)</a></li>
  </ol>
</details>

<br/><br/>

<br/><br/>

<h1 id="features"> :iphone: 1. 기능 설명 (detail of fuction) </h1>

### AI를 통한 나만의 캐릭터 생성(Create your own character using AI)
GAN 모델(FreezG 기반)을 활용하여 사용자의 사진을 2D 캐릭터로 변환
생성된 캐릭터 얼굴을 Haar-cascade 알고리즘을 사용하여 깔끔하게 추출하여 몸 템플릿과 합성하여 캐릭터 완성

<img src="/src/assets/images/사용자-캐릭터-생성.gif" width="200" height="300"/>

### 생성된 캐릭터 움직임 부여(Granting created character movement)
Rokoko를 사용하여 모션캡처 데이터를 추출하고 이를 Animated Drawings 오픈프로젝트를 활용하여 완료한 운동 움직임을 캐릭터 부여

<img src="/src/assets/images/캐릭터-움직임-부여.gif" width="200" height="300"/> <img src="/src/assets/images/캐릭터-한-운동-움직임-부여.gif" width="200" height="300"/>


### 운동 자세 실시간 피드백(Real-time feedback on exercise posture)
MoveNet Pose Detection 모델을 활용하여 사용자 관절 인식 및 추적
개발한 운동 자세 관절 각도를 계산하는 알고리즘을 사용하여 자세 피드백 제공 (텍스트, 음성)
운동 갯수 측정

<img src="/src/assets/images/운동자세-피드백.gif" width="200" height="300"/>

### 얼굴 분석을 통한 스트레스 측정(Stress measurement through facial analysis)
Blaze face모델 얼굴인식을 통한 원격 광혈류측정 기술(RPPG)을 사용하여 심박 측정 및 스트레스 수치로 변환하여 제공  
<img src="/src/assets/images/스트레스-측정.gif" width="200" height="300"/>

### AI를 통한 맞춤 운동루틴(Customized exercise routine through AI)
Open AI APi를 사용하여 사용자 정보에 따른 운동루틴 생성 후 리스트로 제공  
<img src="/src/assets/images/맞춤형-운동루틴-추천.gif" width="200" height="300"/>

### 식단 관리,등록,분석 (diet management, registration, analysis)
사용자의 신체 정보를 기반으로 계산된 하루 권장 섭취량에 맞는 탄단지 비율 제공
영양성분 API를 활용하여 구성된 음식 리스트에서 섭취한 음식 골라서 등록 가능
선택한 음식의 상세 영양성분 확인 가능  
<img src="/src/assets/images/식단등록.gif" width="200" height="300"/>
<img src="/src/assets/images/식단분석.gif" width="200" height="300"/>
<img src="/src/assets/images/탄단지추천.gif" width="200" height="300"/>

### 운동, 식단, 몸무게 캘린더 기록 및 그래프화 (Calendar Record and graph exercise, diet, and weight)
그래프를 통해 사용자가 측정한 스트레스 수치를 월 단위로 확인 가능  
사용자가 입력하는 몸무게 정보를 기반으로 BMI 지수 계산 및 그래프에 시각화  
사용자가 일주일 동안 섭취한 음식의 영양성분을 평균 내어 그 주의 부족한 영양성분 정보 제공  
캘린더에서 식단 정보, 수행한 운동 정보, 입력한 몸무게 정보 확인 가능  
<img src="/src/assets/images/캘린더-및-그래프.gif" width="200" height="300"/>

<br/><br/>

<br/><br/>

<h1 id="stacks"> :hammer_and_wrench: 2. 시스템 아키텍처 (System Architecture)</h1>

<img src="/src/assets/images/fitrise아키텍처.png" height="450" width="100%">

## 기술스택
- **Frontend**: ⚛️ React Native, 🎉 Expo, 🧠 TensorFlow.js, 🎨 Lottie
- **Backend**: 🟩 Node.js, 🚀 Express.js, ⚗️ Flask, 🦄 Gunicorn, 🔥 PyTorch, 📡 Socket.IO
- **Database**: 🍃 MongoDB
- **DevOps**: 🐳 Docker, ☁️ AWS (S3, EC2)
- **Tools**: 🔧 Git, 🧙‍♂️ Prisma, 🐍 Boto3, 📦 tmux, 👁 OpenCV

## 버전 정보

### 1. Frontend
- **React Native**: `0.73.2`
- **Expo**: `50.0.1`
- **TensorFlow.js**: `4.17.0`
- **Lottie**: `6.5.1`

### 2. Backend
- **Node.js**: `20.11.1 LTS`
- **Express.js**: `4.19.2`
- **Flask**: `2.3.2`
- **Gunicorn**: `23.0.0`
- **Socket.IO**: `4.7.5`

### 3. Database
- **MongoDB**: `MongoDB Atlas`

### 4. DevOps

### 5. Tools
- **Prisma**:  `5.11.0`
- **Boto3**: `1.35.22`
- **OpenCV**: `4.6.0.66`

<br/><br/>

<br/><br/>

<h1 id="install"> :rocket: 3. 프로젝트 사용법 (Getting Started) </h1>

### Environment Variables (환경변수들)

```
#FrontEnd .env (/.env)
EXPO_PUBLIC_IP_URL = "Node Server IP"
EXPO_PUBLIC_FLASK_IP_URL = "Flask Server IP"
EXPO_PUBLIC_PORT = "8083" #Node Server PORT
EXPO_PUBLIC_SOCKET_PORT = "5000" #Flask Server PORT
```

```
#Node server .env(/backend/.env) 
DATABASE_URL="MongoDB URL"
OPENAI_API_KEY="OPENAI API KEY"

# compose 사용시 설정
GUNICORN_IMAGE_NAME="gunicorn server image name"
TORCH_IMAGE_NAME="torch server image name"
NODE_IMAGE_NAME="node server image name"

```

```
#Flask server .env(/backend/flask/.env)
NODE_PORT = "8083" #Node server PORT
S3_BUCKET="S3 Bucket Name"
S3_KEY = "S3 Access Key"
S3_SECRET = "S3 Secret key"
S3_REGION = "S3 Region"

# 도커 이미지 빌드시 IP대신 컨테이너 이름
TORCH_IP_URL= "torchserver"
NODE_IP_URL = "nodeserver"

# 로컬 서버
# TORCH_IP_URL= "Animated drawings TorchServer IP"
# NODE_IP_URL = "Node Server IP"
```
<br/>

## App Run
```console
$ git clone --recurse-submodules https://github.com/SMU-Fit-Rise/FitRise.git
$ yarn or npm install
# 위에 서술된 환경변수들 저장 (save the environment variables described above)
$ npx expo start
# Node, flask or gunicorn, Animated Pytorch 서버실행(Starting the server)
```

## Docker로 서버실행

### First. Install Docker

### Second. Create network 
```console
docker network create my_network
```

### Third. Run server

#### Gunicorn Server 
```console
$ cd ./backend/flask
$ docker build -t gunicornserver .
$ docker run -d --name gunicornserver -p 5000:5000 --network my_network gunicornserver
```

#### Node Server
```console
$ cd ./backend 
$ docker build -t nodeserver .
$ docker run -d --name nodeserver -p 8083:8083  --network my_network nodeserver
```

#### Animated Pytorch Server
```console
$ cd ./backend/flask/AnimatedDrawings
$ docker build -t docker_torchserve .
$ torchserve % docker run -d --name torchserver -p 8080:8080 -p 8081:8081 --network my_network docker_torchserve
```

#### Docker Compose use 
```console
$ cd ./backend 
$ docker build -t nodeserver .
$ cd ./flask
$ docker build -t gunicornserver .
$ cd ./AnimatedDrawings
$ docker build -t docker_torchserve .
$ cd ../..
$ docker compose up
```

## Local로 서버실행

#### Flask Server
```console
$ cd ./backend/flask
$ pip install -r requirements.txt
// 위에 서술된 환경변수들 저장
$ python server.py
```

#### Node Server
```console
$ cd ./backend
$ yarn or npm install
// 위에 서술된 환경변수들 저장
$ node server.js
```

#### Animated Pytorch Server
##### First. Install Docker
##### Second. Run Server
```console
$ cd ./backend/flask/AnimatedDrawings
$ docker build -t docker_torchserve .
$ torchserve % docker run -d --name torchserver -p 8080:8080 -p 8081:8081 docker_torchserve
```
<br/><br/>
<br/><br/>

<h1 id="team"> :family_man_man_girl_boy: 4. 팀 정보 (Team Information) </h1>
<br/>

|  팀원  |     역할     |     GitHub     |         Email         |
| :----: | :----------: | :------------: | :-------------------: |
| 최우진 |   FE & AI  |   woojin-choi518   |  twinsno119@gmail.com |
| 엄득용 |   Full-Stack |   EomDeukyong  |  emrdyd664@gmail.com  |
| 신은화 |   BE & AI   |   eunhwa0308   |  eunhwa3458@gmail.com |
| 전하영 |   BE & AI |   Hayeong-Jeon     |  wjsgkdd@gmail.com  |
