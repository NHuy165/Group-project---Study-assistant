// features/home/hooks/useChartData.js
import { useState, useEffect } from "react";
import { fetchChart4Data } from "../api/studyProgressAPI";

export const useChartData = (target, groupBy, filters = {}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const transformChartData = (rawData, target) => {
    if (!rawData || !Array.isArray(rawData)) return [];

    if (target === "count") {
        // Dữ liệu có 2 cột: [[count, groupBy]]
        return rawData.map(item => ({
        count: item[0],
        label: item[1] // Dùng 'label' chung chung để tái sử dụng cho môn học hoặc thời gian
        }));
    }

    if (target === "score") {
        // Dữ liệu có 3 cột: [[achieved, max, groupBy]]
        return rawData.map(item => ({
        achieved: item[0],
        max: item[1],
        label: item[2],
        percentage: item[1] > 0 ? parseFloat(((item[0] / item[1]) * 100).toFixed(2)) : 0
        }));
    }

    return [];
    };


    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                let rawData = [];
                if (target === "count") rawData = [[145, "MATHS"], [112, "LITERATURE"], [89, "ENGLISH"]];
                if (target === "score") rawData = [[512, 1000, "MATHS"], [345, 800, "LITERATURE"], [400, 500, "ENGLISH"]];

                const transformedData = transformChartData(rawData, target);
                setData(transformedData);
            } catch (error) {
                console.error("Error fetching chart data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [target, groupBy, JSON.stringify(filters)]);

    return {
        data,
        isLoading
    }
};