import React, {useState, useCallback} from 'react';
import { Modal, Text, View, StyleSheet, Pressable, ScrollView } from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe";

const ModalComponent = ({ modalVisible, setModalVisible, exercise, count, exerciseDetails, exerciseDescription, steps }) =>{
  const [playing, setPlaying] = useState(false);
  
  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("The video has finished playing!");
    }
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      presentationStyle={"pageSheet"}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <ScrollView style={styles.container}>
        <Pressable
          style={styles.closeButton}
          onPress={() => setModalVisible(!modalVisible)}
        >
          <Text style={styles.closeButtonText}>×</Text>
        </Pressable>
        <View style={styles.contentContainer}>
          <YoutubePlayer
            height={200}
            play={playing}
            videoId={"0DsXTSHo3lU"}
            onChangeState={onStateChange}
          />
          {/* 운동명 */}
            <Text style={styles.exerciseName}>{exercise}</Text>
            <Text style={styles.exerciseCount}>{count}</Text>
            <Text style={styles.exerciseDetails}>{exerciseDetails}</Text>
          {/* 설명 */}
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.exerciseDescription}>{exerciseDescription}</Text>
          {/* 운동 순서 */}
            <Text style={styles.sectionTitle}>How To Do It 🔥</Text>
            {steps.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
                <Text style={styles.stepDescription}>{step}</Text>
              </View>
            ))}
        </View>
      </ScrollView>
    </Modal>
  );
};

// 여기에 스타일을 정의합니다.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    position: 'absolute',
    top: 35,
    right: 35,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  contentContainer: {
    marginTop: 30,
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  DescriptionContainer: {
    padding: 20,
    width: "100%",
    height:"90%",
    borderRadius: 10,
    backgroundColor:'#FFEFFF',
    shadowColor: '#4f4f4f',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  btnText: {
      color: 'white',
      textAlign: 'center',
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  exerciseCount: {
    fontSize: 18,
    color: 'grey',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  exerciseDetails: {
    fontSize: 16,
    color: 'grey',
    marginBottom: 16,
  },
  exerciseDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    marginRight: 8,
    fontSize: 24,
    color: '#CE5fF6',
  },
  stepDescription: {
    fontSize: 16,
  },
});
  
export default ModalComponent;