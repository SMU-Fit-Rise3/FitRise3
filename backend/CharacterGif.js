import React from 'react';
import { Image, View } from 'react-native';

// 예시에서는 고정된 문자열로 보여줌
// 환경 변수에서 기본 경로를 가져옵니다.
const baseGifPath = process.env.EXPO_PUBLIC_LOCAL_URI_GIF;

// 기본 경로에 파일명을 추가하여 전체 파일 경로를 구성합니다.
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
