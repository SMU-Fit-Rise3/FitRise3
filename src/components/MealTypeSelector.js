// MealTypeSelector.js
import React from 'react';
import { useRouter } from "expo-router";
import { View, FlatList, Text, Image, StyleSheet } from 'react-native';
import { icons } from '../../constants';
import CustomBtn from './CustomBtn';
const mealTypesData = [
  {
    type: 'Breakfast',
    image: icons.icon_breakfast, // 아침 이미지 경로
  },
  {
    type: 'Lunch',
    image: icons.icon_lunch, // 점심 이미지 경로
  },
  {
    type: 'Dinner',
    image: icons.icon_dinner, // 저녁 이미지 경로
  },
  {
    type: 'Snack',
    image: icons.icon_snack, // 간식 이미지 경로
  },
  // 여기에 더 많은 식사 유형을 추가할 수 있습니다.
];

const MealTypeSelector = ({ onMealTypeSelected }) => {
    const router = useRouter();
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

const MealTypeCard = ({ type, image, count, onSelect }) => {
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />
      <Text style={styles.type}>{type}</Text>
      <CustomBtn
        onPress={() => router.push('/chatScreen')}
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
