import React, { useEffect, useRef } from 'react';
import { useRouter } from "expo-router";
import { View, StyleSheet, SafeAreaView, Text, Animated } from 'react-native';
import images from '../../constants/images.js';
import { FloatingBtn, ExerciseList, PointDisplay, LoadingModal } from '../../src/components';
import { useSelector } from 'react-redux';
import CharacterGif from '../../backend/CharacterGif'; // CharacterGif 컴포넌트 가져오기

const MainScreen = () => {
  const router = useRouter();
  const { loadingVisible } = useSelector(state => state.modalVisible);

  const animatedValue = useRef(new Animated.Value(0)).current;

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
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.mainContainer}>
          <Animated.Text style={[styles.title, animatedStyle]}>
            반가워요 ! {"\n"}오늘도 즐겁게 운동을 시작해요 🔥
          </Animated.Text>
          {/* 운동 수행했을 때 바뀔 문장 */}
          {/* <Animated.Text style={[styles.title, animatedStyle]}>
            오늘 나는{"\n"}스쿼트의 달인✨
          </Animated.Text> */}
          <CharacterGif />
          <View style={styles.listContainer}>
            <ExerciseList />
          </View>
          <FloatingBtn
            imageSource={images.robot}
            onPress={() => router.push('screens/chatScreen')}
          />
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
  listContainer: {
    flex: 1.2,
    backgroundColor: "#F5F6FB",
    marginTop:20,
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
