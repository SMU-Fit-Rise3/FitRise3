import React from 'react';
import { useRouter } from "expo-router";
import { View, StyleSheet, ScrollView } from 'react-native';
import InputField from '../src/components/InputFields';
import InputLabelView from '../src/components/InputLabelView.js';
import GenderSelector from '../src/components/GendorSelector.js';
import CustomButton from '../src/components/CustomBtn'; // 경로는 실제 위치에 맞게 수정하세요.
import ExSelector from '../src/components/ExSelector.js';
import GoalSelector from '../src/components/GoalSelector.js';

const InfoInput = () => {
    const router = useRouter();    
    const handleSelectGender = (gender) => {
        console.log(gender); // 선택된 성별을 처리하는 로직
    };
    const handleSelectEx = (Ex) => {
        console.log(Ex); // 선택된 운동 수준을 처리하는 로직
    };

    const handleSelectGoal = (Goal) => {
        console.log(Goal); // 선택된 운동 목표을 처리하는 로직
    };

    const handleNextPress = () => {
        console.log('완료 버튼 눌림'); // 다음 화면으로 이동하는 로직
        router.push('/characterGAN') //화면 이동
    };

  return (
  <View style = {styles.container}>
    <ScrollView style={styles.container}>
        <InputLabelView label="성별">
            <GenderSelector onSelectGender={handleSelectGender} />
        </InputLabelView>
        <View style={styles.HorContainer}>
            <InputField
                label="닉네임"
                placeholder="닉네임 입력"
                onChangeText={(text) => console.log(text)}
            />
            <CustomButton
                onPress={handleNextPress}
                title=" 중복 확인 "
                buttonStyle={styles.duplicateCheckBtn}
            />
        </View>
        <View style={styles.HorContainer}>
            <InputField
                label="나이"
                placeholder="세"
                onChangeText={(text) => console.log(text)}
            />
            <InputField
                label="운동횟수"
                placeholder="회"
            />            
        </View>
        <View style={styles.HorContainer}>
            <InputField 
                label="키"
                placeholder="cm" 
            />
            <InputField 
                label="몸무게"
                placeholder="kg" 
            />            
        </View>
        <InputLabelView label="운동 수준">
            <ExSelector onSelectEx={handleSelectEx} />
        </InputLabelView>
        <InputLabelView label="운동 목표">
            <GoalSelector onSelectGoal={handleSelectGoal}/>
        </InputLabelView>
        <CustomButton 
            onPress={handleNextPress}
            title=" 완료 " 
            buttonStyle={styles.finishBtn}
        />
    </ScrollView>
  </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  HorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center', // 세로 방향으로 자식 요소들을 가운데 정렬합니다.
    marginVertical: 10,
  },
  duplicateCheckBtn: {
    width:150,
    height:50,
    padding: 10,
    backgroundColor: '#d9a1d5',
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 20,
  },
  finishBtn:{
    backgroundColor: '#99aff8',
  }
});

export default InfoInput;
