import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from "expo-router";
import { View, StyleSheet, SafeAreaView, Animated, Platform, StatusBar } from 'react-native';
import { ExerciseList, LoadingModal } from '../../src/components';
import { useSelector } from 'react-redux';
import CharacterGif from '../../backend/CharacterGif'; // CharacterGif 컴포넌트 가져오기
import { receiveImages } from '../../src/api/getGif';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../src/api';

const MainScreen = () => {
  const { loadingVisible } = useSelector(state => state.modalVisible);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [doExercise, SetDoExercise] = useState([]);
  const [gifUrl, setGifUrl] = useState([]);
  
  useEffect(() => {
    const unsubscribe = receiveImages(setGifUrl); // 이미지 수신 기능을 getGif에서 가져옴.
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('userId').then((userId) => {
      console.log("다한 운동들");
      API.getDoExercise(userId)
        .then((result) => {
          console.log('Response from server:', result);
          SetDoExercise(result);
          console.log("완료한 운동" + doExercise);
        });
    });
  }, []);

  useEffect(() => {
    const createAnimation = () => {
      return Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]);
    };

    const animations = Array(3).fill(null).map(createAnimation);

    Animated.sequence(animations).start();
  }, [animatedValue]);

  const animatedStyle = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, -10, 0], // 텍스트가 위아래로 움직이는 범위
        }),
      },
    ],
    opacity: animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.5, 1], // 텍스트의 투명도가 변하는 범위
    }),
  };

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeContainer}>
        {Platform.OS === 'android' && <StatusBar barStyle="dark-content" />}
        <View style={styles.contentContainer}>
          {doExercise.length <= 0 ? (
            <>
              <Animated.Text style={[styles.title, animatedStyle]}>
                반가워요 ! {"\n"} 오늘도 즐겁게 운동을 시작해요🔥
              </Animated.Text>
              <CharacterGif doExercise={["춤"]} gifUrl={gifUrl} />
            </>
          ) : (
            <>
              <Animated.Text style={[styles.title, animatedStyle]}>
                오늘 나는{" "}
                {doExercise.map((exercise, index) => (
                  <React.Fragment key={index}>
                    {exercise}
                    {index < doExercise.length - 1 && "\n"}
                  </React.Fragment>
                ))}의 달인✨
              </Animated.Text>
              <CharacterGif doExercise={doExercise} gifUrl={gifUrl} />
            </>
          )}
          <View style={styles.listContainer}>
            <ExerciseList />
          </View>
          <LoadingModal visible={loadingVisible} />
        </View>
      </SafeAreaView>
    </View>
  );
};

// 여기에 스타일을 정의합니다.
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F5F6FB",
  },
  safeContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Android 상태바 높이 추가
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#F5F6FB",
    paddingHorizontal: 10,
  },
  listContainer: {
    flex: 1.2,
    backgroundColor: "#F5F6FB",
    marginTop: 20,
  },
  title: {
    fontFamily: "Bold",
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default MainScreen;
