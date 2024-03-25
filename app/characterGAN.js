import React from 'react';
import { useRouter } from "expo-router";
import { View, StyleSheet } from 'react-native';
import CharacterCAM from '../src/components/CharacterCAM';
import CustomButton from '../src/components/CustomBtn'; 

const characterGAN = () => {
    const router = useRouter();
    const handleNextPress = () => {
        console.log('다음 버튼 눌림'); // 다음 화면으로 이동하는 로직
        router.push('/InfoInput') //화면 이동
    };
    // 카메라로부터 사진을 받는 함수
    const handleTakePicture = (photo) => {
        console.log(photo);
        // 사진을 처리하는 로직을 여기에 작성
    };

    return (
        <View style={styles.container}>
            <CharacterCAM 
                onTakePicture={handleTakePicture} 
                onNextPress={handleNextPress} />
            <CustomButton 
                title="다음"
                onPress={handleNextPress}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#FFFFFF', // 여기서 배경색을 원하는 색상으로 설정하세요.
    },

});

export default characterGAN;
