"use client"

import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import { useQuery } from "@tanstack/react-query";

const fetchTopGainers = async () => {
  const response = await fetch('/api/market-movers')
  if (!response.ok) throw new Error('Failed to fetch top gainers')
  const result = await response.json()
  return result.data
}

export default function TopGainers() {
    const { data, isError, isLoading } = useQuery({
        queryKey: ['top-gainers'],
        queryFn: fetchTopGainers,
        staleTime: 1 * 60 * 1000, 
        refetchInterval: 1 * 60 * 1000,
    })

    if (isLoading) return <div className="text-white">Loading gainers...</div>
    if (isError) return <div className="text-white">Error loading gainers</div>

    return (
        <section className="flex-col text-white bg-black rounded-lg">
            <div className="flex items-center justify-between h-14 px-6 py-4 bg-[#1F1F1F]">
                <h1 className="text-[16px] font-semibold">Top Gainers</h1>
                <HiOutlineSquare3Stack3D />
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 px-6 py-3 border-b border-gray-800 text-gray-400 text-[12px]">
                <span>Symbol</span>
                <span>Name</span>
                <span className="text-right">Price</span>
                <span className="text-right">% Change</span>
            </div>

            {/* Table Rows */}
            <div className="flex flex-col  h-[503px] overflow-y-scroll">
                {data && data.map((stock: any) => (
                    <div 
                        key={stock.id}
                        className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-gray-800 hover:bg-[#1F1F1F] transition-colors cursor-pointer"
                    >
                        <span className="text-[14px] font-medium">{stock.symbol}</span>
                        <span className="text-[14px] text-gray-300">{stock.name}</span>
                       <span className="text-[14px] text-green-400 text-right">
  {typeof stock.price === "number" ? stock.price.toFixed(2) : "-"}
</span>
<span className="text-[14px] text-green-400 text-right font-semibold">
  {typeof stock.change_percentage === "number" ? stock.change_percentage.toFixed(2) : "-"}%
</span>

                    </div>
                ))}
            </div>
        </section>
    )
}