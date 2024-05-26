import React from 'react';
import { Image, View } from 'react-native';

// 예시에서는 고정된 문자열로 보여줌
// 환경 변수에서 기본 경로를 가져옵니다.
const baseGifPath = process.env.EXPO_PUBLIC_LOCAL_URI_GIF;

// 기본 경로에 파일명을 추가하여 전체 파일 경로를 구성
// 여기서는 확인을 위해 고정된 파일명을 사용. 실제로는 파일명을 동적으로 처리해야 함.
// 예를들면 운동을 완료한 사용자의 운동에 따라 다른 파일명을 사용하도록 처리해야 함.
const gifImagePath = `${baseGifPath}situp.gif`;

const CharacterGif = () => {
    console.log('Gif image path:', gifImagePath); // 이미지 경로 로그
    return (
        <View>
            <Image
                style={{ width: 300, height: 300 }}
                source={{ uri: gifImagePath }}
                onLoad={() => console.log('Image loaded!')} // 이미지가 로드될 때 호출
                onError={(e) => console.log('Image loading error:', e.nativeEvent.error)} // 로드 실패 시 호출
            />
        </View>
    );
};

export default CharacterGif;
