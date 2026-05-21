import { useState, useEffect } from 'react';

/**
 * Hook dùng chung để gọi API biểu đồ
 * @param {Function} apiFunction - Hàm gọi API (VD: fetchScoreRatioRadarChart)
 * @param {Array} payload - Mảng điều kiện lọc
 * @param {Function} transformFunction - Hàm biến đổi dữ liệu (VD: transformScoreData)
 */
export const useFetchChart = (apiFunction, payload, transformFunction) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Dùng biến cờ để tránh lỗi memory leak nếu component unmount trước khi API trả về
        let isMounted = true; 

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const rawData = await apiFunction(payload);
                
                if (isMounted) {
                    // Nếu có hàm transform thì chạy, không thì giữ nguyên rawData
                    const finalData = transformFunction ? transformFunction(rawData) : rawData;
                    setData(finalData);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Lỗi khi tải dữ liệu biểu đồ:", err);
                    setError(err.message || "Đã xảy ra lỗi");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        // Cleanup function
        return () => {
            isMounted = false;
        };
        
    // Chạy lại Effect này mỗi khi payload thực sự thay đổi
    }, [JSON.stringify(payload)]); 

    return { data, isLoading, error };
};