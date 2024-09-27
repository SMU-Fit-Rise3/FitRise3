import * as FileSystem from 'expo-file-system';
import io from 'socket.io-client';
import { Asset } from 'expo-asset';

// Socket.IO 서버 주소
const socket = io(`${process.env.EXPO_PUBLIC_FLASK_IP_URL}:${process.env.EXPO_PUBLIC_SOCKET_PORT}`);

// 이미지를 서버에서 받아오는 기능
export const receiveImages = (setGifUrl) => {
    socket.on('gif_processed', async (data) => {
        console.log('GIF 처리 완료:', data);
        setGifUrl(data);
    });

    return () => {
        socket.off('gif_processed');
    };
};

// 이미지를 서버에 업로드하는 기능
export const uploadImageToServer = async (photoUri, gender, userId) => {
    console.log('ok');
    // Check if the head image file exists
    const fileInfo = await FileSystem.getInfoAsync(photoUri);
    if (!fileInfo.exists) {
        throw new Error('파일이 존재하지 않습니다.');
    }

    let asset;
    if (gender === 0) { // 여자
        asset = Asset.fromModule(require('../assets/images/girl.png'));
    } else { // 남자
        asset = Asset.fromModule(require('../assets/images/man.png'));
    }

    // Ensure the asset is downloaded
    await asset.downloadAsync();

    // Get the local URI of the asset
    const bodyImageUri = asset.localUri || asset.uri;

    const formData = new FormData();
    formData.append('body_image', { uri: bodyImageUri, name: 'body.png', type: 'image/png' });
    formData.append('head_image', { uri: photoUri, name: 'head.png', type: 'image/png' });
    formData.append('userId',userId);
    console.log('bodyImageUri:', bodyImageUri);
    console.log('photoUri:', photoUri);
    //flask 요청
    const response = await fetch(`${process.env.EXPO_PUBLIC_FLASK_IP_URL}:${process.env.EXPO_PUBLIC_SOCKET_PORT}/upload-image`, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        body: formData,
    });
    if (response.status !== 201) {
        throw new Error('서버로부터 응답을 받는 데 실패했습니다.');
    }
};
