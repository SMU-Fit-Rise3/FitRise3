import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';

const exerciseToGifMap = {
    "팔 굽혀 펴기": "new_kneepushup",
    "윗몸 일으키기": "leg_raises",
    "스쿼트": "squat",
    "덤벨 플라이": "dumbbell_floor_fly",
    "덤벨 컬": "dumbbell_curl",
    "덤벨 숄더 프레스": "dumbbell_curl_shoulder",
    "사이드 레터럴 레이즈": "side_lateral_raises",
    "덤벨 트라이셉스 익스텐션": "dumbbell_tricep_extension",
    "춤": "dab"
};

const CharacterGif = ({ doExercise, gifUrl }) => {
    return (
        <View style={styles.container}>
            {doExercise.map((exercise, index) => {
                // 각 운동 이름에 따라 파일 경로를 설정
                const gifFileName = exerciseToGifMap[exercise];             
                const gifImagePath = Array.isArray(gifUrl) 
                    ? gifUrl.find(url => url.endsWith(`${gifFileName}.gif`)) 
                    : null; // gifUrl이 undefined일 경우 null 또는 기본값을 설정
                return gifImagePath ? (
                    <Image
                        key={index}
                        style={styles.image}
                        source={{ uri: gifImagePath }}
                        onLoad={() => console.log('Image loaded!', gifImagePath)} // 이미지가 로드될 때 호출
                        onError={(e) => console.log('Image loading error:', e.nativeEvent.error, gifImagePath)} // 로드 실패 시 호출
                    />
                ) : null;
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