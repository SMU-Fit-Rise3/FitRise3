import React from 'react';
import { View, Text, StyleSheet, Modal, Dimensions } from 'react-native';
import RowBar from './RowBar';
import {FoodCaloriePicker,CustomBtn} from '../UI'

const { width, height } = Dimensions.get('window');

const NutrientModal = ({
  modalVisible,
  setModalVisible,
  selectedItem,
  handleCalorieChange,
  handleSave
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>섭취량 설정</Text>
          <FoodCaloriePicker
            foodName={selectedItem.Food_Name}
            energyPer100g={selectedItem.Energy_kcal}
            onSave={handleCalorieChange}
          />
          <View style={styles.ratiosContainer}>
            <View style={styles.ratioItem}>
              <View style={styles.carbPoint} />
              <Text style={styles.modalText}>탄수화물</Text>
            </View>
            <View style={styles.ratioItem}>
              <View style={styles.proteinPoint} />
              <Text style={styles.modalText}>단백질</Text>
            </View>
            <View style={styles.ratioItem}>
              <View style={styles.fatPoint} />
              <Text style={styles.modalText}>지방</Text>
            </View>
          </View>
          <RowBar ratios={{
            carbs_ratio: selectedItem.carbs_ratio,
            protein_ratio: selectedItem.protein_ratio,
            fat_ratio: selectedItem.fat_ratio
          }} />
          <View style={styles.nutrientInfo}>
            <View style={[styles.nutrientRow, styles.boldRow]}>
              <Text style={[styles.modalTextLeft, styles.modalTextTitle]}>1회 제공량</Text>
              <Text style={styles.modalTextRight}>100 g</Text>
            </View>
            <View style={[styles.nutrientRow, styles.mediumRow]}>
              <Text style={[styles.modalTextLeft, styles.modalTextTitle]}>칼로리</Text>
              <Text style={styles.modalTextRight}>{selectedItem.Energy_kcal} kcal</Text>
            </View>
            <View style={styles.nutrientRow}>
              <Text style={styles.modalTextLeft}>총 당류(g)</Text>
              <Text style={styles.modalTextRight}>{selectedItem.Total_Sugars_g?.toFixed(2)} g</Text>
            </View>
            <View style={styles.nutrientRow}>
              <Text style={styles.modalTextLeft}>식이섬유(g)</Text>
              <Text style={styles.modalTextRight}>{selectedItem.Dietary_Fiber_g} g</Text>
            </View>
            <View style={styles.nutrientRow}>
              <Text style={styles.modalTextLeft}>비타민 A(μg)</Text>
              <Text style={styles.modalTextRight}>{selectedItem.Vitamin_A_μg} μg</Text>
            </View>
            <View style={styles.nutrientRow}>
              <Text style={styles.modalTextLeft}>비타민 C(μg)</Text>
              <Text style={styles.modalTextRight}>{selectedItem.Vitamin_C_μg} μg</Text>
            </View>
            <View style={styles.nutrientRow}>
              <Text style={styles.modalTextLeft}>나트륨(mg)</Text>
              <Text style={styles.modalTextRight}>{selectedItem.Sodium_mg} mg</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <CustomBtn
              onPress={() => setModalVisible(!modalVisible)}
              title='취소'
              buttonStyle={styles.modalButton}
              textStyle={styles.buttonText}
            />
            <CustomBtn
              onPress={handleSave}
              title='저장'
              buttonStyle={styles.modalButton}
              textStyle={styles.buttonText}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: width * 0.9,
    height: height * 0.8,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  ratiosContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: '100%',
    marginVertical: 20
  },
  ratioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10
  },
  nutrientInfo: {
    width: '100%',
    marginVertical:30,
    padding:20,
    borderWidth:0.5,
    borderColor:"#555"
  },
  modalTextLeft: {
    textAlign: "left",
    fontSize: 14,
    fontWeight:"600"
  },
  modalTextRight: {
    textAlign: "right",
    fontSize: 14
  },
  modalTextTitle: {
    fontSize:18
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    borderBottomWidth:1,
    borderBottomColor:"#444"
  },
  mediumRow: {
    borderBottomWidth:2,
    marginBottom:10
  },
  boldRow: {
    borderBottomWidth:5,
    marginBottom:10
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.7,
  },
  modalButton: {
    backgroundColor: "#fff",
    width: '45%',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center'
  },
  buttonText: {
    color: "#444",
    fontSize: 16
  },
  modalText: {
    textAlign: "center",
    fontSize: 14,
    marginVertical: 5
  },
  title: {
    color: "#444",
    fontSize: 24,
    fontWeight: "bold"
  },
  carbPoint: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#003310',
    marginRight: 8,
  },
  proteinPoint: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#337a33',
    marginRight: 8,
  },
  fatPoint: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#66b166',
    marginRight: 8,
  }
});

export default NutrientModal;
