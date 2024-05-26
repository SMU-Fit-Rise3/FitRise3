import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from "react-native-gifted-charts";

const LineChartComponent = ({ weightData }) => {
    
    const bmiData = weightData.map(item => ({
        label: item.label, 
        value: parseFloat(item.bmi)
    }));

    //날짜 형식 수정 && 시작 가비지 데이터 추가
    const truncatedWeightData = [
        { label: '', value: weightData[0]?.value }, 
        ...weightData.map(item => ({
            ...item,
            label: item.label.substring(5)
        }))
    ];
    
    const truncatedBmiData = [
        { label: '', value: weightData[0]?.bmi }, 
        ...bmiData.map(item => ({
            ...item,
            label: item.label.substring(5)
        }))
    ];

    return (
        <View style={styles.container}>
            <LineChart
                width={300}
                areaChart
                curved
                data={truncatedWeightData}
                data2={truncatedBmiData}
                hideDataPoints
                spacing={50}
                color1="#aaa" // 몸무게 선 색상
                color2="#56acce" // BMI 선 색상
                startFillColor1="#D6DEFF"
                startFillColor2="#fff"
                endFillColor1="#D6DEFF"
                endFillColor2="#fff"
                startOpacity={0.9}
                endOpacity={0.2}
                initialSpacing={0}
                noOfSections={5}
                yAxisColor="white"
                yAxisThickness={0}
                rulesType="solid"
                rulesColor="gray"
                yAxisTextStyle={{color: 'gray'}}
                xAxisColor="lightgray"
                xAxisTextStyle={{ textAlign: 'center' }}
                maxValue={100}
                isAnimated
                pointerConfig={{
                    pointerStripUptoDataPoint: true,
                    pointerStripColor: 'pink',
                    pointerStripWidth: 2,
                    strokeDashArray: [2, 5],
                    pointerColor: 'white',
                    radius: 4,
                    pointerLabelWidth: 100,
                    pointerLabelHeight: 120,
                    pointerLabelComponent: (items) => {
                        const originalBMIValue = items[1]?.originalValue;

                        return (
                            <View style={styles.pointerLabel}>
                                <Text style={styles.yearText}>Date: {weightData[0]?.label}</Text>
                                <Text style={styles.valueText}>Weight: {items[0]?.value}kg</Text>
                                <Text style={styles.valueText}>BMI: {items[0]?.bmi}</Text>
                            </View>
                        );
                    },
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        backgroundColor: '#ffffff',
    },
    pointerLabel: {
        height: 80,
        width: 100,
        backgroundColor: '#666',
        borderRadius: 5,
        justifyContent: 'space-evenly',
        alignItems: "center",
        marginHorizontal: 20,
        marginVertical: 30,
    },
    yearText: {
        color: 'lightgray',
        fontSize: 14,
    },
    valueText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 10,
    }
});

export default LineChartComponent;



