import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from "react-native-gifted-charts";

const BarChartComponent = ({ weeklyData }) => {
    const renderTooltip = (item, index) => {
        // 툴팁에 표시할 텍스트 구성
        const tooltipText = `
탄수화물: ${item.stacks[0].value}g

단백질: ${item.stacks[1].value}g

지방: ${item.stacks[2].value}g
        `;

        // 사용자 정의 툴팁 컴포넌트 반환
        return (
            <View style={styles.container}>
                <View style={styles.pointContainer}>
                    <View style={styles.fatPoint}/>
                    <View style={styles.proPoint}/>
                    <View style={styles.carbPoint}/>
                </View>
                <Text style={{ color: '#666', fontSize:12}}>{tooltipText}</Text>
            </View>
        );
    };

    // 스택 데이터 준비
    const stackData = weeklyData.map((week, index) => ({
        stacks: [
            { value: week.carbs, color: '#C0C0C0' },
            { value: week.protein, color: '#D6DEFF', marginBottom: 2 },
            { value: week.fats, color: '#EFCEFF', marginBottom: 2 },
        ],
        label: `${index + 1}주차`,
    }));

    return (
        <View style={{flex: 1}}>
            <BarChart
                height={300}
                width={500}
                barWidth={25}
                spacing={60}
                initialSpacing={80}
                barBorderRadius={6}
                noOfSections={10}
                stepValue={50}
                maxValue={500}
                stackData={stackData}
                xAxisColor="#888"
                xAxisLabelTextStyle={{color: '#555'}}
                yAxisColor="#ffffff"
                yAxisTextStyle={{color: '#555'}}
                renderTooltip={renderTooltip}
                leftShiftForTooltip={45} // 툴팁을 왼쪽으로 약간 이동
                leftShiftForLastIndexTooltip={45}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 24,
        borderWidth:1,
        borderRadius:5,
        padding:10,
        backgroundColor:"#fff",
        borderColor:"#aaa",
        marginBottom:5
    },
    pointContainer: {
        justifyContent: 'space-evenly',
    },
    carbPoint: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#C0C0C0',
        marginRight: 8,
    },
    proPoint: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#D6DEFF',
        marginRight: 8,
    },
    fatPoint: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#EFCEFF',
        marginRight: 8,
    }
});

export default BarChartComponent;
