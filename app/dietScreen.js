import React from 'react';
import { useRouter } from "expo-router";
import { View, StyleSheet, SafeAreaView, ScrollView, Text } from 'react-native';
import { NutrientBar,MealList,MealTypeSelector,TabBar } from '../src/components'

// 메인 화면 컴포넌트
const dietScreen = () => {
    const nutrients = [
        { id: 'calories', name: '칼로리', value: 1580, totalValue: 2000, icon: "🔥" },
        { id: 'carbs', name: '탄수화물', value: 100, totalValue: 200, icon: "🌾" },
        { id: 'protein', name: '단백질', value: 100, totalValue: 120, icon: "🍖" },
        { id: 'fats', name: '지방', value: 90, totalValue: 100, icon: "🍟" },
    ];
    
    return (
        <SafeAreaView style={styles.Vcontainer}>
            <View style={styles.contentContainer}>
                <View style={styles.nutrientContainer}>
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
                </View>
                <MealList/>
                <View style={styles.container}>
                    <Text style={styles.title}>식단 추가하기🙂</Text>
                    <MealTypeSelector/>
                </View>
            </View>
        <TabBar/>
    </SafeAreaView>
    );
    };

// 여기에 스타일을 정의합니다.
const styles = StyleSheet.create({
    Vcontainer:{
        flex: 1,
        backgroundColor:"#ddd"
    },
    contentContainer: {
        flex: 1,
        padding: 10,
        backgroundColor:"white"
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
        marginTop:10,
        marginBottom:20
    },
});

export default dietScreen;
