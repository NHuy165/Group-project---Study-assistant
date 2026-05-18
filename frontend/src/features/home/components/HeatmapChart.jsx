import React, { useState, useMemo } from 'react';
import HeatMap from '@uiw/react-heat-map';
import { useTheme } from '../../../components/theme/ThemeWrapper';

import { useHeatmapSize } from '../hooks/useHeatmapSize';


const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
                <p className="label">{`${label} : ${payload[0].value}`}</p>
                <p className="desc">Anything you want can be displayed here.</p>
            </div>
        )
    }
}

export const HeatmapChartComponent = ({data, isAnimationActive, daysToView}) => {
    const { isNight } = useTheme();

    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysToView);
    const { containerWidth, containerRef } = useHeatmapSize();

    const spaceBetween = 4;
    const { rectSize, exactWidth } = useMemo(
        () => {
            if (!containerWidth) return { rectSize: 12, exactWidth: '100%' };

            const weeks = Math.ceil(daysToView / 7);
            const labelWidthOffset = 30; // Chừa chỗ cho nhãn Sun, Mon...
            
            // 1. Tính kích thước tối đa mà CHIỀU RỘNG cho phép
            const paddingLeft = 24; 
            const availableWidth = containerWidth - paddingLeft;
            const maxSizeByWidth = Math.floor((availableWidth - labelWidthOffset - (weeks * spaceBetween)) / weeks);

            // 2. Tính kích thước tối đa mà CHIỀU CAO cho phép
            // Vì thẻ div tổng có class aspect-[3/2], chiều cao thực tế = chiều rộng * (2 / 3)
            const containerHeight = containerWidth * (2 / 3);
            // Trừ đi khoảng 60px không gian dành cho nhãn Tháng (phía trên) và Legend (phía dưới)
            const verticalPadding = 60; 
            const maxSizeByHeight = Math.floor((containerHeight - verticalPadding - (7 * spaceBetween)) / 7);

            // 3. Chốt kích thước (Khắc phục lỗi tràn):
            // Lấy giá trị NHỎ HƠN giữa rộng và cao. Không cho phép ô vuông nhỏ hơn 8px.
            const finalRectSize = Math.max(8, Math.min(maxSizeByWidth, maxSizeByHeight));

            // 4. Tính lại chiều rộng chính xác để Heatmap vẽ
            const finalWidth = labelWidthOffset + (weeks * finalRectSize) + (weeks * spaceBetween);

            return { rectSize: finalRectSize, exactWidth: finalWidth };
        }, [containerWidth, daysToView]
    )
 

    return (
        <div ref={containerRef} className="w-full aspect-[3/2]">
            <div className="pl-6">
                <HeatMap 
                    value={data} 
                    width={exactWidth}
                    rectSize={rectSize}
                    legendCellSize={rectSize}
                    startDate={startDate}
                    endDate={today}
                    panelColors={{
                        0: isNight ? '#8cc59c' : '#abddc7',
                        7: isNight ? '#58986e' : '#66c99c',
                        14: isNight ? '#3b7d51' : '#4fc892',
                        21: isNight ? '#258545' : '#39cd8b',
                        28: isNight ? '#149140' : '#1ec87b',
                        35: isNight ? '#008f32' : '#0bc873'
                    }}
                    style={{ color: isNight ? '#e2e8f0' : '#374151' }}
                />
            </div>
        </div>
    );
}
