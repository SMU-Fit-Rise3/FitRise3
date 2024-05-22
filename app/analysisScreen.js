import React, { useState } from 'react';
import { useRouter } from "expo-router";
import { View, StyleSheet, ScrollView, Text, SafeAreaView, Dimensions, Alert } from 'react-native';
import { TabBar, BarChartComponent, LineChartComponent, SingleLineChart, CustomBtn, InputFields, InfoAlertComponent, LoadingModal } from '../src/components'

import API from '../src/api'

const { width, height } = Dimensions.get('window'); // Get the screen dimensions

const weeklyNutritionData = [
    { carbs: 120, protein: 80, fats: 60 },
    { carbs: 70, protein: 100, fats: 50 },
    { carbs: 130, protein: 90, fats: 70 },
    { carbs: 80, protein: 90, fats: 70 },
    { carbs: 100, protein: 50, fats: 40 },
    // 주마다 데이터 추가
];

const weight2 = [
    { value: 70 },
    { value: 72 },
    { value: 68 },
    { value: 75 },
    { value: 73 },
    { value: 72 },
    { value: 68 },
    { value: 73 },
    { value: 72 },
    { value: 68 },
]
const BMI = [
    { value: 23 },
    { value: 23.4 },
    { value: 22 },
    { value: 25 },
    { value: 24 },
    { value: 23 },
    { value: 25 },
    { value: 24 },
    { value: 23 },
    { value: 25 },
]
const stressData = [
    { value: 0, label: '01 Apr' },
    { value: 6, label: '02 Apr' },
    { value: 4, label: '03 Apr' },
    { value: 1, label: '04 Apr' },
    { value: 8, label: '05 Apr' },
    { value: 10, label: '06 Apr' },
];

const analysisScreen = () => {
    const [weight, setWeight] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleNextPress = () => {
        console.log('입력 버튼 눌림'); 

        if (!weight) {
            Alert.alert('입력 오류', '몸무게를 입력하세요');
            return;
        }

        try {
            setIsLoading(true);
            API.updateWeight("6637163419548b4c14803d6e", weight)
                .then(data => {
                    if (data) {
                        console.log(data);
                        setIsLoading(false);
                        Alert.alert('몸무게 등록완료');
                        router.push('/characterGAN');
                    }
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
                        <LineChartComponent weightData={weight2} bmiData={BMI} />
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
                        <InfoAlertComponent infoName="단백질" amount="30g" />
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
        width: width * 0.9, // Adjust width based on screen size
        alignItems: "flex-start",
        marginBottom: 15, // Add some bottom margin for better spacing
    },
    HorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: width * 0.6,
    },
    InputBtn: {
        width: width * 0.3, // Adjust button width based on screen size
        height: 50,
        backgroundColor: '#d9a1d5',
        borderRadius: 10,
        alignItems: 'center',
        marginLeft: 20,
        marginTop: 30,
        padding: 10
    },
    title: {
        fontSize: width * 0.06, // Adjust font size based on screen width
        fontWeight: 'bold',
        marginTop: 40,
    },
    textField: {
        width: width * 0.4, // Adjust text field width based on screen size
    }
});

export default analysisScreen
