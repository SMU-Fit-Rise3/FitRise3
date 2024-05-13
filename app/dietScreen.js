import React,{ useState, useEffect } from 'react';
import { useLocalSearchParams } from "expo-router";
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { NutrientBar,MealList,MealTypeSelector,TabBar } from '../src/components'


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

    //받아온 식단 데이터
    const { mealType, meals } = useLocalSearchParams();
    const [parsedMeals, setParsedMeals] = useState([]);

    // meals 데이터 파싱
    useEffect(() => {
        if (meals) { // meals 데이터가 있는지 체크
            try {
                const parsed = JSON.parse(meals);
                if (Array.isArray(parsed)) {
                    setParsedMeals(parsed); // 파싱된 데이터를 상태로 저장
                } else {
                    console.error('Parsed data is not an array!');
                }
            } catch (error) {
                console.error('Failed to parse meals:', error);
            }
        }
    }, [meals]); // meals 변경시에만 파싱 시도

    // NutrientBar 업데이트
    useEffect(() => {
        if (Array.isArray(parsedMeals) && parsedMeals.length > 0) {
            const updatedNutrients = nutrients.map(nutrient => {
                // 새로운 총합 계산
                const additionalTotal = parsedMeals.reduce((sum, meal) => {
                    switch (nutrient.id) {
                        case 'calories':
                            return sum + parseFloat(meal.calories);
                        case 'carbs':
                            return sum + parseFloat(meal.nutrients.carbs_gram);
                        case 'protein':
                            return sum + parseFloat(meal.nutrients.protein_gram);
                        case 'fats':
                            return sum + parseFloat(meal.nutrients.fat_gram);
                        default:
                            return sum;
                    }
                }, 0);

                // 기존 값에 새로 계산된 추가분을 더함
                return {
                    ...nutrient,
                    value: nutrient.value + additionalTotal
                };
            });
            setNutrients(updatedNutrients);
        }
    }, [parsedMeals]); // parsedMeals가 변경될 때만 계산 실행

    // URL에서 받은 `meals` 데이터 파싱 및 상태 업데이트
    useEffect(() => {
        if (meals) {
            try {
                const parsedMeals = JSON.parse(meals);
                if (Array.isArray(parsedMeals)) {
                    setMealData(prevData => ({
                        ...prevData,
                        [mealType]: parsedMeals
                    }));
                }
            } catch (error) {
                console.error('Error parsing meals:', error);
            }
        }
    }, [meals, mealType]); // meals와 mealType이 변경될 때 실행


    
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
                <MealList mealData={mealData} />
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
