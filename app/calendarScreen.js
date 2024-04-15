import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,SafeAreaView, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import TabBar from '../src/components/TabBar.js';
import ExerciseList from '../src/components/ExerciseList.js';

const { width, height } = Dimensions.get('window'); // Get the screen dimensions

export default class CalendarScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeScreen: 'diet',
      selectedDate: new Date().toISOString().split('T')[0], // Set initial date to today
    };
  }

  // Method to update state for active screen
  setActiveScreen = (screen) => {
    this.setState({ activeScreen: screen });
  };

  // Sample data
  dietData = {
    '2024-01-02': { meals: 2, calories: 230, breakfast: 'Honey Pancake', breakfastTime: '07:00am', coffeeTime: '07:30am' },
    '2024-04-08': { meals: 2, calories: 230, breakfast: 'Honey Pancake', breakfastTime: '07:00am', coffeeTime: '07:30am' },
    // ...other dates
  };

  exerciseData = {
    '2024-01-18': { exercise: 'Bench Press', sets: 4, reps: 8 },
    '2024-04-08': { exercise: 'Bench Press', sets: 3, reps: 8 },
    // ...other dates
  };

  weightData = {
    '2024-01-25': { weight: 50 },
    '2024-04-08': { weight: 50 },
    // ...other dates
  };

  // Handlers for each button press
  onDaySelect = (day) => {
    this.setState({ selectedDate: day.dateString });
  };

  // Render functions for each category
  renderDietData = (date) => {
    const dietInfo = this.dietData[date];
    return dietInfo ? (
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Breakfast</Text>
        <View style={styles.buttonContainer}>
          <Text style={styles.timeText}>Calories: {dietInfo.calories}</Text>
        </View>
        <Text style={styles.infoText}>{dietInfo.breakfast}</Text>
        <Text style={styles.timeText}>{dietInfo.breakfastTime}</Text>
        <Text style={styles.infoText}>Coffee</Text>
        <Text style={styles.timeText}>{dietInfo.coffeeTime}</Text>
      </View>
    ) : <Text style={styles.infoText}>No diet data for this date.</Text>;
  };

  renderExerciseData = (date) => {
    const exerciseInfo = this.exerciseData[date];
    return exerciseInfo ? (
      <View style={styles.infoContainer}>
        <ExerciseList/>
      </View>
    ) : <Text style={styles.infoText}>No exercise data for this date.</Text>;
  };

  renderWeightData = (date) => {
    const weightInfo = this.weightData[date];
    return weightInfo ? (
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Weight: {weightInfo.weight} kg</Text>
      </View>
    ) : <Text style={styles.infoText}>No weight data for this date.</Text>;
  };

  // Render the appropriate data based on the activeScreen
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
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, activeScreen === 'diet' ? styles.activeButton : null]}
                        onPress={() => this.setActiveScreen('diet')}
                    >
                        <Text style={styles.buttonText}>식단</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, activeScreen === 'exercise' ? styles.activeButton : null]}
                        onPress={() => this.setActiveScreen('exercise')}
                    >
                        <Text style={styles.buttonText}>운동</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, activeScreen === 'weight' ? styles.activeButton : null]}
                        onPress={() => this.setActiveScreen('weight')}
                    >
                        <Text style={styles.buttonText}>몸무게</Text>
                    </TouchableOpacity>
                </View>
                <Calendar
                onDayPress={this.onDaySelect}
                markedDates={{
                    [this.state.selectedDate]: {selected: true, marked: true, selectedColor: '#D6DEFF'}
                }}
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
            <TabBar router={router}/>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#ddd"
  },
  contentContainer:{
      flex:1,
      padding:10,
      backgroundColor:"#fff"
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginVertical:20
  },
  button: {
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#D6DEFF',
  },
  activeButton: {
    backgroundColor: '#D6DEFF',
  },
  buttonText: {
    color: '#555',
    fontWeight:"bold"
  },
  infoText: {
      fontSize:24,
      fontWeight:"bold",
      marginVertical:1
  },
  timeText: {
    fontSize:20,
    color:"#666",
    marginVertical:1
},
  infoContainer: {
    padding: 20,
    alignItems: 'flex-start',
    height: 0.4 * height 
  },
  dataContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
