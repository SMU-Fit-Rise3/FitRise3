import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

const ChatScreen = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    return (
        <View style={{ flex: 1 }}>
            {loading && !error && (
                <ActivityIndicator
                    style={{ position: 'absolute', top: '50%', left: '50%' }}
                    size="large"
                />
            )}
            <WebView
                source={{ uri: 'https://glb-web-2.vercel.app/' }}
                onLoad={() => setLoading(false)}
                onError={(e) => setError(e.nativeEvent.description)}
            />
            {error && (
                <Text style={styles.errorText}>Error loading page: {error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
});

export default ChatScreen;
