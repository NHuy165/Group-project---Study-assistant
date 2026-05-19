import React, { useState } from "react";

import { ChartHeader } from "./ChartHeader";
import { FormatColumn } from "./FormatColumn";

import { CaretDownIcon } from '@phosphor-icons/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { useSubmittedFormatChart } from "../hooks/useSubmittedFormatChart";

import { useTheme } from "@/components/theme/ThemeWrapper";
import { getDropdownClasses } from "../utils/dropdownColor";


export const FormatColumnWidget = () => {
    const [filterValue, setFilterValue] = useState("7 ngày");
    const { data: columnData, isLoading, error } = useSubmittedFormatChart(filterValue);

    const { isNight } = useTheme();
    const { btnCls, contentCls, itemCls } = getDropdownClasses(isNight);

    const filterOptions = ["1 ngày", "7 ngày", "30 ngày", "60 ngày", "90 ngày"];

    return (
        <div className="w-full h-full flex flex-col">
            <ChartHeader title="Số bài nộp theo định dạng" >
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
            <FormatColumn data={columnData} />
        </div>
    )
}