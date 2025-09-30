"use client"

import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import { useQuery } from "@tanstack/react-query";
import { fetchMarketNews } from "@/services/newsAPI";
import { formatDistanceToNow } from 'date-fns';

export default function MarketOverviewPage() {

    const { data, isError, isLoading } = useQuery({
        queryKey: ['top-news'],
        queryFn: fetchMarketNews
    })


    const formatTime = (timestamp) => {
       
        const date = new Date(timestamp * 1000);
        return formatDistanceToNow(date, { addSuffix: true });
    }

    const truncateText = (text, maxLength = 40) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    }

    if (isLoading) return <div>Loading news...</div>
    if (isError) return <div>Error loading news</div>

    return (
        <section className="flex-col text-white bg-black rounded-lg">
            <div className="flex items-center justify-between h-14 px-6 py-4 bg-[#1F1F1F]">
                <h1 className="text-[16px] semi-bold">Top News</h1>
                <HiOutlineSquare3Stack3D />
            </div>

            <div className="flex flex-col">
                {data && data.map((news, index) => (
                    <a 
                        key={news.id || index}
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-6 py-4 border-b border-gray-800 hover:bg-[#1F1F1F] transition-colors cursor-pointer"
                    >
                        <span className="text-[14px] text-white">
                            {truncateText(news.headline)}
                        </span>
                        <span className="text-[12px] text-gray-400 ml-4 whitespace-nowrap">
                            {formatTime(news.datetime)}
                        </span>
                    </a>
                ))}
            </div>
        </section>
    )
}