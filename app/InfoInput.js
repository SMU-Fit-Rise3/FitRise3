import React from 'react';
import { useRouter } from "expo-router";
import { View, StyleSheet,SafeAreaView,Dimensions } from 'react-native';
import InputField from '../src/components/InputFields';
import InputLabelView from '../src/components/InputLabelView.js';
import Selector from '../src/components/Selector.js';
import CustomButton from '../src/components/CustomBtn'; // 경로는 실제 위치에 맞게 수정하세요.
import GoalSelector from '../src/components/GoalSelector.js';
import StepIndicator from '../src/components/StepIndicator';

const { width, height } = Dimensions.get('window'); // Get the screen dimensions

const InfoInput = () => {
    const router = useRouter(); 
    const stepLabels = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];

    const gender = [
        { label: '여성', value: 'female', icon: '👩🏻' },
        { label: '남성', value: 'male', icon: '👨🏻' },
    ];

    const exerciseLevel = [
        { label: '초급자', value: 'beginner', icon: '🌱' },
        { label: '중급자', value: 'middle', icon: '🌻' },
        { label: '고 수', value: 'expert', icon: '🌳' },
    ];

    // 함수 선언하는 곳
    const handleSelectOption = (value) => {
        console.log(value);
        // 여기서 선택된 옵션을 처리
    };
    const handleSelectEx = (Ex) => {
        console.log(Ex); 
        // 선택된 운동 수준을 처리하는 로직
    };

    const handleSelectGoal = (Goal) => {
        console.log(Goal); 
        // 선택된 운동 목표을 처리하는 로직
    };

    const handlePress = () => {
        console.log('중복확인 버튼 눌림');
        //중복확인 로직
    };
    const handleNextPress = () => {
        console.log('완료 버튼 눌림'); // 다음 화면으로 이동하는 로직
        router.push('/characterGAN')
    };

  return (
    <SafeAreaView style={styles.safeContainer}>
        <View style={styles.contentContainer}>
            <StepIndicator
                steps= {stepLabels}
                currentStep={0}
            />
            <InputLabelView label="성별">
                <Selector options={gender} onSelectOption={handleSelectOption}/>
            </InputLabelView>
            <View style={styles.HorContainer}>
                <InputField
                    label="닉네임"
                    placeholder="닉네임 입력"
                    onChangeText={(text) => console.log(text)}
                />
                <CustomButton
                    onPress={handlePress}
                    title=" 중복 확인 "
                    buttonStyle={styles.duplicateCheckBtn}
                />
            </View>
            <View style={styles.HorContainer}>
                <InputField
                    label="나이"
                    placeholder="세"
                    keyboardType="numeric"
                    onChangeText={(text) => console.log(text)}
                />
                <InputField
                    label="운동횟수"
                    placeholder="회"
                    keyboardType="numeric"
                />            
            </View>
            <View style={styles.HorContainer}>
                <InputField 
                    label="키"
                    placeholder="cm"
                    keyboardType="numeric"
                />
                <InputField 
                    label="몸무게"
                    placeholder="kg"
                    keyboardType="numeric"
                />            
            </View>
            <InputLabelView label="운동 수준">
                <Selector options={exerciseLevel} onSelectOption={handleSelectOption} />
            </InputLabelView>
            <InputLabelView label="운동 목표">
                <GoalSelector onSelectGoal={handleSelectGoal}/>
            </InputLabelView>
            <View style={styles.btnContainer}>
                <CustomButton 
                    onPress={handleNextPress}
                    title=" 완료 " 
                    buttonStyle={styles.finishBtn}
                />
            </View>
        </View>
    </SafeAreaView>
);};

const styles = StyleSheet.create({
    safeContainer:{
        flex:1,
        backgroundColor: '#ffffff',
    },
    contentContainer: {
        flex:1,
        paddingTop: 10,
        padding:10
    },
    btnContainer: {
        alignItems:"center"
    },
    HorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center', // 세로 방향으로 자식 요소들을 가운데 정렬합니다.
    },
    duplicateCheckBtn: {
        width: width * 0.3 ,
        height:45,
        padding: 5,
        backgroundColor: '#d9a1d5',
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 30,
        top: 14,
        right:-25
    },
    finishBtn:{
        backgroundColor: '#99aff8',
        width:width*0.7
    }
});

export default InfoInput;
