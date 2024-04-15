import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


const GoalSelector = ({ onSelectGoal }) => {
    const [selectedGoal, setSelectedGoal] = useState(null);
    const handleGoalSelect = (goal) => {
        setSelectedGoal(goal); // 선택된 성별 상태 업데이트
        onSelectGoal(goal); // 부모 컴포넌트로 선택된 성별 전달
    };

    return(
        <View style={styles.container}>
            <TouchableOpacity 
                onPress={() => handleGoalSelect('cut')} 
                style={[
                    styles.exOption,
                    selectedGoal === 'cut' && styles.selected, // 조건부 스타일 적용
                  ]}
            >
            <Text style={styles.icon}>체중 감량</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => handleGoalSelect('muscle')} 
                style={[
                    styles.exOption,
                    selectedGoal === 'muscle' && styles.selected,
                ]}
            >
            <Text style={styles.icon}>근육 증가</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => handleGoalSelect('health')} 
                style={[
                    styles.exOption,
                    selectedGoal === 'health' && styles.selected,
                ]}
            >
            <Text style={styles.icon}>체력 증진</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  exOption: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  icon: {
    fontSize: 18,
    color: '#777777',
},
selected: {
    backgroundColor: '#D3D3D3', // 선택된 항목의 배경색 변경
  },
});

export default GoalSelector;
