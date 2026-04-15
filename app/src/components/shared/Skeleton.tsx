import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface SkeletonProps {
  height?: number;
  borderRadius?: number;
}

export function Skeleton({ height = 20, borderRadius = 8 }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.8, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.skeleton, { height, borderRadius, opacity }]} />
  );
}

export function FeedCardSkeleton() {
  return <View style={styles.cardSkeleton} />;
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.card,
    width: '100%',
  },
  cardSkeleton: {
    width: '100%',
    flex: 1,
    backgroundColor: Colors.card,
  },
});
