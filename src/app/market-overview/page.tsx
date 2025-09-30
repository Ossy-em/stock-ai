"use client"

import React from "react"
import { MdArrowDropDown } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import Markets from "./Markets";
import News from "./news/news";
import Image from "next/image";

//import { useTranslations } from "use-intl"


export default function MarketOverviewPage() {

    return (
        <div className="w-screen p-4 bg-black h-fit">
        <section >
            <div className="flex flex-row items-center w-full gap-8 mb-4 text-white">

                <div className="flex flex-row items-center gap-4">
                    <MdArrowDropDown />
                    <Image src="" alt="Profile picture" width={24} height={24} />
                    <div className="flex flex-col">
                        <h3 className="text-[14px]">James Raymond</h3>
                        <span className="text-[#999999] text-[12px]">Account: 4453728992</span>
                    </div>
                    <div className="h-5 w-0.5 bg-[#595959]"></div>
                    <IoIosNotifications />
                </div>

                <div className="flex flex-row gap-8">
                    <div>
                        <h3 className="text-[14px]">Portfolio Balance</h3>
                        <span className="text-[#999999] text-[12px]">$623,894.97</span>
                    </div>
                    <div>
                        <h3 className="text-[14px]">Available Funds</h3>
                        <span className="text-[#999999] text-[12px]">$122,912.90</span>
                    </div>
                </div>

                <div className="w-3xs h-8 relative border border-gray-700 rounded bg-[linear-gradient(180deg,_rgba(255,255,255,0.5)_0%,_#000_17%,_#000_83%,_#000_100%)] flex items-center ml-auto">
                    <IoSearchOutline className="absolute mt-2 ml-2 text-gray-400"/>
                    <input type="text" placeholder="Search" className="pl-8 bg-transparent text-white h-full w-full outline-none" />
                </div>
            </div>

           
        </section>
         <Markets />
         <News />
        </div>
    );

}