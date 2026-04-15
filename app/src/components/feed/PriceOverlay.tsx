import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface PriceOverlayProps {
  originalPrice: string;
  discountedPrice: string;
  discountPct: string;
}

export function PriceOverlay({ originalPrice, discountedPrice, discountPct }: PriceOverlayProps) {
  const orig = parseFloat(originalPrice);
  const disc = parseFloat(discountedPrice);

  return (
    <View style={styles.container}>
      <View style={styles.discountBadge}>
        <Text style={styles.discountText}>-{Math.round(parseFloat(discountPct))}%</Text>
      </View>
      <View style={styles.prices}>
        <Text style={styles.discountedPrice}>${disc.toFixed(2)}</Text>
        <Text style={styles.originalPrice}>${orig.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  discountBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  discountText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  prices: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  discountedPrice: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '800',
  },
  originalPrice: {
    color: Colors.textMuted,
    fontSize: 15,
    textDecorationLine: 'line-through',
  },
});
