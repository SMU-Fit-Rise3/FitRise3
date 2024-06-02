import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, Text, Dimensions, Image } from 'react-native';
import { useRouter } from "expo-router";
import { CustomBtn, StepIndicator } from '../../src/components'
import * as tf from '@tensorflow/tfjs';
import * as tfReactNative from '@tensorflow/tfjs-react-native';
import * as ImagePicker from 'expo-image-picker';
import { images } from '../../constants';
import * as FileSystem from 'expo-file-system';
import { receiveImages, uploadImageToServer } from '../../backend/getGif';
import { Asset } from 'expo-asset';

const { width, height } = Dimensions.get('window'); // Get the screen dimensions

const CharacterGAN = () => {
  const router = useRouter();
  const [imag, setImages] = useState([]);
  const [imageUri, setImageUri] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [characterImage, setCharacterImage] = useState(null);
  const [photoUri, setPhotoUri] = useState(null); //handleNextPress에서 사용하기위해
  const stepLabels = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];

  useEffect(() => {
    const unsubscribe = receiveImages(setImages); // 이미지 수신 기능을 getGif에서 가져옴.
    return () => unsubscribe();
  }, []);

  // 갤러리에서 이미지를 선택하는 함수
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // 카메라로 사진을 찍는 함수
  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const classifyImage = async () => {
    if (!imageUri) return;
    try {
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      const imageData = await FileSystem.readAsStringAsync(fileInfo.uri, { encoding: FileSystem.EncodingType.Base64 });
      const imageBuffer = tf.util.encodeString(imageData, 'base64').buffer;
      const imageTensor = tfReactNative.decodeJpeg(new Uint8Array(imageBuffer));

      // 이미지 전처리 (리사이즈 및 정규화)
      const resizedImage = tf.image.resizeBilinear(imageTensor, [224, 224]); // 모델 입력 크기에 맞춤
      const normalizedImage = resizedImage.div(255.0); // 정규화
      const batchedImage = normalizedImage.expandDims(0); // 배치 차원 추가

      console.log('Loading model...');
      const model = await tf.loadLayersModel('https://teachablemachine.withgoogle.com/models/WTW8Mtqh_/model.json');
      console.log('Model loaded successfully');

      console.log('Making predictions...');
      const predictions = await model.predict(batchedImage);
      console.log('Predictions made successfully');

      const maxIndex = predictions.as1D().argMax().dataSync()[0];
      const labels = ["long_woman", "short_woman", "long_man", "short_man"];
      setPrediction(labels[maxIndex]);

      // 예측된 결과에 따라 캐릭터 이미지 설정
      const characterImages = {
        long_woman: images.long_woman,
        short_woman: images.short_woman,
        long_man: images.long_man,
        short_man: images.short_man
      };
      setCharacterImage(characterImages[labels[maxIndex]]);

      console.log('Prediction:', images[labels[maxIndex]]);

      const predictedImage = characterImages[labels[maxIndex]];
      const uri = await loadImageUri(predictedImage); //캐릭터 이미지의 uri
      setPhotoUri(uri); // 상태 변수로 설정

    } catch (error) {
      console.error("Error classifying image: ", error);
      alert("이미지를 분류하는 데 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  useEffect(() => {
    (async () => {
      await tf.ready(); // TensorFlow.js가 준비될 때까지 대기합니다.
    })();
  }, []);

  // 캐릭터 이미지의 uri를 로드하는 함수
  const loadImageUri = async (imagePath) => {
    const asset = Asset.fromModule(imagePath);
    await asset.downloadAsync();
    return asset.localUri;
  };

  const handleNextPress = async () => {
    // 먼저 다음 화면으로 이동
    router.push('tabs/mainScreen');

    try {
      console.log(photoUri);
      uploadImageToServer(photoUri) // 캐릭터 이미지를 서버로보내는 함수
        .then(() => {
          console.log('업로드 성공');
          // 업로드 성공 처리
        })
        .catch((error) => {
          console.error('이미지 업로드 중 에러 발생:', error);
          // 업로드 실패 처리
        });
    } catch (error) {
      console.error('이미지 로딩 중 에러 발생:', error);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StepIndicator
        steps={stepLabels}
        currentStep={3}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>나만의 캐릭터를 생성하세요🏃🏻</Text>
          <Text style={styles.description}>사진을 새로 찍거나 갤러리에서 선택하여{"\n"}
            <Text style={styles.highlightedText}>나를 닮은</Text> 캐릭터를 생성하세요.
        </Text>
        {characterImage && (
          <View style={{ alignItems: 'center' }}>
            <Image source={characterImage} style={styles.image} />
            <CustomBtn
              onPress={() => setImageUri(null)}
              title="다시 선택"
              buttonStyle={styles.label}
              textStyle={styles.highlightedText}
            />
          </View>
        )}
        {!characterImage && imageUri && (
          <View style={{ alignItems: 'center' }}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <CustomBtn
              onPress={classifyImage}
              title="캐릭터 생성"
              buttonStyle={styles.label}
              textStyle={styles.highlightedText}
            />
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <CustomBtn
          onPress={selectImage}
          title="갤러리에서 선택"
          buttonStyle={styles.label}
          textStyle={styles.highlightedText}
        />
        <CustomBtn
          onPress={takePicture}
          title="사진 찍기"
          buttonStyle={styles.label}
          textStyle={styles.highlightedText}
        />
      </View>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <CustomBtn
          buttonStyle={styles.Btn}
          title="다음"
          onPress={handleNextPress}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    flex: 1,
    padding: 10,
  },
  Btn: {
    backgroundColor: '#99aff8',
    width: width * 0.85,
    marginTop: 30,
  },
  label: {
    backgroundColor: '#fff',
    width: width * 0.3,
    height: 40,
    padding: 0,
    marginBottom: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  image: {
    width: width * 0.3,
    height: height * 0.3,
    marginVertical: 20,
    resizeMode: "contain",
  },
  title: {
    fontFamily: "Jua",
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "500",
    color: "#555",
    fontFamily: "Jua",
  },
  highlightedText: {
    fontFamily: "Jua",
    color: "#1490FB",
    fontSize: 18,
  },
});

export default CharacterGAN;
