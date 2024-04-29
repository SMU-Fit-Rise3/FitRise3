import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Camera } from 'expo-camera';

const CameraComponent = () => {
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
        setCharacterImageUri(photo.uri); // 촬영한 사진의 URI를 상태에 저장
        setCameraVisible(false); //모달 창 닫기
        }
    };


    return (
        <View style={styles.container}>
            <Camera style={styles.camera} ref={cameraRef}>
                <View style={styles.cameraView}>
                </View>
            </Camera>
        </View>
    );
};    

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            backgroundColor: 'gray',
        },
        camera: {
            flex: 1,
            width:'100%',
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
    });

export default CameraComponent;