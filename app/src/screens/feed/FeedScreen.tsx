import React, { useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  RefreshControl,
  Text,
  ActivityIndicator,
  ViewToken,
} from 'react-native';
import { useFeed } from '../../hooks/useFeed';
import { useAnalytics } from '../../hooks/useAnalytics';
import { ProductCard } from '../../components/feed/ProductCard';
import { Colors } from '../../constants/colors';
import { FeedProduct } from '../../api/types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const VIEWABILITY_CONFIG = { viewAreaCoveragePercentThreshold: 60 };

export function FeedScreen() {
  const { items, isLoading, isFetchingMore, hasMore, fetchMore, refresh } = useFeed();
  const { track } = useAnalytics();
  const viewStartTime = useRef<Map<string, number>>(new Map());
  const [refreshing, setRefreshing] = React.useState(false);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const now = Date.now();
    viewableItems.forEach(({ item }) => {
      if (item && !viewStartTime.current.has((item as FeedProduct).id)) {
        viewStartTime.current.set((item as FeedProduct).id, now);
        track({ product_id: (item as FeedProduct).id, event_type: 'view' });
      }
    });
  }, [track]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleTrackEvent = useCallback((event: { product_id: string; event_type: 'click' | 'save' | 'unsave' }) => {
    track(event);
  }, [track]);

  const renderItem = useCallback(({ item }: { item: FeedProduct }) => (
    <ProductCard item={item} onTrackEvent={handleTrackEvent} />
  ), [handleTrackEvent]);

  const keyExtractor = useCallback((item: FeedProduct) => item.id, []);

  const getItemLayout = useCallback((_: ArrayLike<FeedProduct> | null | undefined, index: number) => ({
    length: SCREEN_HEIGHT,
    offset: SCREEN_HEIGHT * index,
    index,
  }), []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>Loading your deals...</Text>
      </View>
    );
  }

  if (!isLoading && items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No deals found. Try updating your preferences.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        pagingEnabled
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={VIEWABILITY_CONFIG}
        getItemLayout={getItemLayout}
        onEndReached={() => { if (hasMore && !isFetchingMore) fetchMore(); }}
        onEndReachedThreshold={0.3}
        removeClippedSubviews
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={2}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.accent}
          />
        }
        ListFooterComponent={
          isFetchingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator color={Colors.accent} />
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
