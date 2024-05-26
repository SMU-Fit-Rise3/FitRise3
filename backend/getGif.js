import * as FileSystem from 'expo-file-system';
import io from 'socket.io-client';

// Socket.IO 서버 주소
const socket = io(`${process.env.EXPO_PUBLIC_IP_URL}:${process.env.EXPO_PUBLIC_SOCKET_PORT}`);

// 이미지를 서버에서 받아오는 기능
export const receiveImages = (setImages) => {
    socket.on('gif_processed', async (data) => {
        console.log('GIF 처리 완료:', data);
        //서버에서 전송된 gif파일의 url을 받아서 저장하는 로직
        const promises = data.map(async (gif_url) => { 
            const localUri = FileSystem.documentDirectory + gif_url.split('/').pop();
            const downloadResult = await FileSystem.downloadAsync(
                `${process.env.EXPO_PUBLIC_IP_URL}:${process.env.EXPO_PUBLIC_SOCKET_PORT}${gif_url}`,
                localUri
            );

            if (downloadResult.status === 200) {
                console.log('GIF 파일이 여기에 저장되었습니다:', localUri);
                return localUri;
            } else {
                console.error('GIF 파일 다운로드 실패');
                return null;
            }
        });

        const localUris = (await Promise.all(promises)).filter(uri => uri !== null);
        setImages(prevImages => [...prevImages, ...localUris]);
    });

    return () => {
        socket.off('gif_processed');
    };
};

// 이미지를 서버에 업로드하는 기능
export const uploadImageToServer = async (photoUri) => {
    const fileInfo = await FileSystem.getInfoAsync(photoUri);
    if (!fileInfo.exists) {
        throw new Error('파일이 존재하지 않습니다.');
    }

    const formData = new FormData();
    formData.append('image', { uri: photoUri, name: 'userchracter.jpg', type: 'image/jpg' });

    const response = await fetch(`${process.env.EXPO_PUBLIC_IP_URL}:${process.env.EXPO_PUBLIC_SOCKET_PORT}/upload-image`, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        body: formData,
    });
};