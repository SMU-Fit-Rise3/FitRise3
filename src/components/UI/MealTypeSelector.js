// MealTypeSelector.js
import React from 'react';
import { useRouter } from "expo-router";
import { View, FlatList, Text, Image, StyleSheet } from 'react-native';
import { icons } from '../../../constants';
import CustomBtn from '../UI/CustomBtn';

const mealTypesData = [
  { type: 'Breakfast', image: icons.icon_breakfast},
  { type: 'Lunch', image: icons.icon_lunch },
  { type: 'Dinner', image: icons.icon_dinner },
  { type: 'Snack', image: icons.icon_snack },
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
      <Image source={image} style={styles.image} />
      <Text style={styles.type}>{type}</Text>
      <CustomBtn
        onPress={() => router.push({pathname:'screens/dietInput', params:{type}})}
        title = "추가하기"
        buttonStyle = {styles.addBtn} 
        textStyle = {styles.btnText}/>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flexGrow: 0, // prevent FlatList from taking all the vertical space
  },
  card: {
    borderRadius: 20,
    margin: 10,
    width: 150, // 카드의 너비를 조절하세요
    height: 150, // 카드의 높이를 조절하세요
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Android shadow
    shadowColor: '#333', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#fff', // 카드 배경색
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginBottom: 10,
  },
  type: {
    fontSize: 18,
    fontWeight: 'bold',
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
  addBtn:{
    backgroundColor: '#eee',
    width:100,
    height:35,
    padding:0,
    marginBottom: 0,
    marginTop:5,
    },
    btnText: {
        fontSize:14,
        color:"#444"
    }
});

export default MealTypeSelector;
