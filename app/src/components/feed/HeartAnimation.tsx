import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

interface HeartAnimationProps {
  visible: boolean;
  onComplete: () => void;
}

export function HeartAnimation({ visible, onComplete }: HeartAnimationProps) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scale.setValue(0);
      opacity.setValue(1);
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.4, duration: 200, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1.0, duration: 100, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1.3, duration: 100, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 1, duration: 100, useNativeDriver: true }),
          Animated.delay(400),
          Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]),
      ]).start(() => onComplete());
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.Text style={[styles.heart, { transform: [{ scale }], opacity }]}>
      ❤️
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  heart: {
    position: 'absolute',
    alignSelf: 'center',
    top: '35%',
    fontSize: 80,
    zIndex: 10,
  },
});
