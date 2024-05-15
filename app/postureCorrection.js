import React, { useState } from 'react';
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';

import CameraComponent from '../src/components/CameraComponent.tsx';
import { useSelector } from 'react-redux';
import icons from '../constants/icons.js';
import { FeedBack, FloatingBtn, CustomBtn, InfoModal, ModalWebView, ScrollTextBox, PointComponent, LoadingModal } from '../src/components'
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
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [exerciseFinished, setExerciseFinished] = useState(false);
    //리둑스 상태관리
    const modal3dVisible = useSelector(state => state.modalVisible.modal3dVisible);

    const handleFinishExercise = () => {
        setLoadingVisible(true);
        API.completedExercise("6641af7f94a3e52e3b8ea23c", exerciseData.id).then(
            () => {
                setLoadingVisible(false);
                setExerciseFinished(true);
                setModalVisible(false);
            });
    }
    return (
        <SafeAreaView style={styles.mainContainer}>
            {!exerciseFinished && (
                <>
                    <CameraComponent
                        style={exerciseFinished ? styles.hideCamera : null}
                        isModalVisible={modal3dVisible}    //redux로 3dmodal 컴포넌트 상태를 받아와야함
                    />


                    <FloatingBtn
                        imageSource={icons.icon_calendar_p}
                        onPress={() => setModalVisible(true)}
                        buttonStyle={styles.infoButton}
                    />
                    <View style={styles.FeedBackContainer}>
                        <FeedBack text="자세를 잡아주세요." />
                        <View style={styles.buttonWrapper}>
                            <CustomBtn
                                buttonStyle={styles.FinishBtn}
                                title="운동 완료"
                                onPress={handleFinishExercise}
                            />
                        </View>
                    </View>
                </>
            )}
            {exerciseFinished && (
                <View style={styles.exerciseFinishedContainer}>
                    <View style={styles.textContainer}>
                        <Text style={styles.finishText}>운동을 완료했어요🔥</Text>
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
