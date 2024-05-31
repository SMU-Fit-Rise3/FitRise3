import React, { useState } from 'react';
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';

import StressCamera from '../src/components/StressCamera.tsx';
import { useSelector } from 'react-redux';
import icons from '../constants/icons.js';
import { FeedBack, FloatingBtn, CustomBtn, InfoModal, ModalWebView, ScrollTextBox, PointComponent, LoadingModal } from '../src/components'
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../src/api';

const PostureCorrection = () => {

    const router = useRouter();
    // Main Screen ExerciseList에서 넘겨준 값
    const { title, count, id } = useLocalSearchParams();
    const exerciseData = {
        title: title,
        count: count,
        id: id
    };
    console.log(exerciseData.title)
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [exerciseFinished, setExerciseFinished] = useState(false);

    const handleFinishExercise = () => {
        setLoadingVisible(true);
        AsyncStorage.getItem('userId').then((userId) => {
            API.completedExercise(userId, exerciseData.id).then(
                () => {
                    setLoadingVisible(false);
                    setExerciseFinished(true);
                    setModalVisible(false);
                });
        })
    }
    return (
        <SafeAreaView style={styles.mainContainer}>
            {!exerciseFinished && (
                <>
                    <StressCamera
                        style={exerciseFinished ? styles.hideCamera : null}
                    />
                    <View style={styles.buttonWrapper}>
                        <CustomBtn
                            buttonStyle={styles.FinishBtn}
                            title="뒤로 가기"
                            onPress={handleFinishExercise}
                        />
                    </View>
                </>
            )}
            {exerciseFinished && (
                <View style={styles.exerciseFinishedContainer}>
                    <View style={styles.textContainer}>
                        <Text style={styles.finishText}>스트레스 측정 완료🔥</Text>
                    </View>
                    <ScrollTextBox
                        message="A jumping jack, also known as a star jump and called a side-straddle hop in the US military, 
                                is a physical jumping exercise performed by jumping to a position with the legs spread wide 
                                A jumping jack, also known as a star jump and called a side-straddle hop in the US military,
                                is a physical jumping exercise performed by jumping to a position with the legs spread wide."
                    />
                    <View style={styles.pointContainer}>
                        <PointComponent points={30} />
                    </View>
                    <View style={styles.btnContainer}>
                        <CustomBtn
                            buttonStyle={styles.homeButton}
                            title="홈으로"
                            onPress={() => router.push('/mainScreen')}
                        />
                    </View>
                </View>
            )}
            <LoadingModal visible={loadingVisible} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        position: "relative",
        backgroundColor: "white"
    },
    FeedBackContainer: {
        flex: 0.5
    },
    exerciseFinishedContainer: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center"
    },
    textContainer: {
        flex: 1,
        alignItems: "center",
        paddingTop: 100,
    },
    pointContainer: {
        width: "100%",
    },
    btnContainer: {
        width: "80%",
    },
    buttonWrapper: {
        width: "100%",
        alignItems: "center",
    },
    FinishBtn: {
        width: 150,
        height: 50,
        padding: 10,
        backgroundColor: '#d9a1d5',
        borderRadius: 10,
        marginLeft: 10,
        marginTop: 20,
    },
    infoButton: {
        position: 'absolute',
        top: 10, // 상단 여백
        right: 10, // 오른쪽 여백
        zIndex: 10, // 다른 요소들 위에 겹쳐지도록 z-index 지정
    },
    homeButton: {
        width: "100%",
        backgroundColor: "#99aff8",
        marginTop: 50,
    },
    finishText: {
        fontWeight: "bold",
        fontSize: 30
    }
});

export default PostureCorrection;
