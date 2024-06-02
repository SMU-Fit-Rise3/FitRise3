import React, { useState } from 'react';
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import StressCamera from '../src/components/StressCamera.tsx';
import { CustomBtn} from '../src/components'


const Stress = () => {

    const router = useRouter();

    const { title, count, id } = useLocalSearchParams();
    const exerciseData = {
        title: title,
        count: count,
        id: id
    };
    console.log(exerciseData.title);

    const handleFinish = () => {
        router.push({ pathname: '/tabs/stressScreen' })
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <StressCamera/>
            <View style={styles.buttonWrapper}>
                <CustomBtn
                    buttonStyle={styles.FinishBtn}
                    title="뒤로 가기"
                    onPress={handleFinish}
                />
            </View>
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

export default Stress;
