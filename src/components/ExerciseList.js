import React from 'react';
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, FlatList } from 'react-native';
import CustomBtn from './CustomBtn'

// 예시 데이터
const exercises = [
  { id: '1', title: '벤치 프레스', count: '4 세트, 8회' },
  { id: '2', title: '데드리프트', count: '3 세트, 6회' },
  { id: '3', title: '스쿼트', count: '5 세트, 5회' },
  { id: '4', title: '숄더 프레스', count: '4 세트, 10회' },
  { id: '5', title: '데드리프트', count: '3 세트, 6회' },
];

const ExerciseList = () => {
  const router = useRouter();

  const ExerciseItem = ({ item }) => {
    return (
      <View style={styles.item}>
      <View style={styles.exContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.count}>{item.count}</Text>
      </View>
      <CustomBtn 
        buttonStyle= {styles.btn}
        textStyle = {styles.btnText}
        title="운동하러 가기"
        onPress={() => {
          router.push({
            pathname:'/postureCorrection', 
            params: { title: item.title, count: item.count }
          });
        }}
      />
      </View>
  )};

  return (
    <FlatList
      data={exercises}
      keyExtractor={(item) => item.id}
      renderItem={ExerciseItem}
      style={styles.flatList}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

const styles = StyleSheet.create({
  flatList: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  contentContainer: {
    paddingBottom: 5,
  },
  exContainer:{
    flexDirection:"column",
  },
  item: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 10,
    marginHorizontal:50,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:'#CECEF6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  count: {
    fontSize: 14,
    color: 'gray',
  },
  btn: {
    width:130,
    height:50,
    backgroundColor: "#380B61",
    marginBottom:0,
  },
  btnText: {
    fontSize: 16,
  }
});

export default ExerciseList;
