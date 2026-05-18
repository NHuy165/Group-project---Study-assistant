import React, { useMemo } from 'react';
import { PieChart, Pie, Legend, Sector } from 'recharts';
import { useTheme } from "@/components/theme/ThemeWrapper";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";


const COLORS = ['#0088FE', '#FFBB28', '#FF8042'];


const renderShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, cornerRadius, startAngle, endAngle, fill, isActive, percent } = props;
  const dynamicCornerRadius = percent < 0.1 ? 10 : cornerRadius; 

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={isActive ? innerRadius - 8 : innerRadius}
        outerRadius={isActive ? outerRadius + 8 : outerRadius}
        cornerRadius={cornerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{
        transition: 'all 0.3s ease',
        ...(isActive ? { filter: `drop-shadow(0px 0px 8px ${fill}44)` } : {})
      }}
      />
    </g>
  );
};


export const PieChartComponent = ({ data, isAnimationActive }) => {
  const { isNight } = useTheme();

  const chartConfig = {
    count: {
      label: "Số lượng",
    },
  };

  const pieDataWithColors = useMemo(() => {
    return data.map((entry, index) => ({
      ...entry,
      fill: COLORS[index % COLORS.length] // Gắn trực tiếp mã màu vào từng dòng dữ liệu
    }));
  }, [data]);

  return (
    <ChartContainer config={chartConfig} className="w-full aspect-square">
      <PieChart>
        <Pie 
            data={pieDataWithColors} 
            dataKey="count" 
            nameKey="label" 
            cx="50%" 
            cy="50%" 
            innerRadius="50%" 
            outerRadius="70%" 
            cornerRadius="10%" 
            paddingAngle={3} 
            shape={renderShape}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            isAnimationActive={isAnimationActive}>
            </Pie>
            <ChartTooltip 
                cursor={false} 
                isAnimationActive={false}
                content={
                    <ChartTooltipContent 
                        className={isNight ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}
                        formatter={(value, name, props) => (
                            <div className={`flex items-center gap-2 ${isNight ? "text-slate-200" : "text-slate-700"}`}>
                                
                                {/* 1. TỰ TAY VẼ CỤC MÀU: Lấy đúng màu tím từ config */}
                                <div 
                                    className="h-2.5 w-2.5 shrink-0 rounded-[2px]" 
                                    style={{ backgroundColor: props.payload.fill || props.color }} 
                                />
                                
                                {/* 2. CHỮ VÀ SỐ: Gói vào một div có gap-1.5 để luôn có khoảng cách đẹp mắt */}
                                <div className="flex items-center gap-1.5">
                                    <span className="font-medium">{chartConfig[name]?.label || name}:</span>
                                    <span className="font-bold">{value}</span>
                                </div>
                                
                            </div>
                        )}
                    />
                }
            />
            <Legend />
        </PieChart>
    </ChartContainer>
  );
}