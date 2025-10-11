"use client"
import { useQuery } from '@tanstack/react-query';

export function useIndexData() {
  return useQuery({
    queryKey: ['indexes'],
    queryFn: async () => {
      const res = await fetch('/api/indexes');
      if (!res.ok) throw new Error('Failed to fetch indexes');
      const data = await res.json();
      return data.indexes;
    },
    staleTime: 5 * 60 * 1000, 
    refetchInterval: 5 * 60 * 1000, 
    refetchOnWindowFocus: true,
  });
}