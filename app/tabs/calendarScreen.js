import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, ScrollView, StatusBar, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../src/api';
import LottieView from 'lottie-react-native';
import lottie from '../../constants/lottie';

const { width, height } = Dimensions.get('window'); // Get the screen dimensions

export default class CalendarScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeScreen: 'diet',
      selectedDate: new Date().toISOString().split('T')[0], // Set initial date to today
      dietData: {},
      exerciseData: {},
      weightData: {},
    };
  }

  componentDidMount() {
    this.fetchCalendarData();
  }

  fetchCalendarData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const data = await API.getCalendar(userId);
      if (data) {
        this.processApiData(data);
      }
    } catch (error) {
      console.error("Error fetching calendar data: ", error);
    }
  };

  processApiData = (data) => {
    let dietData = {};
    let exerciseData = {};
    let weightData = {};

    data.forEach(entry => {
      entry.calendar.forEach(day => {
        const date = day.day;

        if (day.eatfood && day.eatfood.length > 0) {
          dietData[date] = {
            meals: day.eatfood.length,
            calories: day.eatfood.reduce((total, item) => total + item.calories, 0),
            food: day.eatfood.map(item => ({
              mealType: item.mealType,
              food: item.food,
              calories: item.calories,
              carbs: item.carbs,
              protein: item.protein,
              fat: item.fat,
            })),
          };
        }

        if (day.doexercises && day.doexercises.length > 0) {
          exerciseData[date] = day.doexercises.map(item => ({
            exercise: item.exercise,
            sets: item.sets,
            reps: item.reps,
          }));
        }

        if (day.weight) {
          weightData[date] = { weight: day.weight };
        }
      });
    });

    this.setState({ dietData, exerciseData, weightData });
  };

  setActiveScreen = (screen) => {
    this.setState({ activeScreen: screen });
  };

  onDaySelect = (day) => {
    this.setState({ selectedDate: day.dateString });
  };

  getMarkedDates = () => {
    const { dietData, exerciseData, weightData, selectedDate } = this.state;
    let markedDates = {};

    const addMark = (date, color) => {
      if (markedDates[date]) {
        markedDates[date].dots.push({ color });
      } else {
        markedDates[date] = {
          dots: [{ color }],
          selected: selectedDate === date,
          selectedColor: '#D6DEFF',
        };
      }
    };

    for (let date in dietData) {
      addMark(date, '#9C9CE8');  // Color for diet
    }
    for (let date in exerciseData) {
      addMark(date, '#8181F7');  // Color for exercise
    }
    for (let date in weightData) {
      addMark(date, '#D0A9F5');  // Color for weight
    }

    return markedDates;
  };

  renderDietData = (date) => {
    const dietInfo = this.state.dietData[date];
    return dietInfo ? (
      <View style={styles.viewContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>오늘의 섭취 열량: <Text style={styles.highlightedText}>{dietInfo.calories}</Text> Kcal</Text>
        </View>
        <ScrollView style={styles.infoContainer}>
          {dietInfo.food.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{item.mealType}: {item.food}</Text>
              <Text style={styles.cardDetail}>열량: {item.calories} Kcal</Text>
              <Text style={styles.cardDetail}>탄수화물: {item.carbs} g</Text>
              <Text style={styles.cardDetail}>단백질: {item.protein} g</Text>
              <Text style={styles.cardDetail}>지방: {item.fat} g</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    ) : (
      <View style={styles.emptyContainer}>
        <Text style={styles.infoText}> 먹은 게 없어요</Text>
        <LottieView
            style={styles.lottie}
            source={lottie.hungry_lottie}
            autoPlay
            loop
          />
      </View>
    );
  };

  renderExerciseData = (date) => {
    const exerciseInfo = this.state.exerciseData[date];
    return exerciseInfo ? (
      <View style={styles.viewContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>오늘의 운동량</Text>
        </View>
        <ScrollView style={styles.infoContainer}>
          {exerciseInfo.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{item.exercise}</Text>
              <View style={styles.detailRow}>
                <Text style={styles.cardDetail}>세트 수: {item.sets}</Text>
                <Text style={styles.cardDetail}>횟수: {item.reps}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    ) : (
      <View style={styles.emptyContainer}>
        <Text style={styles.infoText}>운동 데이터가 없어요</Text>
        <LottieView
            style={styles.lottie}
            source={lottie.lazy_lottie}
            autoPlay
            loop
          />
      </View>
    );
  };

  renderWeightData = (date) => {
    const weightInfo = this.state.weightData[date];
    return weightInfo ? (
      <View style={styles.viewContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>오늘의 몸무게</Text>
        </View>
        <View style={[styles.infoContainer, { alignItems: "center" }]}>
          <Text style={[styles.infoText, { fontSize: 50, }]}>{weightInfo.weight} kg</Text>
          <LottieView
            style={styles.lottie}
            source={lottie.scale_lottie}
            autoPlay
            loop
          />
        </View>
      </View>
    ) : (
      <View style={styles.emptyContainer}>
        <Text style={styles.infoText}> 몸무게 측정을 안했어요 </Text>
        <LottieView
            style={styles.lottie}
            source={lottie.scale_lottie}
            autoPlay
            loop
          />
      </View>
    );
  };

  renderData = () => {
    const { activeScreen, selectedDate } = this.state;
    switch (activeScreen) {
      case 'diet':
        return this.renderDietData(selectedDate);
      case 'exercise':
        return this.renderExerciseData(selectedDate);
      case 'weight':
        return this.renderWeightData(selectedDate);
      default:
        return <Text>No data available.</Text>;
    }
  };

  render() {
    const { activeScreen } = this.state;

    const dietButtonStyle = activeScreen === 'diet' ? [styles.button, styles.activeButton, { borderColor: '#9C9CE8' }] : [styles.button, { borderColor: '#9C9CE8' }];
    const exerciseButtonStyle = activeScreen === 'exercise' ? [styles.button, styles.activeButton, { borderColor: '#8181F7' }] : [styles.button, { borderColor: '#8181F7' }];
    const weightButtonStyle = activeScreen === 'weight' ? [styles.button, styles.activeButton, { borderColor: '#D0A9F5' }] : [styles.button, { borderColor: '#D0A9F5' }];

    return (
      <SafeAreaView style={styles.mainContainer}>
        {Platform.OS === 'android' && <StatusBar barStyle="dark-content" backgroundColor="#F5F6FB" />}
        <View style={styles.contentContainer}>
          <View style={styles.calendarContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={dietButtonStyle}
                onPress={() => this.setActiveScreen('diet')}
              >
                <Text style={styles.buttonText}>식단</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={exerciseButtonStyle}
                onPress={() => this.setActiveScreen('exercise')}
              >
                <Text style={styles.buttonText}>운동</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={weightButtonStyle}
                onPress={() => this.setActiveScreen('weight')}
              >
                <Text style={styles.buttonText}>몸무게</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              <Calendar
                onDayPress={this.onDaySelect}
                markedDates={this.getMarkedDates()}
                markingType={'multi-dot'}
                theme={{
                  selectedDayBackgroundColor: '#D6DEFF',
                  todayTextColor: '#D6DEFF',
                  arrowColor: 'gray',
                  textDayFontFamily: 'Jua',
                  textMonthFontFamily: 'Jua',
                  textDayHeaderFontFamily: 'Jua',
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 16,
                }}
              />
            </ScrollView>
          </View>
          <View style={styles.dataContainer}>
            {this.renderData()}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F5F6FB",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#F5F6FB",
  },
  calendarContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginVertical: 20,
  },
  button: {
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
  },
  activeButton: {
    backgroundColor: '#D6DEFF',
  },
  buttonText: {
    color: '#555',
    fontFamily: "Jua",
  },
  infoText: {
    fontSize: 18,
    fontFamily: "Jua",
    marginVertical: 3,
    color: '#333',
  },
  infoContainer: {
    height: 0.35 * height,
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: "Jua",
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Jua",
    color: '#444',
    marginBottom: 6,
  },
  cardDetail: {
    fontSize: 14,
    fontFamily: "Jua",
    color: '#666',
    marginVertical: 3,
  },
  dataContainer: {
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  highlightedText: {
    fontFamily: "Jua",
    color: "#1490FB",
    fontSize: 20,
  },
  lottie: {
    width: width * 0.8,
    height: height * 0.2,
  },
  emptyContainer: {
    justifyContent: 'flex-start', // 상단 정렬
    alignItems: 'center', // 중앙 정렬
    paddingTop: 20, // 상단 여백 추가
  },
});
