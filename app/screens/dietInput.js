import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import nutrientData from '../../src/assets/nutrientData.json';
import { FoodItem, SearchInput, CustomBtn, NutrientModal, LoadingModal } from '../../src/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../src/api'
const { width, height } = Dimensions.get('window');

const DietInput = () => {
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const { type } = useLocalSearchParams();
  const router = useRouter();
  const [meals, setMeals] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snack: []
  });
  const [savedNutrients, setSavedNutrients] = useState([]);

  const deleteFood = (index) => {
    setSavedNutrients(currentFoods => currentFoods.filter((_, i) => i !== index));
  };

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

  const handleSearch = (text) => {
    setQuery(text);
    const newData = text ? nutrientData.filter(item => {
      const itemData = `${item.Food_Name?.toUpperCase()} ${item.MAKER_NM?.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.includes(textData);
    }) : nutrientData;
    setFilteredData(newData);
  };

  const openModal = (item) => {
    const totalSugars = ['Fructose_g', 'Sugar_Alcohol_g', 'Maltose_g', 'Lactose_g', 'Sucrose_g', 'Glucose_g'].reduce((acc, key) => {
      const value = parseFloat(item[key]);
      return acc + (isNaN(value) ? 0 : value);
    }, 0);

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

      console.log({ ...nutrientRatios });
    } else {
      console.log("Insufficient nutrient information.");
    }
    setModalVisible(true);
  };

  const handleCalorieChange = (selectedWeight, calculatedCalories) => {
    console.log("Selected Weight:", selectedWeight, "Calories:", calculatedCalories);
    setSelectedItem({
      ...selectedItem,
      gram: selectedWeight,
      calories: calculatedCalories.toFixed(0)
    });
  };

  const calculateNutrientGram = (total_g, carbs_g, protein_g, fat_g) => {
    const carbs_gram = ((carbs_g / 100) * total_g).toFixed(0);
    const protein_gram = ((protein_g / 100) * total_g).toFixed(0);
    const fat_gram = ((fat_g / 100) * total_g).toFixed(0);
    return { carbs_gram, protein_gram, fat_gram };
  };

  const handleSave = () => {
    const nutrientGrams = calculateNutrientGram(
      parseFloat(selectedItem.gram),
      parseFloat(selectedItem.Carbohydrates_g),
      parseFloat(selectedItem.Protein_g),
      parseFloat(selectedItem.Fat_g)
    );

    const newMeal = {
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
  };

  const handleNext = () => {
    const selectedMealData = JSON.stringify(meals[type]);
    console.log(selectedMealData)
    console.log(type)
    //여기서 요청
    setIsLoading(true);
    AsyncStorage.getItem('userId').then((userId) => {
      API.postEatFood(userId, type, selectedMealData)
        .then(() => {
          router.push({
            pathname: 'tabs/dietScreen'
          });
          setIsLoading(false);
        })
    })
  };

  const getBackgroundColor = (mealType) => {
    switch (mealType) {
      case 'Breakfast':
        return { backgroundColor: '#fce1e4' };
      case 'Lunch':
        return { backgroundColor: '#ecfcdc' };
      case 'Dinner':
        return { backgroundColor: '#dee4fa' };
      case 'Snack':
        return { backgroundColor: '#fcffd6' };
      default:
        return { backgroundColor: '#ccdddf' };
    }
  };

  return (
    <View style={[styles.container, getBackgroundColor(type)]}>
      <ScrollView horizontal={true} style={styles.scrollView}>
        {savedNutrients.map((food, index) => (
          <View key={index} style={styles.foodContainer}>
            <Text style={styles.foodName}>{food.name}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteFood(index)}>
              <Text style={{ fontWeight: "bold", fontSize: 10 }}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <SearchInput query={query} handleSearch={handleSearch} />
      <View style={styles.flatListContainer}>
        <FlatList
          data={filteredData}
          keyExtractor={item => item.Food_CD}
          renderItem={({ item }) => (
            <FoodItem item={item} onPress={() => openModal(item)} />
          )}
          contentContainerStyle={styles.flatListContentContainer}
        />
      </View>
      <NutrientModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedItem={selectedItem}
        handleCalorieChange={handleCalorieChange}
        handleSave={handleSave}
      />
      <CustomBtn
        onPress={handleNext}
        title='다음'
        textStyle={{ color: "#444" }}
        buttonStyle={[styles.button, getBackgroundColor(type)]}
      />
      <LoadingModal visible={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#ccdddf"
  },
  scrollView: {
    flexDirection: 'row',
    marginVertical: 20,
    borderRadius: 15,
  },
  foodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    marginRight: 10
  },
  foodName: {
    marginRight: 10
  },
  deleteButton: {
    backgroundColor: '#eee',
    padding: 5,
    borderRadius: 30
  },
  flatListContainer: {
    height: height * 0.65, // FlatList의 높이를 고정
  },
  flatListContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  button: {
    width: '100%',
    padding: 20,
    backgroundColor: '#ccdddf',
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
    justifyContent: "center",
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999'
  }
});

export default DietInput;
