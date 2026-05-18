import React, { useState } from "react";

import { ChartHeader } from "./ChartHeader";
import { HeatmapChartComponent } from "./HeatmapChart";

import { CaretDownIcon } from '@phosphor-icons/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { useHeatmapChart } from "../hooks/useHeatmapChart";

import { useTheme } from "@/components/theme/ThemeWrapper";
import { getDropdownClasses } from "../utils/dropdownColor";


export const HeatmapScoreWidget = () => {
    const [filterValue, setFilterValue] = useState("90 ngày");
    const { data: heatmapData, isLoading, error } = useHeatmapChart(filterValue);
    const numericDaysToView = parseInt(filterValue, 10) || 90;

    const { isNight } = useTheme();
    const { btnCls, contentCls, itemCls } = getDropdownClasses(isNight);

    const filterOptions = ["30 ngày", "60 ngày", "90 ngày"];

    return (
        <div className="w-full h-full flex flex-col">
            <ChartHeader title="Chuỗi ngày luyện tập liên tục" >
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        {/* 4a. Gắn class cho Nút bấm */}
                        <Button 
                            variant="outline" 
                            className={`flex items-center gap-2 h-8 px-3 text-sm transition-colors ${btnCls}`}
                        >
                            {filterValue}
                            <CaretDownIcon weight="bold" />
                        </Button>
                    </DropdownMenuTrigger>
                    
                    {/* 4b. Gắn class cho Khung menu */}
                    <DropdownMenuContent align="end" className={contentCls}>
                        
                        {/* 4c. Map mảng và gắn class cho từng Item */}
                        {filterOptions.map(option => (
                            <DropdownMenuItem 
                                key={option}
                                onClick={() => setFilterValue(option)}
                                className={itemCls}
                            >
                                {option}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </ChartHeader>

            <HeatmapChartComponent data={heatmapData} daysToView={numericDaysToView} />
        </div>
    )
}