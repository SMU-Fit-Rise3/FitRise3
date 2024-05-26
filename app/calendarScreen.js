import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { TabBar, ExerciseList } from '../src/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../src/api';

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
      addMark(date, '#32A4FF');  // Color for diet
    }
    for (let date in exerciseData) {
      addMark(date, '#32CD32');  // Color for exercise
    }
    for (let date in weightData) {
      addMark(date, '#FF7F50');  // Color for weight
    }

    return markedDates;
  };

  renderDietData = (date) => {
    const dietInfo = this.state.dietData[date];
    return dietInfo ? (
      <ScrollView style={styles.infoContainer}>
        <Text style={styles.infoText}>Meals: {dietInfo.meals}</Text>
        <Text style={styles.infoText}>Calories: {dietInfo.calories}</Text>
        {dietInfo.food.map((item, index) => (
          <View key={index}>
            <Text style={styles.foodTitle}>{item.mealType}: {item.food}</Text>
            <Text style={styles.foodDetail}>Calories: {item.calories}</Text>
            <Text style={styles.foodDetail}>Carbs: {item.carbs}</Text>
            <Text style={styles.foodDetail}>Protein: {item.protein}</Text>
            <Text style={styles.foodDetail}>Fat: {item.fat}</Text>
          </View>
        ))}
      </ScrollView>
    ) : <Text style={styles.infoText}>No diet data for this date.</Text>;
  };

  renderExerciseData = (date) => {
    const exerciseInfo = this.state.exerciseData[date];
    return exerciseInfo ? (
      <View style={styles.infoContainer}>
        {exerciseInfo.map((item, index) => (
          <View key={index}>
            <Text style={styles.infoText}>{item.exercise}</Text>
            <Text style={styles.timeText}>Sets: {item.sets}</Text>
            <Text style={styles.timeText}>Reps: {item.reps}</Text>
          </View>
        ))}
      </View>
    ) : <Text style={styles.infoText}>No exercise data for this date.</Text>;
  };

  renderWeightData = (date) => {
    const weightInfo = this.state.weightData[date];
    return weightInfo ? (
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Weight: {weightInfo.weight} kg</Text>
      </View>
    ) : <Text style={styles.infoText}>No weight data for this date.</Text>;
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
    const { router } = this.props; // Use router from props

    const dietButtonStyle = activeScreen === 'diet' ? [styles.button, styles.activeButton, { borderColor: '#32A4FF' }] : [styles.button, { borderColor: '#32A4FF' }];
    const exerciseButtonStyle = activeScreen === 'exercise' ? [styles.button, styles.activeButton, { borderColor: '#32CD32' }] : [styles.button, { borderColor: '#32CD32' }];
    const weightButtonStyle = activeScreen === 'weight' ? [styles.button, styles.activeButton, { borderColor: '#FF7F50' }] : [styles.button, { borderColor: '#FF7F50' }];

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
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
          <Calendar
            onDayPress={this.onDaySelect}
            markedDates={this.getMarkedDates()}
            markingType={'multi-dot'}
            // The theme can be customized as per your app's design
            theme={{
              selectedDayBackgroundColor: '#D6DEFF',
              todayTextColor: '#D6DEFF',
              arrowColor: 'gray',
            }}
          />
          <View style={styles.dataContainer}>
            {this.renderData()}
          </View>
        </View>
        <TabBar router={router} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ddd"
  },
  contentContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff"
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginVertical: 20
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
    fontWeight: "bold"
  },
  infoText: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 1
  },
  timeText: {
    fontSize: 20,
    color: "#666",
    marginVertical: 1
  },
  infoContainer: {
    height: 0.25 * height
  },
  dataContainer: {
    justifyContent: 'center',
  },
  foodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  foodDetail: {
    fontSize: 16,
    color: '#555',
  },
});
