"use client";

import { useState } from "react";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";

import IndexCard from "@/components/indexes-chart/IndexCard"
import IndexChart from "@/components/indexes-chart/IndexChart";
import { IndexCardSkeleton, IndexChartSkeleton } from "@/components/skeleton/SkeletonLoaders";
import { useIndexData } from "@/hooks/useIndexData";
import GlobalMarket from "@/components/globalMarket";

export default function Markets() {
  const { data: indexes, isLoading, error } = useIndexData();
  const [activeIndex, setActiveIndex] = useState<string | null>(null);

  const handleIndexClick = (symbol: string) => {
    setActiveIndex(activeIndex === symbol ? null : symbol);
  };

  return (
    <section className="flex flex-col lg:flex-row h-fit gap-4 lg:gap-4 p-4 lg:p-0">

      <div className="flex flex-col w-full lg:w-1/2 text-white bg-[#0A0A0A] overflow-hidden shadow-xl">

        <div className="flex items-center justify-between h-16 px-6 py-4 bg-gradient-to-r from-[#1F1F1F] to-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg">
              <HiOutlineSquare3Stack3D className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold">Market Indexes</h1>
              <p className="text-xs text-gray-500">Real-time tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 px-6 py-6 space-y-6">
          {isLoading && (
            <>
              {/* Skeleton for cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <IndexCardSkeleton key={i} />
                ))}
              </div>
              {/* Skeleton for chart */}
              <IndexChartSkeleton />
            </>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="p-4 bg-red-500/10 rounded-full">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-red-500 font-semibold mb-1">Failed to load data</h3>
                <p className="text-gray-500 text-sm">Please try again later</p>
              </div>
            </div>
          )}

          {indexes && (
            <>
              {/* Index Cards - Interactive grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {indexes.map((index) => (
                  <IndexCard 
                    key={index.symbol} 
                    index={index}
                    isActive={activeIndex === index.symbol}
                    onClick={() => handleIndexClick(index.symbol)}
                  />
                ))}
              </div>
              
              {/* Chart */}
              <IndexChart 
                indexes={indexes}
                activeIndex={activeIndex}
                onIndexClick={handleIndexClick}
              />
            </>
          )}
        </div>
      </div>


      <div className="flex flex-col w-full lg:w-1/2 text-white bg-[#0A0A0A] overflow-hidden shadow-xl">
        <div className="flex items-center justify-between h-16 px-6 py-4 bg-gradient-to-r from-[#1F1F1F] to-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg">
              <HiOutlineSquare3Stack3D className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold">Global Markets</h1>
              <p className="text-xs text-gray-500">Worldwide overview</p>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-[#0A0A0A]">
          <GlobalMarket />
        </div>
      </div>
    </section>
  );
}