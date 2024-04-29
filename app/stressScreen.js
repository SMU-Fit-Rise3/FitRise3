import React from 'react';
import { useRouter } from "expo-router";
import { View, StyleSheet, Text, Dimensions,SafeAreaView } from 'react-native';
import { CharacterCAM,ExerciseList,StressLevelIndicator,TabBar } from '../src/components'

const { width, height } = Dimensions.get('window'); // Get the screen dimensions

// 메인 화면 컴포넌트
const stressScreen = () => {
    const router = useRouter();
    const handleNextPress = () => {
        console.log('다음 버튼 눌림'); // 다음 화면으로 이동하는 로직
        router.push('/mainScreen') //화면 이동
    };
    const handleTakePicture = (photo) => {
        console.log(photo);
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>스트레스를 측정해보세요🙂</Text>
                <View style={styles.container}>
                    <CharacterCAM 
                        onTakePicture={handleTakePicture}
                        onNextPress={handleNextPress}
                        camStyle={styles.characterCamContainer}/>
                </View>
                <View style={styles.container}>
                    <StressLevelIndicator stressLevel={1}/>
                </View>
                <View style={styles.container}>
                    <Text style={styles.title}>🌿Refresh Routine🌿</Text>
                    <ExerciseList/>
                </View> 
            </View> 
            <TabBar/>     
        </SafeAreaView>
    );
};

// 여기에 스타일을 정의합니다.
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor:"#ddd",
        justifyContent:"space-evenly"
    },
    container: {
        flex:1,
        backgroundColor:"white",
    },
    characterCamContainer: {
        marginTop: 60,
        width: width * 0.5, // 이미지 컨테이너의 너비
        height: height * 0.3, // 이미지 컨테이너의 높이, 스크린 비율에 따라 조절 가능
        marginBottom:10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop:10,
    },
});

export default stressScreen;
