import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from "react-native-gifted-charts";

const SingleLineChart = ({ stressData }) => {
  // 라벨 컴포넌트를 정의합니다.
  const labelComponent = (label) => {
    return () => (
      <View style={{alignItems: 'center'}}>
        <Text style={{color: 'lightgray', fontSize: 12}}>{label}</Text>
      </View>
    );
  };

  // 데이터 포인트 커스터마이징
  const customizedDataPoints = stressData.map(point => ({
    value: point.value,
    labelComponent: labelComponent(point.label),
    customDataPoint: () => (
      <View
        style={{
          width: 10,
          height: 10,
          backgroundColor: '#EFCEFF',
          borderRadius: 5,
        }}
      />
    ),
  }));

  return (
    <View>
      <LineChart
        height={200}
        width={500}
        data={customizedDataPoints}
        isAnimated
        thickness={2}
        color="#EFCEFF"
        areaChart
        startFillColor="#EFCEFF"
        endFillColor="#07BAD1"
        startOpacity={0.4}
        endOpacity={0.1}
        spacing={70}
        initialSpacing={30}
        maxValue={10}
        noOfSections={5}
        yAxisTextStyle={{color: 'gray'}}
        xAxisColor="gray"
        yAxisColor="gray"
        rulesType="solid"
        rulesColor="gray"
        backgroundColor="transparent"
        hideRules
        xAxisLabelStyle={{color: 'gray', fontSize: 5}}
      />
    </View>
  );
};

export default SingleLineChart;
