import React from 'react';
import { useRouter } from "expo-router";
import { View, StyleSheet, SafeAreaView } from 'react-native';
import images from '../../constants/images.js';
import {TabBar, FloatingBtn, ExerciseList,CharacterImage, PointDisplay, LoadingModal} from '../../src/components'
import { useSelector } from 'react-redux';
// 메인 화면 컴포넌트
const MainScreen = () => {
  const router = useRouter();
  const { loadingVisible } = useSelector(state => state.modalVisible);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        <PointDisplay/>
          <CharacterImage/>
          <View style={styles.container}>
              <ExerciseList/>
          </View>
          <FloatingBtn 
              imageSource={images.robot} 
              onPress={() => router.push('screens/chatScreen')}
          />
        <LoadingModal visible={loadingVisible} />  
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
