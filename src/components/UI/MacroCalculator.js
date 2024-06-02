import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Dimensions, Alert } from 'react-native';
import CustomBtn from '../UI/CustomBtn';
import InputFields from './InputFields.js';


const { width } = Dimensions.get('window'); // Get the screen width

const MacroCalculator = ({ totalCalories, goal, minCalories, maxCalories, onChange }) => {

  //계산된 값 상태 관리
  const [macros, setMacros] = useState({
    carbs: 0,
    protein: 0,
    fat: 0
  });

  // 사용자가 입력한 값 상태 관리
  const [userInputs, setUserInputs] = useState({
    carbs: '',
    protein: '',
    fat: ''
  });

  // 초기 매크로 계산
  const calculateInitialMacros = (calories, goal) => {
    let ratios = { carbs: 0.5, protein: 0.3, fat: 0.2 };
    if (goal === 'cut') {
      ratios = { carbs: 0.65, protein: 0.25, fat: 0.1 };
    } else if (goal === 'muscle') {
      ratios = { carbs: 0.6, protein: 0.2, fat: 0.2 };
    }

    const initialMacros = {
      carbs: Math.round(calories * ratios.carbs),
      protein: Math.round(calories * ratios.protein),
      fat: Math.round(calories * ratios.fat)
    };
    setMacros(initialMacros);

    onChange({
      totalCalories:calories,
      carbs:Math.floor(initialMacros.carbs/4),
      protein:Math.floor(initialMacros.protein/4),
      fat:Math.floor(initialMacros.fat/9)
    });
  };

  // 사용자 입력 처리
  const handleGramsChange = (nutrient, grams) => {
    setUserInputs(prev => ({ ...prev, [nutrient]: grams }));
  };

  const getInputValue = (nutrient) => {
    const factor = nutrient === 'fat' ? 9 : 4;
    return userInputs[nutrient] === '' ? Math.round(macros[nutrient] / factor).toString() : userInputs[nutrient];
  };

  // 칼로리 총량 
  const totalCaloriesConsumed = macros.carbs + macros.protein + macros.fat;

  // 영양성분 양 업데이트 함수
  const updateMacros = () => {
    let newMacros = { ...macros };
    console.log(userInputs);
    Object.keys(userInputs).forEach(nutrient => {
      if (userInputs[nutrient] !== '') {
        const factor = nutrient === 'fat' ? 9 : 4;
        newMacros[nutrient] = parseInt(userInputs[nutrient], 10) * factor;

        //Send server
        AsyncStorage.getItem('userId').then((userId) => {
          console.log(userId);
          API.insertCalories(userId, totalCaloriesConsumed, newMacros.carbs, newMacros.protein, newMacros.fat)
            .then((result) => {
              console.log('Response from server:', result);
            });
        })
        onChange({
          totalCalories:totalCaloriesConsumed,
          carbs:Math.floor(newMacros.carbs/4),
          protein:Math.floor(newMacros.protein/4),
          fat:Math.floor(newMacros.fat/9)
        });
      }
    });

    const totalCaloriesConsumed = newMacros.carbs + newMacros.protein + newMacros.fat;

    if (totalCaloriesConsumed >= (minCalories - 500) && totalCaloriesConsumed <= maxCalories) {
      setMacros(newMacros);
      Alert.alert("변경 완료", "목표 섭취량이 변경되었습니다!");
    } else {
      Alert.alert("변경 실패", `일일 권장 섭취량인 ${minCalories - 500} ~ ${maxCalories} 사이가 되도록 변경해주세요.`);
    }
  };


  useEffect(() => {
    calculateInitialMacros(totalCalories, goal);
  }, [totalCalories, goal]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <InputFields
          label="순탄수"
          unit="g"
          unitStyle={styles.kcalText}
          viewStyle={styles.inputfield}
          inputStyle={styles.kcalText}
          textInputProps={{
            onChangeText: text => handleGramsChange('carbs', text), // 상태 업데이트 함수 직접 전달
            value: getInputValue('carbs'), // 상태 값 직접 전달
            keyboardType: 'numeric'
          }}
        />
        <Text style={styles.kcalText}>x 4</Text>
        <Text style={styles.kcalText}>{macros.carbs} Kcal</Text>
      </View>
      <View style={styles.row}>
        <InputFields
          label="단백질"
          unit="g"
          unitStyle={styles.kcalText}
          viewStyle={styles.inputfield}
          inputStyle={styles.kcalText}
          textInputProps={{
            onChangeText: text => handleGramsChange('protein', text), // 상태 업데이트 함수 직접 전달
            value: getInputValue('protein'), // 상태 값 직접 전달
            keyboardType: 'numeric'
          }}
        />
        <Text style={styles.kcalText}>x 4</Text>
        <Text style={styles.kcalText}>{macros.protein} Kcal</Text>
      </View>
      <View style={styles.row}>
        <InputFields
          label="지방"
          unit="g"
          unitStyle={styles.kcalText}
          viewStyle={styles.inputfield}
          inputStyle={styles.kcalText}
          textInputProps={{
            onChangeText: text => handleGramsChange('fat', text), // 상태 업데이트 함수 직접 전달
            value: getInputValue('fat'), // 상태 값 직접 전달
            keyboardType: 'numeric'
          }}
        />
        <Text style={styles.kcalText}>x 9</Text>
        <Text style={styles.kcalText}>{macros.fat} Kcal</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.kcalText}> 목표 섭취 열량🔥  = {totalCaloriesConsumed} Kcal</Text>
        <CustomBtn 
          onPress={updateMacros}
          textStyle={{fontSize:18, color:"#1490FB"}}
          title=" 변경 " 
          buttonStyle={styles.label}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: "space-between"
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    flex: 1,
    padding: 8,
    marginLeft: 10
  },
  kcalText: {
    color: "#444",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily:"Jua"
  },
  inputfield: {
    marginTop: 10,
    height: 60,
    justifyContent: "center",
    alignItems: "flex-start",
    width: width * 0.4,
  },
  label: {
    backgroundColor: '#fff',
    width: width * 0.2,
    height:40,
    padding: 0,
    marginBottom:0,
  },
});

export default MacroCalculator;
