import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Modal,Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

const CharacterCAM = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraVisible, setCameraVisible] = useState(false);
    const [characterImageUri, setCharacterImageUri] = useState(null); // 캐릭터 이미지 URI 상태
    const cameraRef = useRef(null); // useRef 훅을 사용하여 카메라 참조 저장
  
    // 카메라 권한 요청 함수
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    // 플러스 아이콘 (카메라 열기 버튼) 클릭 이벤트 처리
    const handlePressIcon = async () => {
        if (hasPermission) {
            // 카메라 인터페이스를 띄우거나 카메라를 연 후의 로직 작성
            setCameraVisible(true);
        console.log("카메라 접근");
        } else {
            // 권한이 없을 경우 사용자에게 안내
            console.log("카메라 접근 권한이 필요합니다.");
        }
    };
    // 여기서 photo 객체를 사용하여 필요한 작업 코드 작성
    const handleTakePicture = async () => {
        if (cameraRef.current) {
          let photo = await cameraRef.current.takePictureAsync();
          //사진 로컬에 저장
          //const photoName = await `photo_${Date.now()}.jpg`;
          //const photoPath = FileSystem.documentDirectory + photoName;
        //   try {
        //       await FileSystem.moveAsync({
        //           from: photo.uri,
        //           to: photoPath,
        //       });
        //       console.log('사진이 저장된 위치:', photoPath);
        //   } catch (error){
        //       console.error('사진 저장 중 오류 발생', error);
        //   }
        setCharacterImageUri(photo.uri); // 촬영한 사진의 URI를 상태에 저장
        setCameraVisible(false); //모달 창 닫기
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>나만의 캐릭터를 생성하세요🏃🏻</Text>
            {/* 캐릭터 이미지 표시 */}
            <View style={[styles.imageContainer, characterImageUri && styles.imageContainerFilled]}>
                {!characterImageUri && (
                    <Pressable onPress={handlePressIcon} style={styles.icon}>
                        <Text style={styles.iconText}>+</Text>
                    </Pressable>
                )}
                {characterImageUri && (
                    <Image source={{ uri: characterImageUri }} style={styles.characterImage} />
                )}
            </View>
            <Modal
                animationType="slide"
                transparent={false}
                visible={cameraVisible}
                onRequestClose={() => {
                    setCameraVisible(false);
                }}
            >
                <Camera style={styles.camera} ref={cameraRef}>
                    <View style={styles.cameraView}>
                        <Pressable style={styles.takePictureButton} onPress={handleTakePicture}>
                            <Text style={styles.takePictureText}>📸</Text>
                        </Pressable>
                    </View>
                </Camera>
            </Modal>
        </View>
    );
};    

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: 20,
            backgroundColor: 'white',
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 20,
        },
        imageContainer: {
            marginTop: 20,
            marginBottom:100,
            width: '60%', // 이미지 컨테이너의 너비
            height: '80%', // 이미지 컨테이너의 높이, 스크린 비율에 따라 조절 가능
            backgroundColor: '#E8E8E8',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden', // 이미지가 컨테이너 밖으로 나가지 않도록 설정
        },
          imageContainerFilled: {
            backgroundColor: 'transparent', // 이미지가 있을 때는 배경을 투명하게 설정
        },
        icon: {
            fontSize: 50,
            color: 'red', // 플러스 아이콘 색상
        },
        iconText: {
            fontSize: 64, // 아이콘 크기
            color: '#000', // 아이콘 색상
        },camera: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
          cameraView: {
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 36,
        },
          takePictureButton: {
            alignSelf: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
        },
          takePictureText: {
            fontSize: 30,
            color: 'white',
        },
          characterImageContainer: {
            marginTop: 20, // 이미지 컨테이너의 상단 여백
            width: '100%', // 너비 90%
            aspectRatio: 1, // 너비와 높이의 비율을 1:1로 설정
            backgroundColor: '#E8E8E8', // 회색 배경
            borderRadius: 10, // 모서리 둥글게
            alignItems: 'center', // 가로 방향으로 중앙 정렬
            justifyContent: 'center', // 세로 방향으로 중앙 정렬
        },
        characterImage: {
            width: '60%', // 이미지가 컨테이너를 꽉 채우도록 설정
            height: '80%', // 이미지가 컨테이너를 꽉 채우도록 설정
            resizeMode: 'cover', // 이미지의 비율을 유지하면서 컨테이너에 맞게 조절
            marginTop: 20,
            marginBottom:100,
            borderRadius: 10,
        },
    });

export default CharacterCAM;