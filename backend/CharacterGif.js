import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';

// 예시에서는 고정된 문자열로 보여줌
// 환경 변수에서 기본 경로를 가져옵니다.
const baseGifPath="file:///data/user/0/host.exp.exponent/files/";
// const baseGifPath = "";

// 기본 경로에 파일명을 추가하여 전체 파일 경로를 구성
// 여기서는 확인을 위해 고정된 파일명을 사용. 실제로는 파일명을 동적으로 처리해야 함.
// 예를들면 운동을 완료한 사용자의 운동에 따라 다른 파일명을 사용하도록 처리해야 함.
const exerciseToGifMap = {
    "팔 굽혀 펴기": "new_kneepushup",
    "윗몸 일으키기": "leg_raises",
    "스쿼트": "squat",
    "덤벨 플라이": "dumbbell_floor_fly",
    "덤벨 컬": "dumbbell_curl",
    "덤벨 숄더 프레스": "dumbbell_curl_shoulder",
    "사이드 레터럴 레이즈": "side_lateral_raises",
    "덤벨 트라이셉스 익스텐션": "dumbbell_tricep_extension",
    "춤": "jesse_dance"
};

const CharacterGif = ({ doExercise }) => {
    return (
        <View style={styles.container}>
            {doExercise.map((exercise, index) => {
                // 각 운동 이름에 따라 파일 경로를 설정
                const gifFileName = exerciseToGifMap[exercise];
                const gifImagePath = `${baseGifPath}${gifFileName}.gif`;

                return (
                    <Image
                        key={index}
                        style={styles.image}
                        source={{ uri: gifImagePath }}
                        onLoad={() => console.log('Image loaded!', gifImagePath)} // 이미지가 로드될 때 호출
                        onError={(e) => console.log('Image loading error:', e.nativeEvent.error, gifImagePath)} // 로드 실패 시 호출
                    />
                );
            })}
        </View>
    );
};


// 스타일 정의
const styles = StyleSheet.create({
    container: {
        flex: 1, // 부모 컨테이너를 꽉 채우도록 설정
        alignItems: 'center', // 가로 방향 중앙 정렬
        backgroundColor: '#fff', // 배경색 설정
        marginHorizontal: 20,
        borderRadius: 15,

    },
    image: {
        width: 300,
        height: 300,
    },
});

export default CharacterGif;