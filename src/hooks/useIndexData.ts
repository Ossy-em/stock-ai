import { useQuery } from '@tanstack/react-query';
import { fetchAllIndexes } from '@/services/stockService';

export function useIndexData() {
  return useQuery({
    queryKey: ['indexes'],
    queryFn: fetchAllIndexes,
    staleTime: 5 * 60 * 1000, 
    refetchInterval: 5 * 60 * 1000, 
  });
}