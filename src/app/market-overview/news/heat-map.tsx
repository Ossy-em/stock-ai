

import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import { ChevronDown } from 'lucide-react';
import Image from "next/image";
export default function MarketOverviewPage() {

    return (

        <section className="flex-col  text-white  bg-black rounded-lg">
            <div className="flex items-center justify-between h-14 px-6 py-4 bg-[#1F1F1F]">
                <h1 className="text-[16px] semi-bold">Heat Map</h1>
                <HiOutlineSquare3Stack3D />
            </div>
            <div className="flex flex-row gap-0 m-0 p-0">
                <div className="flex flex-col px-6 mt-4 gap-1 ">
                    <h3 className="text-[14px] text-[#999999]">Industries</h3>

                    <button
                        className="w-[150px] h-10 justify-between bg-gradient-to-br from-neutral-800 via-neutral-900 to-black border border-neutral-800 rounded-[5px] px-4  flex items-center" >
                        <h3 className="text-[14px] font-normal text-white">Popular</h3>
                        <ChevronDown className="w-4 h-4 text-white" />
                    </button>
                </div>

                <div className="flex flex-col  mt-4 gap-1 =">
                    <h3 className="text-[14px] text-[#999999]">Time frame</h3>

                    <div className="flex flex-row gap-1">
                        <div
                            className="w-[45px] h-10 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black border border-neutral-800 rounded-[55px] justify-center flex items-center" >
                            <h3 className="text-[14px] font-normal text-white text-center">D</h3>

                        </div>
                        <div
                            className="w-[45px] h-10 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black border border-neutral-800 rounded-[55px] justify-center flex items-center" >
                            <h3 className="text-[14px] font-normal text-white text-center">W</h3>

                        </div>
                        <div
                            className="w-[45px] h-10 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black border border-neutral-800 rounded-[55px] justify-center flex items-center" >
                            <h3 className="text-[14px] font-normal text-white text-center">M</h3>

                        </div>
                        <div
                            className="w-[45px] h-10 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black border border-neutral-800 rounded-[55px] justify-center flex items-center" >
                            <h3 className="text-[14px] font-normal text-white text-center">Y</h3>

                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 p-6">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center h-7 justify-center bg-[#1F1F1F]">
                        <h1 className="text-[14px] medium">Information Technology</h1>

                    </div>
                    <Image
                        src="/markets/Frame 21.svg"
                        alt="Stocks"
                        width={50}
                        height={50}
                        className="w-fit h-fit" />
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex items-center h-7 justify-center bg-[#1F1F1F]">
                        <h1 className="text-[14px] medium">Information Technology</h1>

                    </div>
                    <Image
                        src="/markets/Frame 21.svg"
                        alt="Stocks"
                        width={50}
                        height={50}
                        className="w-fit" />
                </div>
            </div>

        </section>
    )
}