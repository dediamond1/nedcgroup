import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, PanResponder, Animated, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

export const BottomSheet = ({ visible, onClose, title, onPressAccept }) => {
    const bottomSheetRef = useRef(null);
    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, { dy: pan.y }], {
                useNativeDriver: false,
            }),
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 50) {
                    onClose();
                } else {
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

    useEffect(() => {
        if (visible) {
            bottomSheetRef.current.slideInUp();
        } else {
            bottomSheetRef.current.slideOutDown();
        }
    }, [visible]);

    const overlayOpacity = pan.y.interpolate({
        inputRange: [-300, 0],
        outputRange: [0, 0.5],
        extrapolate: 'clamp',
    });

    const containerTranslateY = pan.y.interpolate({
        inputRange: [-300, 0],
        outputRange: [-300, 0],
        extrapolate: 'clamp',
    });

    const handleOverlayPress = () => {
        if (visible) {
            onClose();
        }
    };

    return (
        <>
            <Animated.View
                style={[styles.overlay, { opacity: overlayOpacity }]}
                pointerEvents={visible ? 'auto' : 'none'}
                onTouchEnd={handleOverlayPress}
            />
            <Animatable.View
                ref={bottomSheetRef}
                style={[
                    styles.container,
                    { transform: [{ translateY: containerTranslateY }] },
                ]}
                {...panResponder.panHandlers}
                animation="slideInUp"
            >
                <View style={styles.dragBar} />
                <Text style={styles.title}>{title}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, styles.yesButton]} onPress={onPressAccept}>
                        <Text style={styles.buttonText}>Ja, Makulera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.noButton]} onPress={onClose}>
                        <Text style={styles.buttonText}>Nej</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
    },
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 250,
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingHorizontal: 16,
        paddingBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    dragBar: {
        width: 40,
        height: 4,
        backgroundColor: '#ccc',
        borderRadius: 2,
        alignSelf: 'center',
        marginVertical: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
        textAlign: "center",
        lineHeight: 24,
        fontFamily: "ComviqSansWebBold",
        marginVertical: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10
    },
    button: {
        flex: 1,
        backgroundColor: '#ccc',
        borderRadius: 8,
        padding: 16,
        marginHorizontal: 8,
    },
    yesButton: {
        backgroundColor: '#2bb2e0',
    },
    noButton: {
        backgroundColor: '#e2027b',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 19,
        fontFamily: "ComviqSansWebBold"
    },
});
