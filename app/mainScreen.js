import React from 'react';
import { useRouter } from "expo-router";
import { View, StyleSheet, SafeAreaView } from 'react-native';
import PointDisplay from '../src/components/PointDisplay.js';
import CharacterImage from '../src/components/CharacterImage.js';
import ExerciseList from '../src/components/ExerciseList.js';
import ChatbotButton from '../src/components/FloatingBtn';
import images from '../constants/images.js';
import TabBar from '../src/components/TabBar.js';

// 메인 화면 컴포넌트
const MainScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        <PointDisplay/>
          <CharacterImage/>
          <View style={styles.container}>
              <ExerciseList/>
          </View>
          <ChatbotButton 
              imageSource={images.robot} 
              onPress={() => router.push('/chatScreen')}
          />
        <TabBar router={router}/>  
      </View>      
    </SafeAreaView>
  );
};

// 여기에 스타일을 정의합니다.
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor:"#ddd"
  },
  container: {
    flex:1,
    backgroundColor:"white",
  }
});

export default MainScreen;
