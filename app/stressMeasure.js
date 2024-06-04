import React, { useState } from 'react';
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, StyleSheet, Text, SafeAreaView,Dimensions } from 'react-native';
import StressCamera from '../src/components/StressCamera.tsx';
import { CustomBtn } from '../src/components'
const { width } = Dimensions.get('window'); // Get the screen width


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
                    title="꿀팁!"
                    textStyle={styles.highlightedText}
                    buttonStyle={styles.label}/>
                <Text style={styles.description}>하얀색 사각형으로 얼굴 그림을
                    {"\n"}감싸도록 측정해야 정확한 스트레스 수치가 나와요.
                </Text>
                <CustomBtn
                    buttonStyle={styles.btn}
                    textStyle={styles.btnText}
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
        justifyContent: 'flex-start',
        marginTop: 30
    },
    btn: {
        width: 100,
        height: 50,
        padding: 10,
        backgroundColor: "#8994D7",
        marginBottom: 20,
    },
    btnText: {
        fontSize: 18,
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
    },
    highlightedText:{
        fontFamily:"Jua",
        color:"#1490FB",
        fontSize: 16
    },
    label: {
        backgroundColor: '#E1F1FE',
        width: width * 0.15,
        height:30,
        padding: 0
    },
    description: {
        fontSize: 14,
        marginBottom: 20,
        fontWeight:"500",
        color:"#555",
        fontFamily:"Jua",
        textAlign:"center"
    },
});

export default Stress;
