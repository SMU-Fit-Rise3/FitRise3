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
    try {
        console.log("이미지 업로드 시작");
        const fileInfo = await FileSystem.getInfoAsync(photoUri);
        console.log("파일 정보:", fileInfo);
        if (!fileInfo.exists) {
            throw new Error('파일이 존재하지 않습니다.');
        }

        const formData = new FormData();
        formData.append('image', { uri: photoUri, name: 'userchracter.png', type: 'image/png' });

        const url = `${process.env.EXPO_PUBLIC_IP_URL}:${process.env.EXPO_PUBLIC_SOCKET_PORT}/upload-image`;
        console.log("업로드 URL:", url);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`서버 에러: ${response.statusText}`);
        }

        console.log("이미지 업로드 성공");
    } catch (error) {
        console.error("이미지 업로드 중 에러 발생:", error);
    }
};
