import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from "react-native-gifted-charts";

const BarChartComponent = ({ weeklyData }) => {
    // weeklyData가 null일 때 빈 배열로 처리

    const renderTooltip = (item, index) => {

        
        // 툴팁에 표시할 텍스트 구성
        const tooltipText = `
지방: ${item.stacks[2].value}g

단백질: ${item.stacks[1].value}g

탄수화물: ${item.stacks[0].value}g
        `;

        // 사용자 정의 툴팁 컴포넌트 반환
        return (
            <View style={styles.container}>
                <View style={styles.pointContainer}>
                    <View style={styles.fatPoint} />
                    <View style={styles.proPoint} />
                    <View style={styles.carbPoint} />
                </View>
                <Text style={{ color: '#666', fontSize: 12 }}>{tooltipText}</Text>
            </View>
        );
    };
    // 스택 데이터 준비
    const stackData = weeklyData.map((day) => ({
        stacks: [
            { value: day.carbs, color: '#EFCEFF' },
            { value: day.protein, color: '#D6DEFF', marginBottom: 2 },
            { value: day.fat, color: '#C0C0C0', marginBottom: 2 },
        ],
        label: `${day.label.substring(5)}`,
    }));

    // 표 maxvalue 동적할당
    const maxValue = Math.max(0, ...weeklyData.map(day => day.carbs + day.protein + day.fat)) * 2; 
    const stepValue = maxValue / 10 || 1;
    return (
        <View style={{ flex: 1 }}>
            <BarChart
                height={280}
                width={300}
                barWidth={25}
                spacing={60}
                initialSpacing={80}
                barBorderRadius={6}
                noOfSections={10}
                stepValue={stepValue}
                maxValue={maxValue}
                stackData={stackData}
                xAxisColor="#888"
                xAxisLabelTextStyle={{ color: '#555' }}
                yAxisColor="#ffffff"
                yAxisTextStyle={{ color: '#555' }}
                renderTooltip={renderTooltip}
                leftShiftForTooltip={45} // 툴팁을 오른쪽으로 이동
                leftShiftForLastIndexTooltip={45} // 마지막 인덱스 툴팁을 오른쪽으로 이동
            />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        backgroundColor: "#fff",
        borderColor: "#aaa",
        marginBottom: 5
    },
    pointContainer: {
        justifyContent: 'space-evenly',
    },
    carbPoint: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#EFCEFF',
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
        backgroundColor: '#C0C0C0',
        marginRight: 8,
    }
});

export default BarChartComponent;
