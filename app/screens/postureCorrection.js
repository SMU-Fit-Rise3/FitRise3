import React, { useState } from 'react';
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';

import CameraComponent from '../../src/components/CameraComponent'
import { useSelector } from 'react-redux';
import icons from '../../constants/icons.js';
import { FeedBack, FloatingBtn, CustomBtn, InfoModal, ModalWebView, ScrollTextBox, PointComponent, LoadingModal } from '../../src/components'
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../src/api';

const PostureCorrection = () => {

    const router = useRouter();
    // Main Screen ExerciseList에서 넘겨준 값
    const { title, count, id, sets, reps } = useLocalSearchParams();
    const exerciseData = {
        title: title,
        count: count,
        id: id,
        sets: sets,
        reps: reps
    };
    const [feedback, setFeedback] = useState("자세를 잡아주세요.");
    console.log(exerciseData.title)
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [exerciseFinished, setExerciseFinished] = useState(false);
    //리둑스 상태관리
    const modal3dVisible = useSelector(state => state.modalVisible.modal3dVisible);

    const handleFinishExercise = (exerciseCompleted) => {
        setLoadingVisible(true);
        AsyncStorage.getItem('userId').then((userId) => {
            API.completedExercise(userId, exerciseData.id).then(
                () => {
                    setLoadingVisible(false);
                    setExerciseFinished(exerciseCompleted);
                    setModalVisible(false);
                });
        })
    }

    const handleFeedback = (newFeedback) => {
        setFeedback(newFeedback); // 피드백 메시지 업데이트
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            {!exerciseFinished && (
                <>
                    <CameraComponent
                        style={exerciseFinished ? styles.hideCamera : null}
                        isModalVisible={modal3dVisible}    //redux로 3dmodal 컴포넌트 상태를 받아와야함
                        exerciseData={exerciseData}
                        onFeedback={handleFeedback}
                        onExerciseComplete={handleFinishExercise}
                    />

                    <FloatingBtn
                        imageSource={icons.icon_calendar_p}
                        onPress={() => setModalVisible(true)}
                        buttonStyle={styles.infoButton}
                    />
                    <View style={styles.FeedBackContainer}>
                        <FeedBack text={feedback} />
                        <View style={styles.buttonWrapper}>
                            <CustomBtn
                                buttonStyle={[styles.btn, {width:150, height:50, marginBottom:20}]}
                                textStyle={styles.btnText}
                                title="운동 완료"
                                onPress={handleFinishExercise}
                            />
                        </View>
                    </View>
                </>
            )}
            {exerciseFinished && (
                <View style={styles.exerciseFinishedContainer}>
                    <Text style={styles.finishText}>운동을 완료했어요🔥</Text>
                    <ScrollTextBox
                        message="운동을 잘 수행하셨습니다. 스쿼트는 하체 근육과 코어 근육 강화에 좋은 운동으로 매일 꾸준히 수행하시면 좋습니다."
                    />
                    <View style={styles.btnContainer}>
                        <CustomBtn
                            buttonStyle={styles.btn}
                            textStyle={styles.btnText}
                            title="홈으로"
                            onPress={() => router.push('tabs/mainScreen')}
                        />
                    </View>
                </View>
            )}
            <ModalWebView
                modalVisible={modal3dVisible}
            />
            <InfoModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                exercise={exerciseData.title}
                count={exerciseData.count}
                exerciseDetails="Easy | 390 Calories Burn"
                exerciseDescription="벤치 프레스는 대흉근(가슴 앞쪽과 위쪽)과 소흉근(갈비뼈와 날개뼈를 이어주는 근육)을 단련할 수 있어요."
                steps={[
                    "Spread Your Arms",
                    "Rest at The Toe",
                    "Adjust Foot Movement",
                    "Clapping Both Hands",
                ]}
            />
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
        flex: 0.3
    },
    exerciseFinishedContainer: {
        flex: 1,
        padding:20,
        backgroundColor: "#F5F6FB",
        alignItems: "center",
        justifyContent:"center"
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
        backgroundColor:"#F5F6FB"
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
        top: 40, // 상단 여백
        right: 10, // 오른쪽 여백
        zIndex: 10, // 다른 요소들 위에 겹쳐지도록 z-index 지정
        backgroundColor:"#fff"
    },
    finishText: {
        fontWeight: "bold",
        fontSize: 30,
        fontFamily:"Jua",
        marginTop:50
    },
    btn: {
        width: "100%",
        height: 60,
        padding: 10,
        backgroundColor: "#8994D7",
        marginBottom: 0,
      },
      btnText: {
        fontSize: 18,
        fontFamily:"Jua"
      }
});

export default PostureCorrection;