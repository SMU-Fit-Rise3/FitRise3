import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from "expo-router";
import { View, StyleSheet, SafeAreaView, Text, ScrollView } from 'react-native';
import { NutrientBar, MealList, MealTypeSelector, TabBar } from '../src/components'
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../src/api'

// 메인 화면 컴포넌트
const dietScreen = () => {
    const [nutrients, setNutrients] = useState([
        { id: 'calories', name: '칼로리', value: 0, totalValue: 2000, icon: "🔥" },
        { id: 'carbs', name: '탄수화물', value: 0, totalValue: 200, icon: "🌾" },
        { id: 'protein', name: '단백질', value: 0, totalValue: 120, icon: "🍖" },
        { id: 'fats', name: '지방', value: 0, totalValue: 100, icon: "🍟" },
    ]);
    const [mealData, setMealData] = useState({
        Breakfast: [],
        Lunch: [],
        Dinner: [],
        Snack: []
    });

    //api 요청
    useEffect(() => {
        AsyncStorage.getItem('userId')
            .then((userId) => {
                API.getTodayMeal(userId)
                    .then((data) => {
                        console.log(data);
                        processMealData(data);
                    });
            });
    }, [])

    const processMealData = (data) => {
        const meals = { Breakfast: [], Lunch: [], Dinner: [], Snack: [] };
        let totalCalories = 0;
        let totalCarbs = 0;
        let totalProtein = 0;
        let totalFat = 0;

        data.meal.eatfood.forEach(item => {
            meals[item.mealType].push({
                food: item.food,
                calories: item.calories
            });
            totalCalories += item.calories;
            totalCarbs += item.carbs;
            totalProtein += item.protein;
            totalFat += item.fat;
        });

        setMealData(meals);

        setNutrients([
            { id: 'calories', name: '칼로리', value: totalCalories, totalValue: data.calories.calorie_goal, icon: "🔥" },
            { id: 'carbs', name: '탄수화물', value: totalCarbs, totalValue: data.calories.carbs, icon: "🌾" },
            { id: 'protein', name: '단백질', value: totalProtein, totalValue: data.calories.protein, icon: "🍖" },
            { id: 'fats', name: '지방', value: totalFat, totalValue: data.calories.fat, icon: "🍟" },
        ]);
    };

    return (
        <SafeAreaView style={styles.Vcontainer}>
            <View style={styles.contentContainer}>
                <ScrollView style={styles.nutrientContainer}>
                    <Text style={styles.title}>오늘의 영양소 섭취량🙂</Text>
                    {nutrients.map((item) => (
                        <NutrientBar
                            key={item.id}
                            name={item.name}
                            icon={item.icon}
                            value={item.value}
                            totalValue={item.totalValue}
                        />
                    ))}
                </ScrollView>
                <MealList mealData={mealData} />
                <View style={styles.container}>
                    <Text style={styles.title}>식단 추가하기🙂</Text>
                    <MealTypeSelector />
                </View>
            </View>
            <TabBar />
        </SafeAreaView>
    );
};

// 여기에 스타일을 정의합니다.
const styles = StyleSheet.create({
    Vcontainer: {
        flex: 1,
        backgroundColor: "#ddd"
    },
    contentContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: "white"
    },
    nutrientContainer: {
        flex: 1.2,
        padding: 10,
    },
    mealContainer: {
        flex: 1,
        padding: 10,
    },
    addContainer: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 20
    },
});

export default dietScreen;
