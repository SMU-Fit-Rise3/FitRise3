import React,{useState} from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const ExSelector = ({ onSelectEx }) => {
  const [selectedEx, setSelectedEx] = useState(null);
  const handleExSelect = (ex) => {
      setSelectedEx(ex); // 선택된 성별 상태 업데이트
      onSelectEx(ex); // 부모 컴포넌트로 선택된 성별 전달
  };
  
  return(
  <View style={styles.container}>
    <Pressable 
      onPress={() => handleExSelect('beginner')} 
      style={[
        styles.exOption,
        selectedEx === 'beginner' && styles.selected, // 조건부 스타일 적용
      ]}
    >
    <Text style={styles.icon}>🌱</Text>
    </Pressable>

    <Pressable 
      onPress={() => handleExSelect('middle')} 
      style={[
        styles.exOption,
        selectedEx === 'middle' && styles.selected, // 조건부 스타일 적용
      ]}
    >
    <Text style={styles.icon}>🌻</Text>
    </Pressable>

    <Pressable 
      onPress={() => handleExSelect('expert')} 
      style={[
        styles.exOption,
        selectedEx === 'expert' && styles.selected, // 조건부 스타일 적용
      ]}
    >
    <Text style={styles.icon}>🌳</Text>
    </Pressable>
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
    // borderRadius: "50%",
  },
  icon: {
    fontSize: 30,
},
selected: {
  backgroundColor: '#D3D3D3', // 선택된 항목의 배경색 변경
}
});

export default ExSelector;
