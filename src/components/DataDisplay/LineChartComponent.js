import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from "react-native-gifted-charts";
// BMI 데이터를 스케일링하는 함수
const scaleBMI = (bmiData, weightData) => {
    const weightMax = Math.max(...weightData.map(d => d.value));
    const bmiMax = Math.max(...bmiData.map(d => d.value));
    const scaleFactor = (weightMax / bmiMax) * 0.7; // 스케일링 계수

    return bmiData.map(dataPoint => ({
        ...dataPoint,
        value: dataPoint.value * scaleFactor, // BMI 값을 스케일링
        originalValue: dataPoint.value
    }));
};


const LineChartComponent = ({ weightData, bmiData }) => {
    const scaledBMIData = scaleBMI(bmiData, weightData); // BMI 데이터 스케일링 적용
    
    return (
        <View style={styles.container}>
            <LineChart
                width={300}
                areaChart
                curved
                data={weightData}
                data2={scaledBMIData}
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
                                <Text style={styles.yearText}>Year: {new Date().getFullYear()}</Text>
                                <Text style={styles.valueText}>Weight: {items[0]?.value}kg</Text>
                                <Text style={styles.valueText}>BMI: {originalBMIValue}</Text>
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
        alignItems:"center",
        marginHorizontal: 20,
        marginVertical:30,
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
