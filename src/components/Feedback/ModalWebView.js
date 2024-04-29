import React, { useState } from 'react';
import { Modal, StyleSheet, View, Text, Pressable, ActivityIndicator, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

const ModalWebView = () => {
    const [modalVisible, setModalVisible] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    return (
        <Modal
            visible={modalVisible}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
            transparent={true}
        >
            <SafeAreaView style={styles.modalOverlay}>
                <View style={styles.modalView}>
                    <Pressable
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.boldText}>x</Text>
                    </Pressable>
                    {loading && !error && (
                        <ActivityIndicator
                            style={styles.activityIndicator}
                            size="large"
                            color="#0000ff"
                        />
                    )}
                    <Text style={styles.boldText}>Preview</Text>
                    <WebView
                        source={{ uri: 'https://glb-web-2.vercel.app/' }}
                        onLoad={() => setLoading(false)}
                        onError={(e) => setError(e.nativeEvent.description)}
                        style={styles.webView}
                        scalesPageToFit={true} // Android에서 페이지 스케일 조정
                        automaticallyAdjustContentInsets={true} // iOS에서 콘텐츠 인셋 자동 조정
                    />
                    {error && (
                        <Text style={styles.errorText}>Error loading page: {error}</Text>
                    )}
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:100,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        height: '70%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 10,
        zIndex: 10,
    },
    boldText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#444',
    },
    activityIndicator: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: -12,
        marginTop: -12,
    },
    webView: {
        flex: 1,
        width: '100%', // 웹뷰 너비 전체 사용
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
});

export default ModalWebView;
