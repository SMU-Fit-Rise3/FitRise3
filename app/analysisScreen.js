import React, { useEffect, useState } from 'react';
import { useRouter } from "expo-router";
import { View, StyleSheet, ScrollView, Text, SafeAreaView, Dimensions, Alert } from 'react-native';
import { TabBar, BarChartComponent, LineChartComponent, SingleLineChart, CustomBtn, InputFields, InfoAlertComponent, LoadingModal } from '../src/components'

import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../src/api'

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
                })
        })
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

        //전체데이터처리
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

        // 최근 7일데이터
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
        })
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
                            console.log("dd"+JSON.stringify(data));
                            setIsLoading(false);
                            AsyncStorage.getItem('userId').then((userId) => {
                                API.getAnalysis(userId)
                                    .then((data) => {
                                        processData(data);
                                    })
                            });
                        }
                    })
            })
        } catch (error) {
            setIsLoading(false);
            console.error('Error handleNextPress:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.centerContainer}>
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>스트레스 😖</Text>
                        <SingleLineChart stressData={stressData} />
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>몸무게 & BMI 변화량 ⚖️</Text>
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
                                buttonStyle={styles.InputBtn}
                            />
                        </View>
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>영양분 섭취량 🍴</Text>
                        <BarChartComponent weeklyData={weeklyNutritionData} />
                        <InfoAlertComponent feedbackData={deficitData} />
                    </View>
                </View>
                <LoadingModal visible={isLoading} />
            </ScrollView>
            <TabBar router={router} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ddd",
        flex: 1
    },
    scrollContainer: {
        flex: 1
    },
    centerContainer: {
        backgroundColor: "#fff",
        alignItems: "center",
        paddingHorizontal: 10
    },
    contentContainer: {
        flex: 1,
        width: width * 0.9,
        alignItems: "flex-start",
        marginBottom: 15,
    },
    HorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: width * 0.6,
    },
    InputBtn: {
        width: width * 0.3,
        height: 50,
        backgroundColor: '#d9a1d5',
        borderRadius: 10,
        alignItems: 'center',
        marginLeft: 20,
        marginTop: 30,
        padding: 10
    },
    title: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        marginTop: 40,
    },
    textField: {
        width: width * 0.4,
    }
});

export default analysisScreen;
