
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import Image from "next/image";

export default function Markets() {
    return (
        <section className="flex h-fit overflow-hidden gap-1">
            <div className="flex-col w-[626px]  text-white  bg-black rounded-lg">
                <div className="flex items-center justify-between h-14 px-6 py-4 bg-[#1F1F1F]">
                    <h1 className="text-[16px] semi-bold ">Indexes</h1>
                    <HiOutlineSquare3Stack3D />
                </div>

                <div className="flex flex-col h-69 px-4 bg-[#0A0A0A]">
                    <div className="flex flex-row gap-9 pl-4 text-[14px] p-2" >
                        <div className="flex flex-col h-19 justify-center px-2">
                            <div className="flex flex-row items-center gap-1 text-[14px]">
                                <div className="h-3 w-0.5 bg-[#8085FF]"></div>
                                <h1 className=""> S&P 500 EFT <span className="pl-1"> 509.90</span></h1>
                            </div>
                            <span className="text-[#F63C6B] mt-1">-3.05  -0.40%</span>
                        </div>
                        <div className="flex flex-col h-19 justify-center px-2">
                            <div className="flex flex-row items-center gap-1 text-[14px]">
                                <div className="h-3 w-0.5 bg-[#F044FF]"></div>
                                <h1> S&P 500 EFT <span className="pl-1"> 509.90</span></h1>
                            </div>
                            <span className="text-[#0FEDBE] mt-1">-3.05  -0.40%</span>
                        </div>
                        <div className="flex flex-col h-19 justify-center px-2">
                            <div className="flex flex-row items-center gap-1 text-[14px]">
                                <div className="h-3 w-0.5 bg-[#FFAA2B]"></div>
                                <h1> S&P 500 EFT <span className="pl-1"> 509.90</span></h1>
                            </div>
                            <span className="text-[#F63C6B] mt-1">-3.05  -0.40%</span>
                        </div>

                    </div>

                    <Image
                        src="/markets/lines.svg"
                        alt="graph"
                        width={600}
                        height={147}
                        className="" />
                </div>

            </div>

            <div className="flex-col w-[626px]  text-white  bg-black rounded-lg">
                <div className="flex items-center justify-between h-14 px-6 py-4 bg-[#1F1F1F]">
                    <h1 className="text-[16px] semi-bold ">Global Markets</h1>
                    <HiOutlineSquare3Stack3D />
                </div>

                <div className="flex flex-col h-69 px-4 bg-[#0A0A0A]">
                    
                    
                    <Image
                        src="/markets/graph.svg"
                        alt="graph"
                        width={600}
                        height={290}
                        className="" />
                </div>

            </div>
        </section>

    );
}