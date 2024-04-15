import React from 'react';
import { useRouter } from "expo-router";
import { SafeAreaView, View, StyleSheet, Text,Dimensions } from 'react-native';
import CharacterCAM from '../src/components/CharacterCAM';
import CustomButton from '../src/components/CustomBtn'; 

const { width, height } = Dimensions.get('window'); // Get the screen dimensions


const characterGAN = () => {
    const router = useRouter();
    const handleNextPress = () => {
        console.log('다음 버튼 눌림'); // 다음 화면으로 이동하는 로직
        router.push('/mainScreen') //화면 이동
    };
    // 카메라로부터 사진을 받는 함수
    const handleTakePicture = (photo) => {
        console.log(photo);
        // 사진을 처리하는 로직을 여기에 작성
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>나만의 캐릭터를 생성하세요🏃🏻</Text>
            <CharacterCAM 
                onTakePicture={handleTakePicture} 
                onNextPress={handleNextPress} />
            <CustomButton
                buttonStyle={styles.Btn} 
                title="다음"
                onPress={handleNextPress}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems:"center",
        padding: 20,
        backgroundColor: '#FFFFFF', // 여기서 배경색을 원하는 색상으로 설정하세요.
    },
    Btn:{
        backgroundColor: '#99aff8',
        width: width * 0.8
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default characterGAN;
