import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Linking,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { FeedProduct } from '../../api/types';
import { Colors } from '../../constants/colors';
import { BadgeRow } from './BadgeRow';
import { PriceOverlay } from './PriceOverlay';
import { HeartAnimation } from './HeartAnimation';
import { useSavesStore } from '../../store/savesStore';
import { useDoubleTap } from '../../hooks/useDoubleTap';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ProductCardProps {
  item: FeedProduct;
  onTrackEvent: (event: { product_id: string; event_type: 'click' | 'save' | 'unsave' }) => void;
}

export function ProductCard({ item, onTrackEvent }: ProductCardProps) {
  const [showHeart, setShowHeart] = useState(false);
  const { savedIds, toggle } = useSavesStore();
  const isSaved = savedIds.has(item.id);

  const handleDoubleTap = () => {
    toggle(item.id);
    setShowHeart(true);
    onTrackEvent({ product_id: item.id, event_type: isSaved ? 'unsave' : 'save' });
  };

  const handleSingleTap = () => {
    onTrackEvent({ product_id: item.id, event_type: 'click' });
    Linking.openURL(item.affiliate_url);
  };

  const handleTap = useDoubleTap(handleDoubleTap, handleSingleTap);

  return (
    <Pressable style={styles.container} onPress={handleTap}>
      {/* Hero Image */}
      <Image
        source={{ uri: item.image_urls[0] }}
        style={styles.image}
        contentFit="cover"
        priority="high"
        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
      />

      {/* Heart animation on double tap */}
      <HeartAnimation visible={showHeart} onComplete={() => setShowHeart(false)} />

      {/* Brand name top-left */}
      <View style={styles.topBar}>
        <View style={styles.brandPill}>
          <Text style={styles.brandText}>{item.brand}</Text>
        </View>
      </View>

      {/* Bottom gradient overlay with info */}
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.gradient}
        locations={[0, 0.4]}
      >
        <BadgeRow
          isTrending={item.is_trending}
          discountPct={parseFloat(item.discount_pct)}
          stockLevel={item.stock_level}
        />

        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>

        <PriceOverlay
          originalPrice={item.original_price}
          discountedPrice={item.discounted_price}
          discountPct={item.discount_pct}
        />

        <Text style={styles.ctaHint}>Tap to shop  →</Text>
      </LinearGradient>

      {/* Right side actions */}
      <View style={styles.sideActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            toggle(item.id);
            if (!isSaved) setShowHeart(true);
            onTrackEvent({ product_id: item.id, event_type: isSaved ? 'unsave' : 'save' });
          }}
        >
          <Text style={[styles.actionIcon, isSaved && styles.actionIconSaved]}>
            {isSaved ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSingleTap}
        >
          <Text style={styles.actionIcon}>🔗</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.black,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  topBar: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandPill: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  brandText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 80,
    justifyContent: 'flex-end',
  },
  productName: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    lineHeight: 26,
  },
  ctaHint: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '500',
  },
  sideActions: {
    position: 'absolute',
    right: 16,
    bottom: 140,
    alignItems: 'center',
    gap: 20,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 22,
  },
  actionIconSaved: {
    // Already handled by emoji swap
  },
});
