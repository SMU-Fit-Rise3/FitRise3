import React, { useState } from 'react';
import { useRouter } from "expo-router";
import { icons } from '../../../constants';
import { StyleSheet, View, TouchableOpacity, Image, Text, Dimensions } from 'react-native';

const StressBtn = () => {
  const router = useRouter();
  const handlePress = () => {  
    router.push({
      pathname: '/stressMeasure',
    });
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <View style={styles.iconContainer}>
          <Image
            source={ icons.icon_stress_w}
            style={styles.icon}
          />
          <Text style={styles.plusText}>+</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: width * 0.5, // 화면의 4분의 1 크기
    height: height * 0.25, // 화면의 4분의 1 크기
    backgroundColor: '#99aff8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: '#000', // 테두리 색상
    borderWidth: 2, // 테두리 두께
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '120%',
    height: '120%',
    resizeMode: 'contain',
    position: 'absolute',
  },
  plusText: {
    fontSize: 80, // 텍스트 크기 증가
    color: 'black', // 텍스트 색상
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default StressBtn;