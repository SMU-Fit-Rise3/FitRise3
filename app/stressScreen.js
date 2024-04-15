import React from 'react';
import { useRouter } from "expo-router";
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import TabBar from '../src/components/TabBar.js';
import CharacterCAM from '../src/components/CharacterCAM';
import RefreshList from '../src/components/ExerciseList.js';
import StressLevelIndicator from '../src/components/StressLevelIndicator.js';


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
        <View style={styles.mainContainer}>
            <Text style={styles.title}>스트레스를 측정해보세요🙂</Text>
            <View style={styles.container}>
                <CharacterCAM onTakePicture={handleTakePicture} onNextPress={handleNextPress}/>
            </View>
            <View style={styles.container}>
                <StressLevelIndicator stressLevel={1}/>
            </View>
                <View style={styles.container}>
                    <Text style={styles.title}>🌿Refresh Routine🌿</Text>
                    <RefreshList/>
                </View>  
            <TabBar/>     
        </View>
    );
};

// 여기에 스타일을 정의합니다.
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: 20,
        backgroundColor:"white",
        justifyContent:"space-between"
    },
    container: {
        flex:1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop:40,
    },
});

export default stressScreen;
