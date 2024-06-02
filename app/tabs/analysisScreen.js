import React, { useEffect, useState } from 'react';
import { useRouter } from "expo-router";
import { View, StyleSheet, ScrollView, Text, SafeAreaView, Dimensions, Alert, Platform, StatusBar } from 'react-native';
import { BarChartComponent, LineChartComponent, SingleLineChart, CustomBtn, InputFields, InfoAlertComponent, LoadingModal } from '../../src/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../src/api';

const { width, height } = Dimensions.get('window'); // Get the screen dimensions

const analysisScreen = () => {
    const [weight, setWeight] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [stressData, setStressData] = useState([]);
    const [weightData, setWeightData] = useState([]);
    const [weeklyNutritionData, setWeeklyNutritionData] = useState([]);
    const [deficitData, setDeficitData] = useState({});
    const router = useRouter();

    useEffect(() => {
        AsyncStorage.getItem('userId').then((userId) => {
            API.getAnalysis(userId)
                .then((data) => {
                    processData(data);
                });
        });
    }, []);

    const processData = (data) => {
        if (!data || !data[0].calendar) return;

        console.log(JSON.stringify(data, null, 2));
        const stressData = [];
        const weightData = [];
        const weeklyNutritionData = [];

        let totalCalories = 0;
        let totalCarbs = 0;
        let totalProtein = 0;
        let totalFat = 0;

        // 전체 데이터 처리
        data[0].calendar.forEach(dayData => {
            const { day, weight, eatfood, stressIndex } = dayData;
            const bmiIndex = weight / ((data[0].height / 100) * (data[0].height / 100));

            if (stressIndex > 0) {
                stressData.push({ label: day, value: stressIndex });
            }

            if (weight !== null) {
                weightData.push({ label: day, value: weight, bmi: bmiIndex.toFixed(2) });
            }

            if (eatfood.length !== 0) {
                const dailyNutrition = eatfood.reduce((totals, food) => {
                    totals.calories += food.calories;
                    totals.carbs += food.carbs;
                    totals.protein += food.protein;
                    totals.fat += food.fat;
                    return totals;
                }, { label: day, calories: 0, carbs: 0, protein: 0, fat: 0 });

                weeklyNutritionData.push(dailyNutrition);
            }
        });

        // 최근 7일 데이터
        const recent7DaysData = data[0].calendar.slice(-7);

        recent7DaysData.forEach(dayData => {
            const { eatfood } = dayData;

            if (eatfood.length !== 0) {
                eatfood.forEach(food => {
                    totalCalories += food.calories;
                    totalCarbs += food.carbs;
                    totalProtein += food.protein;
                    totalFat += food.fat;
                });
            }
        });

        const numOfDays = recent7DaysData.length;
        const calorieDeficit = Math.max(0, data[0].calorie[0].calorie_goal * numOfDays - totalCalories);
        const carbsDeficit = Math.max(0, data[0].calorie[0].carbs * numOfDays - totalCarbs);
        const proteinDeficit = Math.max(0, data[0].calorie[0].protein * numOfDays - totalProtein);
        const fatDeficit = Math.max(0, data[0].calorie[0].fat * numOfDays - totalFat);

        const allDeficitData = {
            calorieDeficit,
            carbsDeficit,
            proteinDeficit,
            fatDeficit
        };

        console.log("stressData:" + JSON.stringify(stressData));
        console.log("weightData:" + JSON.stringify(weightData));
        console.log("nutrieData:" + JSON.stringify(weeklyNutritionData));
        console.log("deficitData:" + JSON.stringify(allDeficitData));
        setStressData(stressData);
        setWeightData(weightData);
        setWeeklyNutritionData(weeklyNutritionData);
        setDeficitData(allDeficitData);
    };

    const handleNextPress = () => {
        console.log('입력 버튼 눌림');

        if (!weight) {
            Alert.alert('입력 오류', '몸무게를 입력하세요');
            return;
        }

        try {
            setIsLoading(true);
            AsyncStorage.getItem('userId').then((userId) => {
                API.updateWeight(userId, weight)
                    .then(data => {
                        if (data) {
                            console.log(data);
                            setIsLoading(false);
                            AsyncStorage.getItem('userId').then((userId) => {
                                API.getAnalysis(userId)
                                    .then((data) => {
                                        processData(data);
                                    });
                            });
                        }
                    });
            });
        } catch (error) {
            setIsLoading(false);
            console.error('Error handleNextPress:', error);
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            {Platform.OS === 'android' && <StatusBar barStyle="dark-content" />}
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.contentContainer}>
                    <View style={[styles.viewContainer, styles.borderRadius]}>
                        <Text style={[styles.title, styles.leftAlign]}>스트레스</Text>
                        <SingleLineChart stressData={stressData} />
                    </View>
                    <View style={[styles.viewContainer, styles.borderRadius]}>
                        <Text style={[styles.title, styles.leftAlign]}>몸무게 & BMI 변화량</Text>
                        <LineChartComponent weightData={weightData} />
                        <View style={styles.HorContainer}>
                            <InputFields
                                label="몸무게"
                                placeholder="몸무게 입력"
                                textInputProps={{
                                    value: weight,
                                    onChangeText: (text) => {
                                        const numericValue = text.replace(/[^0-9]/g, ''); // Ensure only numeric values
                                        setWeight(numericValue);
                                    },
                                }}
                                extraStyle={styles.textField}
                            />
                            <CustomBtn
                                onPress={handleNextPress}
                                title=" 입력 "
                                buttonStyle={styles.btn}
                                textStyle={styles.btnText}
                            />
                        </View>
                    </View>
                    <View style={[styles.viewContainer, styles.borderRadius]}>
                        <Text style={[styles.title, styles.leftAlign]}>영양분 섭취량</Text>
                            <BarChartComponent weeklyData={weeklyNutritionData} />
                        <InfoAlertComponent feedbackData={deficitData} />
                    </View>
                </View>
                <LoadingModal visible={isLoading} />
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
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  viewContainer: {
    flex: 1,
    width: width * 0.9,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
  },
  borderRadius: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  HorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: width * 0.8,
    marginTop: 20,
  },
  btn: {
    width: 100,
    height: 40,
    padding: 10,
    backgroundColor: "#8994D7",
    marginBottom: 0,
  },
  btnText: {
    fontSize: 14,
  },
  title: {
    fontFamily: "Jua",
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom:10,
  },
  leftAlign: {
    textAlign: 'left', // 왼쪽 정렬
    alignSelf: 'flex-start', // 부모 컨테이너의 왼쪽 끝으로 정렬
  },
  textField: {
    width: width * 0.4,
  },
});

export default analysisScreen;
