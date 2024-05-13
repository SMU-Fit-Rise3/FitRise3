import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity,
         Modal, Dimensions,ScrollView } from 'react-native';
import { useLocalSearchParams,useRouter } from 'expo-router';
import nutrientData from '../src/assets/nutrientData.json';
import { RowBar, FoodItem, SearchInput, FoodCaloriePicker} from '../src/components'
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


  return (
    <View style={styles.container}>
      <Text>Total Calories: {nutrientTotals.calories} kcal</Text>
      <Text>Total Carbs: {nutrientTotals.carbs}g</Text>
      <Text>Total Protein: {nutrientTotals.protein}g</Text>
      <Text>Total Fat: {nutrientTotals.fat}g</Text>
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
      <TouchableOpacity 
              style={[styles.button, styles.buttonCancle]}
              onPress={handleNext}>
              <Text style={styles.textStyle}>다음</Text>
      </TouchableOpacity>
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
              onSave={handleCalorieChange}/>
            <RowBar ratios={{
              carbs_ratio: selectedItem.carbs_ratio,
              protein_ratio: selectedItem.protein_ratio,
              fat_ratio: selectedItem.fat_ratio
            }}/>
            <View style={{flexDirection:"row", marginTop: 30}}>
              <Text style={styles.modalText}>탄수화물(g): {selectedItem.Carbohydrates_g} g </Text>
              <Text style={styles.modalText}>단백질(g): {selectedItem.Protein_g} g</Text>
              <Text style={styles.modalText}>지방(g): {selectedItem.Fat_g} g</Text>
            </View>
            <Text style={styles.modalText}>총 당류(g): {selectedItem.Total_Sugars_g?.toFixed(2)} g</Text>
            <TouchableOpacity style={[styles.button, styles.buttonCancle]} onPress={() => setModalVisible(!modalVisible)}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    paddingHorizontal: 10,
  },
  scrollView: {
    flexDirection: 'row',
    marginVertical: 20
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
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonCancle: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default DietInput;
