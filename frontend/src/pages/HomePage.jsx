import React from "react";
import { motion } from "framer-motion";


import { Header } from "../features/home/components/Header";
import { NotebookHeader } from "../features/home/components/NotebookHeader";


import { AreaChartComponent } from "../features/home/components/AreaChart";
import { BarChartComponent } from "../features/home/components/BarChart";
import { LineChartComponent } from "../features/home/components/LineChart";
import { RadarChartComponent } from "../features/home/components/RadarChart";
import { PieChartComponent } from "../features/home/components/PieChart";
import { AnimatedChart } from "../features/home/components/AnimatedChart";

import { useChartData } from "../features/home/hooks/useChartData";


export const HomePage = () => {
  const { data: scoreData, isLoading: isScoreLoading } = useChartData("score", "subject");
  const { data: countData, isLoading: isCountLoading } = useChartData("count", "subject");

  return (
    <div className="flex flex-col h-screen bg-[#def7f2] text-[#555] px-5 py-6">
      <div className="py-6">
        <Header />
      </div>

      <div className="flex flex-1 overflow-hidden pb-6 gap-6">
        <div className="w-[80%] px-5 py-4 md:px-10 md:py-6">
          <NotebookHeader />
        </div>
        <div className="w-[20%] bg-white rounded-2xl p-10 shadow-sm overflow-y-auto">
          <AnimatedChart>
            <RadarChartComponent data={scoreData} />
          </AnimatedChart>

          <AnimatedChart>
            <PieChartComponent data={scoreData} />
          </AnimatedChart>

          <AnimatedChart>
            <AreaChartComponent data={countData}/>
          </AnimatedChart>

          <AnimatedChart>
            <BarChartComponent data={countData} />
          </AnimatedChart>
          
          <AnimatedChart>
            <LineChartComponent data={countData} />
          </AnimatedChart>
        </div>
      </div>
      
    </div>
  );
};