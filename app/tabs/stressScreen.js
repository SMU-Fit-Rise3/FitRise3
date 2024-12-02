import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../src/api';
import { View, ScrollView, TouchableOpacity, StyleSheet,ActivityIndicator, Text, Dimensions, SafeAreaView, Animated, FlatList, Platform, StatusBar } from 'react-native';
import { StressLevelIndicator, Card, StressBtn } from '../../src/components';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const { width, height } = Dimensions.get('window'); // Get the screen dimensions

const stressScreen = () => {
  const [stressIndex, setStressIndex] = useState(0);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [music, setMusic] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    try {
      AsyncStorage.getItem('userId').then((userId) => {
        API.getMusic(userId)
          .then(response => {
            if (response){
              console.log("Fetched files:", JSON.stringify(response));
              const formattedData = response.data.map((item, index) => ({
                id: item.id || index.toString(), // 고유 키 사용
                name: item.musicName,
                url: item.musicUrls,
              }));
              setMusic(formattedData); // 상태 업데이트
            } else {
              setMusic([])
            }
          })
          .catch(error => {
            console.error('Error fetching Music files:', error);
          });
      });
    } catch (error) {
      console.error('Error in useEffect:', error);
    }
  }, []);

  const createMusic = () => {
    setLoading(true);
    AsyncStorage.getItem('userId').then(async (userId) => {
      const result = await API.generateMusic(userId, stressIndex);

      if (result.error) {
        console.error('Failed to generate audio:', result.error);
      } else {
        console.log('Generated audio:', result.urls);
        setMusic(result.urls);
      }
      setLoading(false);
    });
  };

  const playSound = async (url) => {
    console.log(url)
    const { sound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: true } // 자동 재생
    );

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        sound.unloadAsync(); // 재생이 끝나면 리소스 해제
      }
    });

    try {
      await sound.playAsync();
      console.log('Playing sound:', url);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const downloadFile = async (url) => {
    const fileName = url.split('/').pop(); // URL에서 파일 이름 추출
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    try {
      console.log('Downloading file:', url);
      const downloadResult = await FileSystem.downloadAsync(url, fileUri);

      console.log('File downloaded to:', downloadResult.uri);

    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  
  return (
    <SafeAreaView style={styles.mainContainer}>
      {Platform.OS === 'android' && <StatusBar barStyle="dark-content" />}
      <ScrollView style={styles.contentContainer}>
        <View style={[styles.viewContainer, { flex: 2 }]}>
          <Text style={[styles.title, styles.leftAlign]}>스트레스 측정</Text>
          <StressBtn />
        </View>
        <View style={styles.viewContainer}>
          <StressLevelIndicator stressLevel={stressIndex} />
        </View>
        <View style={[styles.viewContainer, { flex: 2 }]}>
          <Text style={[styles.title, styles.leftAlign]}>Music</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>음악 생성 중...</Text>
            </View>
          ) : music.length === 0 ? (
            <View style={styles.noMusicContainer}>
              <Text style={styles.noMusicText}> 스트레스 지수에 따른 나만의 음악을 생성해 보세요.</Text>
              <TouchableOpacity onPress={() => createMusic()} style={styles.addMusicButton}>
                <Text style={styles.addMusicButtonText}>음악 생성</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.musicContainer}>
              {music.slice(0, 4).map((item, index) => (
                <View key={index} style={styles.musicItemContainer}>
                  <Text style={styles.musicTitle}>{item.name}</Text>
                  <View style={styles.musicActions}>
                    <TouchableOpacity onPress={() => playSound(item.url)} style={styles.musicButton}>
                      <Text style={styles.musicButtonText}>재생</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => downloadFile(item.url)} style={styles.musicButton}>
                      <Text style={styles.musicButtonText}>다운로드</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

          )}
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
      </ScrollView>
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
  musicItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  musicTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  musicActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  musicButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
  },
  musicButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noMusicContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noMusicText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  addMusicButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  addMusicButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
  },
  musicContainer: {
    padding: 10,
  },
});

export default stressScreen;
