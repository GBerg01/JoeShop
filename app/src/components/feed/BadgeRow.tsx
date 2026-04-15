import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface BadgeRowProps {
  isTrending: boolean;
  discountPct: number;
  stockLevel: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export function BadgeRow({ isTrending, discountPct, stockLevel }: BadgeRowProps) {
  const isHighDiscount = discountPct >= 50;
  const isAlmostGone = stockLevel === 'low_stock';

  if (!isTrending && !isHighDiscount && !isAlmostGone) return null;

  return (
    <View style={styles.row}>
      {isTrending && (
        <View style={[styles.badge, { backgroundColor: Colors.badgeTrending }]}>
          <Text style={styles.badgeText}>🔥 Trending</Text>
        </View>
      )}
      {isHighDiscount && (
        <View style={[styles.badge, { backgroundColor: Colors.badgeDiscount }]}>
          <Text style={styles.badgeText}>Hot Deal</Text>
        </View>
      )}
      {isAlmostGone && (
        <View style={[styles.badge, { backgroundColor: Colors.badgeAlmostGone }]}>
          <Text style={styles.badgeText}>Almost Gone</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
