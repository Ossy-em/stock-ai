
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import { useQuery } from "@tanstack/react-query";
import { fetchMarketNews } from "@/services/newsAPI";
export default function MarketOverviewPage() {

    const { data, isError, isLoading } = useQuery({
        queryKey: ['top-gainers'],
        queryFn: fetchMarketNews
    })

    return (
    
        <section className="flex-col   text-white  bg-black rounded-lg">
          <div className="flex items-center justify-between h-14 px-6 py-4 bg-[#1F1F1F]">
                              <h1 className="text-[16px] semi-bold ">Top Gainers</h1>
                              <HiOutlineSquare3Stack3D />
                          </div>
                          {
                            data && data.map((gainers, index)=>(
                                <a key={gainers.id || index} href="">
                                    
                                </a>
                            ))
                          }
                </section>
)
                }