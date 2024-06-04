import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../src/api';
import { View, StyleSheet, Text, Dimensions, SafeAreaView, Animated, FlatList, Platform, StatusBar } from 'react-native';
import { StressLevelIndicator, Card,StressBtn } from '../../src/components';

const { width, height } = Dimensions.get('window'); // Get the screen dimensions

const stressScreen = () => {
  const [stressIndex, setStressIndex] = useState(0);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const cards = [
    {
      animationSource: require('../../src/assets/lottie/run_lottie.json'),
      title: '유산소 운동',
      description: '유산소 운동은 스트레스를 줄이고 기분을 좋게 만듭니다. 규칙적으로 운동하세요.'
    },
    {
      animationSource: require('../../src/assets/lottie/stretch_lottie.json'),
      title: '스트레칭',
      description: '스트레칭은 몸의 긴장을 풀어주고 스트레스를 완화합니다. 매일 스트레칭을 해보세요.'
    },
    {
      animationSource: require('../../src/assets/lottie/meditate_lottie.json'),
      title: '명상',
      description: '스트레칭은 몸의 긴장을 풀어주고 스트레스를 완화합니다. 매일 스트레칭을 해보세요.'
    },
    {
      animationSource: require('../../src/assets/lottie/cat.json'),
      title: '숙면',
      description: '숙면은 스트레스 해소에 중요한 역할을 합니다. 매일 충분한 수면을 취하세요.'
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % cards.length;
      setCurrentIndex(nextIndex);
      flatListRef.current.scrollToIndex({ animated: true, index: nextIndex });
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, cards.length]);

  const router = useRouter();
  const handleNextPress = () => {
    console.log('다음 버튼 눌림'); // 다음 화면으로 이동하는 로직
    router.push('screens/mainScreen'); // 화면 이동
  };

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };
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

  return (
    <SafeAreaView style={styles.mainContainer}>
      {Platform.OS === 'android' && <StatusBar barStyle="dark-content" />}
      <View style={styles.contentContainer}>
        <View style={[styles.viewContainer, { flex: 2 }]}>
          <Text style={[styles.title, styles.leftAlign]}>스트레스 측정</Text>
            <StressBtn/>
        </View>
        <View style={styles.viewContainer}>
          <StressLevelIndicator stressLevel={stressIndex} />
        </View>
        <View style={[styles.viewContainer, { flex: 1.5 }]}>
          <Text style={[styles.title, styles.leftAlign]}>스트레스 해소 활동</Text>
          <Animated.FlatList
            ref={flatListRef}
            data={cards}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            scrollEnabled
            onScroll={handleScroll}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <Card
                animationSource={item.animationSource}
                title={item.title}
                description={item.description}
              />
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

// 여기에 스타일을 정의합니다.
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F5F6FB",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Android 상태바 높이 추가
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#F5F6FB",
  },
  viewContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  characterCamContainer: {
    marginTop: 30,
    width: width * 0.8, // 이미지 컨테이너의 너비
    height: height * 0.2, // 이미지 컨테이너의 높이, 스크린 비율에 따라 조절 가능
    marginBottom: 10,
  },
  title: {
    fontFamily: "Jua",
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  leftAlign: {
    textAlign: 'left', // 왼쪽 정렬
    alignSelf: 'flex-start', // 부모 컨테이너의 왼쪽 끝으로 정렬
    marginLeft: 20, // 왼쪽 여백 추가
  },
});

export default stressScreen;
