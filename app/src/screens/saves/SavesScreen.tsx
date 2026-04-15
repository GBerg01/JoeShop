import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useInfiniteQuery } from '@tanstack/react-query';
import { savesApi } from '../../api/saves.api';
import { FeedProduct } from '../../api/types';
import { Colors } from '../../constants/colors';
import { useSavesStore } from '../../store/savesStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_SIZE = (SCREEN_WIDTH - 36) / 2;

function SavedItem({ item, onUnsave }: { item: FeedProduct; onUnsave: (id: string) => void }) {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => Linking.openURL(item.affiliate_url)}
      onLongPress={() => onUnsave(item.id)}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: item.image_urls[0] }}
        style={styles.itemImage}
        contentFit="cover"
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemBrand}>{item.brand}</Text>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.itemPriceRow}>
          <Text style={styles.itemPrice}>${parseFloat(item.discounted_price).toFixed(2)}</Text>
          <View style={styles.itemBadge}>
            <Text style={styles.itemBadgeText}>-{Math.round(parseFloat(item.discount_pct))}%</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function SavesScreen() {
  const { toggle } = useSavesStore();

  const query = useInfiniteQuery({
    queryKey: ['saves'],
    queryFn: ({ pageParam = 0 }) => savesApi.getSaves(pageParam as number, 20),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    initialPageParam: 0,
  });

  const items: FeedProduct[] = query.data?.pages.flatMap(p => p.items) ?? [];

  const handleUnsave = useCallback((productId: string) => {
    toggle(productId);
    query.refetch();
  }, [toggle, query]);

  if (query.isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Loading saved items...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved</Text>
        <Text style={styles.count}>{items.length} items</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyEmoji}>🤍</Text>
          <Text style={styles.emptyText}>Nothing saved yet.</Text>
          <Text style={styles.emptyHint}>Double-tap items in your feed to save them.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <SavedItem item={item} onUnsave={handleUnsave} />
          )}
          onEndReached={() => {
            if (query.hasNextPage && !query.isFetchingNextPage) {
              query.fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.3}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 10,
  },
  title: { color: Colors.textPrimary, fontSize: 26, fontWeight: '800' },
  count: { color: Colors.textMuted, fontSize: 14 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  emptyEmoji: { fontSize: 52, marginBottom: 8 },
  emptyText: { color: Colors.textSecondary, fontSize: 17, fontWeight: '600' },
  emptyHint: { color: Colors.textMuted, fontSize: 14, textAlign: 'center', paddingHorizontal: 40 },
  listContent: { paddingHorizontal: 12, paddingBottom: 100 },
  columnWrapper: { gap: 12, marginBottom: 12 },
  item: {
    width: ITEM_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.card,
  },
  itemImage: { width: ITEM_SIZE, height: ITEM_SIZE * 1.3 },
  itemInfo: { padding: 10 },
  itemBrand: { color: Colors.textMuted, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  itemName: { color: Colors.textPrimary, fontSize: 13, fontWeight: '500', marginTop: 2, marginBottom: 6 },
  itemPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  itemPrice: { color: Colors.white, fontSize: 15, fontWeight: '700' },
  itemBadge: { backgroundColor: Colors.accent, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  itemBadgeText: { color: Colors.white, fontSize: 10, fontWeight: '700' },
});
