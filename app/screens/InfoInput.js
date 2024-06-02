import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, StyleSheet, SafeAreaView, Dimensions, Alert, ScrollView, Text, Pressable, Modal, TouchableOpacity,TouchableWithoutFeedback } from "react-native";
import { InputFields, InputLabelView, Selector, CustomBtn, GoalSelector, StepIndicator, LoadingModal } from "../../src/components";
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from "../../src/api";
import { Ionicons } from '@expo/vector-icons'; // Import icon library
import { setCustomText } from 'react-native-global-props';
import * as Font from 'expo-font';

const { height,width } = Dimensions.get('window'); // Get the screen width

const InfoInput = () => {
    const router = useRouter();
    //step
    const stepLabels = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];

    //font
    const [fontsLoaded, setFontsLoaded] = useState(false);

    const genderOptions = [
        { label: '여성', value: 'female', icon: '👩🏻' },
        { label: '남성', value: 'male', icon: '👨🏻' },
    ];

    const exerciseLevelOptions = [
        { label: '초급자', value: 'beginner', icon: '🌱' },
        { label: '중급자', value: 'middle', icon: '🌻' },
        { label: '고수', value: 'expert', icon: '🌳' },
    ];

    // 상태 정의
    const [selectedGender, setSelectedGender] = useState(null);
    const [nickname, setNickname] = useState('');
    const [age, setAge] = useState('');
    const [exerciseFrequency, setExerciseFrequency] = useState('');
    const [userHeight, setUserHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [selectedExerciseLevel, setSelectedExerciseLevel] = useState(null);
    const [exerciseGoal, setExerciseGoal] = useState(null);
    const [namecheck, setNameCheck] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [tooltipVisible, setTooltipVisible] = useState(false); // Tooltip visibility state

    // 입력값 검증 함수
    const validateInputs = () => {
        const errors = [];
        if (!selectedGender) errors.push("성별");
        if (!nickname.trim()) errors.push("닉네임");
        if (!age.trim() || isNaN(Number(age))) errors.push("나이");
        if (!exerciseFrequency.trim() || isNaN(Number(exerciseFrequency))) errors.push("운동횟수");
        if (!userHeight.trim() || isNaN(Number(userHeight))) errors.push("키");
        if (!weight.trim() || isNaN(Number(weight))) errors.push("몸무게");
        if (!selectedExerciseLevel) errors.push("운동 수준");
        if (!exerciseGoal) errors.push("운동 목표");
        if (!namecheck) errors.push("중복확인");

        if (errors.length > 0) {
            Alert.alert('입력되지 않은 정보가 있습니다!', `${errors.join(", ")}을(를) 확인해주세요.`);
            return false;
        }
        return true;
    };

    // 다음 버튼 클릭 이벤트
    const handleNextPress = () => {
        const userInfo = {
            selectedGender,
            nickname,
            age: Number(age),
            exerciseFrequency: Number(exerciseFrequency),
            height: Number(userHeight),
            weight: Number(weight),
            selectedExerciseLevel,
            exerciseGoal,
        };

        //빈칸검사 && 유저정보 DB생성 주석처리
        if (validateInputs()) {
            setIsLoading(true);
            API.createUser(userInfo)
                .then((result) => {
                    console.log('Response from server:', result);
                    AsyncStorage.setItem('userId', result.id).then(console.log('AsyncStorage ID저장완료'));
                    setIsLoading(false);
                });

            router.push({
                pathname: 'screens/caloriesScreen',
                params: {
                    gender: userInfo.selectedGender,
                    height: userInfo.height,
                    exerciseLevel: userInfo.selectedExerciseLevel,
                    goal: userInfo.exerciseGoal
                }
            });
        } // This closing brace was missing
    };

    const NickcopyCheck = (nickname) => {
        setIsLoading(true);
        API.checkNickName(nickname).then((res) => {
            if (res.status == 404) {
                setNameCheck(true)
                console.log("중복확인")
                Alert.alert(
                    '사용이 가능한 닉네임입니다',
                );
                AsyncStorage.setItem('key', nickname).then(() => {
                    console.log('AsyncStorage저장완료');
                })
                    .catch((error) => {
                        console.error('Failed to save the data to the storage', error);
                    });
            } else if (res.status == 200) {
                setNameCheck(false)
                Alert.alert(
                    '이미 사용중인 닉네임입니다',
                );
            }
            setIsLoading(false);
        })
    }

    //font loading
    useEffect(() => {
        async function loadFonts() {
          await Font.loadAsync({
            Bold: require('../../src/assets/font/Gaegu-Bold.ttf'),
            Regular: require('../../src/assets/font/Gaegu-Regular.ttf'),
            Light: require('../../src/assets/font/Gaegu-Light.ttf'),
            Jua: require('../../src/assets/font/Jua-Regular.ttf'),
          });
          setFontsLoaded(true);
        }
    
        loadFonts();
      }, []);
    
      if (!fontsLoaded) {
        return null; // 폰트 로딩 중에는 렌더링을 방지
      }
    
      const customTextProps = {
        style: {
          fontFamily: 'Jua',
        },
      };
      setCustomText(customTextProps);

    // Tooltip component
    const renderTooltip = () => (
        <Modal
            animationType="fade"
            transparent={true}
            visible={tooltipVisible}
            onRequestClose={() => setTooltipVisible(false)}
        >
            <TouchableWithoutFeedback onPress={() => setTooltipVisible(false)}>
                <View style={[styles.tooltipContainer, styles.shadow]}>
                    <TouchableWithoutFeedback>
                        <View style={styles.tooltip}>
                            <Text style={styles.tooltipTitle}>운동 수준 체크법</Text>
                            <Text style={styles.boldText}>초급자</Text>
                            <Text style={styles.tooltipText}>주로 앉아서 일하는 사무직이나 생활에서 움직임이 거의 없는 경우</Text>
                            <Text style={styles.boldText}>중급자</Text>
                            <Text style={styles.tooltipText}>매일 일상적으로 걷는 시간이 있거나 가벼운 운동을 병행하는 경우</Text>
                            <Text style={styles.boldText}>고수</Text>
                            <Text style={styles.tooltipText}>몸을 활발히 쓰는 일을 하거나 격한 운동을 하고 있는 경우</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
    

    return (
        <SafeAreaView style={styles.safeContainer}>
            <ScrollView style={styles.contentContainer}>
                <StepIndicator
                    steps={stepLabels}
                    currentStep={0}
                />
                <InputLabelView label="성별">
                    <Selector options={genderOptions} onSelectOption={(value) => setSelectedGender(value)} />
                </InputLabelView>
                <View style={styles.HorContainer}>
                    <InputFields
                        label="닉네임"
                        placeholder="닉네임 입력"
                        textInputProps={{
                            onChangeText: setNickname, // 상태 업데이트 함수 직접 전달
                            value: nickname, // 상태 값 직접 전달
                        }}
                    />
                    <CustomBtn
                        onPress={() => NickcopyCheck(nickname)}
                        title=" 중복 확인 "
                        textStyle={{fontSize:20}}
                        buttonStyle={styles.duplicateCheckBtn}
                    />
                </View>
                <View style={styles.HorContainer}>
                    <InputFields
                        label="나이"
                        unit="세"
                        textInputProps={{
                            keyboardType: 'numeric',
                            onChangeText: setAge,
                            value: age,
                        }}
                    />
                    <InputFields
                        label="주간 운동 횟수"
                        unit="회"
                        keyboardType="numeric"
                        textInputProps={{
                            keyboardType: 'numeric',
                            onChangeText: setExerciseFrequency,
                            value: exerciseFrequency,
                        }}
                    />
                </View>
                <View style={styles.HorContainer}>
                    <InputFields
                        label="키"
                        unit="cm"
                        keyboardType="numeric"
                        textInputProps={{
                            keyboardType: 'numeric',
                            onChangeText: setUserHeight,
                            value: userHeight,
                        }}
                    />
                    <InputFields
                        label="몸무게"
                        unit="kg"
                        keyboardType="numeric"
                        textInputProps={{
                            keyboardType: 'numeric',
                            onChangeText: setWeight,
                            value: weight,
                        }}
                    />
                </View>
                <View style={styles.inlineLabel}>
                    <Pressable onPress={() => setTooltipVisible(true)}>
                        <Ionicons name="help-circle-outline" size={24} color="#888" />
                    </Pressable>
                </View>
                <InputLabelView label="운동 수준">
                    <Selector options={exerciseLevelOptions} onSelectOption={(value) => setSelectedExerciseLevel(value)} />
                </InputLabelView>
                <InputLabelView label="운동 목표">
                    <GoalSelector onSelectGoal={setExerciseGoal} />
                </InputLabelView>
                <View style={styles.btnContainer}>
                    <CustomBtn
                        onPress={handleNextPress}
                        title=" 다음 "
                        buttonStyle={styles.finishBtn}
                    />
                </View>
                <LoadingModal visible={isLoading} />
                {renderTooltip()}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    contentContainer: {
        flex: 1,
        padding: 10,
    },
    btnContainer: {
        alignItems: "center"
    },
    HorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center', // 세로 방향으로 자식 요소들을 가운데 정렬합니다.
    },
    duplicateCheckBtn: {
        width: width * 0.3,
        height: 45,
        padding: 5,
        backgroundColor: '#d9a1d5',
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 30,
        top: 14,
        right: -25
    },
    finishBtn: {
        backgroundColor: '#99aff8',
        width: width * 0.85,
    },
    inlineLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        top:20,
        left:80
    },
    labelText: {
        marginRight: 8,
    },
    tooltipContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tooltipTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    tooltip: {
        position: 'absolute',
        top: height * 0.35, // Adjust as necessary to position below the icon
        left: width * 0.02, // Adjust as necessary to align with the icon
        backgroundColor: 'white',
        padding: 17,
        borderRadius: 10,
        alignItems: 'center',
        width: width * 0.45,
    },
    tooltipText: {
        marginBottom: 10,
        fontSize:12
    },
    boldText: {
        fontWeight: 'bold',
        marginBottom:5
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default InfoInput;
