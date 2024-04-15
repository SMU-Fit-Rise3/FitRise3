import React from 'react';
import { useRouter } from "expo-router";
import { View, StyleSheet,ScrollView,Text } from 'react-native';
import TabBar from '../src/components/TabBar.js';
import BarChart from '../src/components/BarChartComponent.js';
import LineChart from '../src/components/LineChartComponent.js';
import StressChart from '../src/components/SingleLineChart.js';
import CustomButton from '../src/components/CustomBtn';
import InputField from '../src/components/InputFields';
import NutrientAlert from '../src/components/InfoAlertComponent';

const weeklyNutritionData = [
    { carbs: 120, protein: 80, fats: 60 },
    { carbs: 70, protein: 100, fats: 50 },
    { carbs: 130, protein: 90, fats: 70 },
    { carbs: 80, protein: 90, fats: 70 },
    { carbs: 100, protein: 50, fats: 40 },
    // 주마다 데이터 추가
];

const weight =[
    {value: 70},
    {value: 72},
    {value: 68},
    {value: 75},
    {value: 73}, 
    {value: 72},
    {value: 68},
]
const BMI =[
    {value: 23},
    {value: 23.4},
    {value: 22},
    {value: 25},
    {value: 24}, 
    {value: 23},
    {value: 25},
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
    const router = useRouter();

    const handleNextPress = () => {
        console.log('입력 버튼 눌림'); // 다음 화면으로 이동하는 로직
        router.push('/characterGAN') //화면 이동
    };
    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.centerContainer}>
                    <View styles={{flex:2}}>
                        <Text style={styles.title}>스트레스 😖</Text>
                        <StressChart stressData={stressData}/>
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>몸무게 & BMI 변화량 ⚖️</Text>
                        <LineChart weightData={weight} bmiData={BMI}/>
                        <View style={styles.HorContainer}>
                            <InputField
                                label="몸무게"
                                placeholder="몸무게 입력"
                                onChangeText={(text) => console.log(text)}
                                extraStyle={styles.textField}
                            />
                            <CustomButton
                                onPress={handleNextPress}
                                title=" 입력 "
                                buttonStyle={styles.duplicateCheckBtn}
                            />
                        </View>
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>영양분 섭취량 🍴</Text>
                        <BarChart weeklyData = {weeklyNutritionData} />
                        <NutrientAlert infoName="단백질" amount="30g"/>
                    </View>
                </View>
            </ScrollView>
            <TabBar router={router}/>
        </View>    
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor:"white",
    },
    scrollContainer: {
        padding:20
    },
    centerContainer: {
        alignItems:"center"
    },
    contentContainer: {
        flex: 1,
        alignItems:"flex-start",
    },
    HorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width:"100%",
        padding: 20,
    },
    duplicateCheckBtn: {
        width:150,
        height:55,
        backgroundColor: '#d9a1d5',
        borderRadius: 10,
        alignItems: 'center',
        marginLeft: 20,
        marginTop: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop:40,
    },
    textField: {
        width:300
    }
});

export default analysisScreen
