import React, { useEffect, useState } from 'react';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../src/api'
import { View, StyleSheet, Text, Dimensions, SafeAreaView } from 'react-native';
import { CharacterCAM, ExerciseList, StressLevelIndicator, TabBar, StressBtn } from '../../src/components'

const { width, height } = Dimensions.get('window'); // Get the screen dimensions

// 메인 화면 컴포넌트
const stressScreen = () => {
    const [stressIndex, setStressIndex] = useState(0);
    useEffect(() => {
        try {
            AsyncStorage.getItem('userId').then((userId) => {
            API.getStress(userId)
                .then(data => {
                    if (data && data.stressIndex) {
                        setStressIndex(data.stressIndex);  // 데이터에서 스트레스 인덱스를 추출하여 상태 업데이트
                    }
                })
                .catch(error => {
                    console.error('Error fetching stress data:', error);
                });
            })
        } catch (error) {
            console.error('Error in useEffect:', error);
        }
    }, []);
    const handleTakePicture = (photo) => {
        console.log(photo);
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>스트레스를 측정해보세요🙂</Text>
                <View style={styles.container}>
                    <StressBtn/>
                </View>
                <View style={styles.container}>
                    <StressLevelIndicator stressLevel={stressIndex} />
                </View>
                <View style={styles.container}>
                    <Text style={styles.title}>🌿Refresh Routine🌿</Text>
                    <ExerciseList />
                </View>
            </View>
        </SafeAreaView>
    );
};

// 여기에 스타일을 정의합니다.
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#ddd",
        justifyContent: "space-evenly"
    },
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    characterCamContainer: {
        marginTop: 60,
        width: width * 0.5, // 이미지 컨테이너의 너비
        height: height * 0.3, // 이미지 컨테이너의 높이, 스크린 비율에 따라 조절 가능
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default stressScreen;
