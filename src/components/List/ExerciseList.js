import React, { useState, useEffect } from 'react';
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useDispatch } from 'react-redux';
import { modalVisibleActions } from '../../store/modalVisible';
import CustomBtn from '../UI/CustomBtn'
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../api';

const ExerciseList = () => {
  const [exercise, setExercise] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();

  // 운동리스트 정보 가져오기
  useEffect(() => {
    dispatch(modalVisibleActions.turnOnLoading())
    AsyncStorage.getItem('userId').then((userId) => {
    API.getExercise(userId)
      .then((result) => {
        setExercise(formatDataForFlatList(result))
        dispatch(modalVisibleActions.turnOffLoading())
      })
      .catch((error) => {
        console.error('Error:', error);
        dispatch(modalVisibleActions.turnOffLoading())
      });
    })
  }, []);

  // 데이터 포맷팅 함수
  const formatDataForFlatList = (data) => {
    let exercises = [];
    data.forEach(user => {
      user.ex_plans.forEach(plan => {
        plan.exercises.forEach(exercise => {
          exercises.push({
            ...exercise,
            id : exercise.id,
            day: plan.day,
            title: exercise.exercise,
            count: `Sets: ${exercise.sets}, Reps: ${exercise.reps}`
          });
        });
      });
    });
    return exercises;
  };
  const ExerciseItem = ({ item }) => {

    return (
      <View style={styles.item}>
        <View style={styles.exContainer}>
          <Text style={styles.day}>{item.day}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.count}>{item.count}</Text>
        </View>
        <CustomBtn
          buttonStyle={styles.btn}
          textStyle={styles.btnText}
          title="운동하러 가기"
          onPress={() => {
            dispatch(modalVisibleActions.on());
            router.push({
              pathname: '/postureCorrection',
              params: { title: item.title, count: item.count, id: item.id }
            });
          }}
        />
      </View>
    )
  };

  return (
    <FlatList
      data={exercise}
      keyExtractor={(item) => item.id}
      renderItem={ExerciseItem}
      style={styles.flatList}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

const styles = StyleSheet.create({
  flatList: {
    marginBottom: 34,
  },
  contentContainer: {
    paddingBottom: 5,
  },
  exContainer: {
    flexDirection: "column",
    height: 'auto',
    width: 130
  },
  item: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 30,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#D6DEFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  day: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555', // 적당한 색상 선택
    marginBottom: 4 // 간격 조정
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
    width: 130,
    height: 50,
    padding: 10,
    backgroundColor: "#aaaccc",
    marginBottom: 0,
  },
  btnText: {
    fontSize: 14,
  }
});

export default ExerciseList;
