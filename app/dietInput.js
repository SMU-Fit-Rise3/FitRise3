import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity,
         Modal, Dimensions,ScrollView } from 'react-native';
import { useLocalSearchParams,useRouter } from 'expo-router';
import nutrientData from '../src/assets/nutrientData.json';
import { RowBar, FoodItem, SearchInput, FoodCaloriePicker, CustomBtn} from '../src/components'
const { width, height } = Dimensions.get('window'); // Get the screen width

const DietInput = () => {
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  //expo-router로 받은 params(mealType)
  const { type } = useLocalSearchParams();
  const router = useRouter();
  // 식사 유형 별 정보 저장
  const [meals, setMeals] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snack: []
  });  
  //추가할 식단 영양성분 저장
  const [savedNutrients, setSavedNutrients] = useState([]);

  //저장한 식단 삭제할 때
  const deleteFood = (index) => {
    setSavedNutrients(currentFoods => currentFoods.filter((_, i) => i !== index));
  };

  // 총 칼로리, 영양성분 계산
  const totalNutrients = () => {
    return savedNutrients.reduce((totals, food) => {
      totals.calories += parseFloat(food.calories);
      totals.carbs += parseFloat(food.nutrients.carbs_gram);
      totals.protein += parseFloat(food.nutrients.protein_gram);
      totals.fat += parseFloat(food.nutrients.fat_gram);
      return totals;
    }, { calories: 0, carbs: 0, protein: 0, fat: 0 });
  };

  const nutrientTotals = totalNutrients();


  useEffect(() => {
    setFilteredData(nutrientData);
  }, []);

  //검색 로직
  const handleSearch = (text) => {
    setQuery(text);
    const newData = text ? nutrientData.filter(item => {
      const itemData = `${item.Food_Name?.toUpperCase()} ${item.MAKER_NM?.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.includes(textData);
    }) : nutrientData;
    setFilteredData(newData);
  };

  //모달 열렸을 때
  const openModal = (item) => {
    const totalSugars = ['Fructose_g', 'Sugar_Alcohol_g', 'Maltose_g', 'Lactose_g', 'Sucrose_g', 'Glucose_g'].reduce((acc, key) => {
      const value = parseFloat(item[key]);
      return acc + (isNaN(value) ? 0 : value);
    }, 0);

    // 100g 에서 탄단지 비율 계산하는 함수
    const calculateNutrientRatios = (carbs_g, protein_g, fat_g) => {
      const total_g = carbs_g + protein_g + fat_g;
      const carbs_ratio = (carbs_g / total_g) * 100;
      const protein_ratio = (protein_g / total_g) * 100;
      const fat_ratio = (fat_g / total_g) * 100;

      return {
        carbs_ratio,
        protein_ratio,
        fat_ratio,
      };
    };

    if (item.Carbohydrates_g && item.Protein_g && item.Fat_g) {
      const nutrientRatios = calculateNutrientRatios(parseFloat(item.Carbohydrates_g), parseFloat(item.Protein_g), parseFloat(item.Fat_g));

      setSelectedItem({
        ...item,
        Total_Sugars_g: totalSugars,
        ...nutrientRatios
      });

      console.log({...nutrientRatios})
    } else {
      console.log("Insufficient nutrient information.");
    }
    setModalVisible(true);
  };

    // 그램수 변경시 값 받아오는 함수
  const handleCalorieChange = (selectedWeight, calculatedCalories) => {
    console.log("Selected Weight:", selectedWeight, "Calories:", calculatedCalories);
    setSelectedItem({
      ...selectedItem,
      gram: selectedWeight,
      calories: calculatedCalories.toFixed(0)
    });
  };
  //변경된 그램수의 영양성분 계산
  const calculateNutrientGram = ( total_g, carbs_g, protein_g, fat_g ) => {
    const carbs_gram = ((carbs_g /100 ) * total_g).toFixed(0);
    const protein_gram = ((protein_g / 100) * total_g).toFixed(0);
    const fat_gram = ((fat_g / 100) * total_g).toFixed(0);
    return { carbs_gram, protein_gram, fat_gram };
  }

  //저장 눌렀을 때 함수
  const handleSave = () => {
    const nutrientGrams = calculateNutrientGram(
      parseFloat(selectedItem.gram),
      parseFloat(selectedItem.Carbohydrates_g),
      parseFloat(selectedItem.Protein_g),
      parseFloat(selectedItem.Fat_g)
    );

    const newMeal={
      name: selectedItem.Food_Name,
      calories: selectedItem.calories,
      nutrients: nutrientGrams
    };

    setMeals(prevMeals => ({
      ...prevMeals,
      [type]: [...prevMeals[type], newMeal]
    }));

    setSavedNutrients(prevSaved => [...prevSaved, newMeal]);
    setModalVisible(false);
  }

  const handleNext = () => {
    const selectedMealData = JSON.stringify(meals[type]);
    console.log(selectedMealData)
    router.push({pathname:'/dietScreen', 
                 params:{
                  mealType: type,
                  meals: selectedMealData
                 }})
  }

  // 함수 추가: mealType에 따른 배경색 반환
  const getBackgroundColor = (mealType) => {
    switch (mealType) {
      case 'Breakfast':
        return { backgroundColor: '#fce1e4' }; // Yellow
      case 'Lunch':
        return { backgroundColor: '#ecfcdc' }; // Amber
      case 'Dinner':
        return { backgroundColor: '#dee4fa' }; // Orange
      case 'Snack':
        return { backgroundColor: '#fcffd6' }; // Deep Orange
      default:
        return { backgroundColor: '#ccdddf' }; // Default color
    }
  };


  return (
    <View style={[styles.container, getBackgroundColor(type)]}>
      <ScrollView horizontal={true} style={styles.scrollView}>
        {savedNutrients.map((food, index) => (
          <View key={index} style={styles.foodContainer}>
            <Text style={styles.foodName}>{food.name}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteFood(index)}>
              <Text>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <SearchInput query={query} handleSearch={handleSearch} />
      <FlatList
        data={filteredData}
        keyExtractor={item => item.Food_CD}
        renderItem={({ item }) => (
          <FoodItem item={item} onPress={() => openModal(item)} />
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <FoodCaloriePicker 
              foodName={selectedItem.Food_Name} 
              energyPer100g={selectedItem.Energy_kcal}
              onSave={handleCalorieChange}
            />
            <View style={{flexDirection:"row", marginTop: 30, justifyContent: 'center',}}>
              <Text style={styles.modalText}>탄수화물</Text>
              <View style={styles.carbPoint}/>
              <Text style={styles.modalText}>단백질</Text>
              <View style={styles.proteinPoint}/>
              <Text style={styles.modalText}>지방</Text>
              <View style={styles.fatPoint}/>
            </View>
            <RowBar ratios={{
              carbs_ratio: selectedItem.carbs_ratio,
              protein_ratio: selectedItem.protein_ratio,
              fat_ratio: selectedItem.fat_ratio
            }}/>
            <Text style={styles.modalText}>총 당류(g): {selectedItem.Total_Sugars_g?.toFixed(2)} g</Text>
            <Text style={styles.modalText}>식이섬유(g): {selectedItem.Dietary_Fiber_g} g</Text>
            <Text style={styles.modalText}>비타민 A(μg): {selectedItem.Vitamin_A_μg} μg</Text>
            <Text style={styles.modalText}>비타민 C(μg): {selectedItem.Vitamin_C_μg} μg</Text>
            <Text style={styles.modalText}>나트륨(mg): {selectedItem.Sodium_mg} mg</Text>
            <TouchableOpacity 
              style={[styles.button, styles.buttonCancle]} 
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.buttonCancle]}
              onPress={handleSave}>
              <Text style={styles.textStyle}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <CustomBtn
        onPress={handleNext}
        title='다음'
        textStyle={{color:"#444"}}
        buttonStyle={[styles.button, getBackgroundColor(type)]}>
      </CustomBtn>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor:"#ccdddf"
  },
  scrollView: {
    flexDirection: 'row',
    marginVertical: 20,
    borderRadius:15,
  },
  foodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    padding: 10,
    marginRight: 10
  },
  foodName: {
    marginRight: 10
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalView: {
    width: width,
    height: height * 0.7,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    width: '100%',
    padding: 20,
    backgroundColor: '#ccdddf',
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
    justifyContent:"center",
  },
  buttonCancle: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  carbPoint: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#004410',
    marginRight: 8,
  },
  proteinPoint: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#00aa10',
    marginRight: 8,
  },
  fatPoint: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#99ffaa',
    marginRight: 8,
  }
});

export default DietInput;
