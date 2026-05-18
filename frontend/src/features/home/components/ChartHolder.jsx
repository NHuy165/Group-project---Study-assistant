import { useRef } from "react";

import { AnimatedChart } from "./AnimatedChart"

export const ChartHolder = ({ listOfCharts, sidebarCardCls, isNight }) => {
    const scrollRef = useRef(null);

    return (
        <div className="flex flex-col w-full overflow-y-auto gap-8">
            {listOfCharts.map((item) => (
                <div key={item.id} className={`flex flex-col rounded-2xl shadow-sm shrink-0 rounded-[1.5rem] p-5 border-2 transition-all ${sidebarCardCls}`}>
                    <AnimatedChart scrollRoot={scrollRef} aspectClass={item.aspectClass}>
                        {item.Widget}
                    </AnimatedChart>
                </div>
            ))}
        </div>
    )
}