// MealTypeSelector.js
import React from 'react';
import { useRouter } from "expo-router";
import { View, FlatList, Text, StyleSheet,Dimensions } from 'react-native';
import CustomBtn from '../UI/CustomBtn';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const mealTypesData = [
  { type: 'Breakfast', image: require("../../assets/lottie/breakfast.json")},
  { type: 'Lunch', image: require("../../assets/lottie/lunch.json") },
  { type: 'Dinner', image: require("../../assets/lottie/dinner.json") },
  { type: 'Snack', image: require("../../assets/lottie/snack.json") },
];

const MealTypeSelector = ({ onMealTypeSelected }) => {
  return (
    <FlatList
      horizontal
      data={mealTypesData}
      renderItem={({ item }) => (
        <MealTypeCard
          type={item.type}
          image={item.image}
          onSelect={() => onMealTypeSelected(item.type)}
        />
      )}
      keyExtractor={(item) => item.type}
      showsHorizontalScrollIndicator={false}
      style={styles.list}
    />
  );
};

const MealTypeCard = ({ type, image}) => {
  const router = useRouter();
  return (
    <View style={styles.card}>
      <Text style={styles.type}>{type}</Text>
      <LottieView
        style={styles.lottie}
        source={image}
        autoPlay
        loop
      />
      <CustomBtn
        onPress={() => router.push({pathname:'screens/dietInput', params:{type}})}
        title = "추가하기"
        buttonStyle={styles.btn}
        textStyle={styles.btnText}/>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flexGrow: 0, // prevent FlatList from taking all the vertical space
  },
  card: {
    borderRadius: 20,
    marginVertical:5,
    marginHorizontal:10,
    width: 150, // 카드의 너비를 조절하세요
    height: 120, // 카드의 높이를 조절하세요
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Android shadow
    shadowColor: '#333', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#fff', // 카드 배경색
  },
  lottie: {
    width: width * 0.15,
    height: width * 0.15,
  },
  type: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily:"Jua",
    marginTop:5,
  },
  count: {
    color: 'gray',
  },
  selectButton: {
    marginTop: 10,
    backgroundColor: '#blue',
    padding: 10,
    borderRadius: 20,
  },
  selectText: {
    color: '#444',
  },
  btn: {
    width: 100,
    height: 30,
    padding: 0,
    backgroundColor: "#8994D7",
    marginBottom: 0,
  },
  btnText: {
    fontSize: 14,
  },
});

export default MealTypeSelector;
