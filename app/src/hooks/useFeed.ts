import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { feedApi } from '../api/feed.api';
import { FeedProduct } from '../api/types';

export function useFeed() {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam = 0 }) => feedApi.getFeed(pageParam as number, 20),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const allItems: FeedProduct[] = query.data?.pages.flatMap(p => p.items) ?? [];

  const refresh = async () => {
    await feedApi.refreshFeed();
    queryClient.resetQueries({ queryKey: ['feed'] });
  };

  return {
    items: allItems,
    isLoading: query.isLoading,
    isFetchingMore: query.isFetchingNextPage,
    hasMore: query.hasNextPage,
    fetchMore: query.fetchNextPage,
    refresh,
    error: query.error,
  };
}
