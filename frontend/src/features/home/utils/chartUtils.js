// Từ điển map môn học sang Tiếng Việt để hiển thị trên Legend/Tooltip nếu cần
export const SUBJECT_LABELS = {
    "MATHS": "Toán",
    "VIETNAMESE": "Tiếng Việt",
    "ENGLISH": "Tiếng Anh"
};


// Từ điển map activity_format sang Tiếng Việt
export const FORMAT_LABELS = {
    "MULTIPLE_CHOICE_QUESTIONS": "Trắc nghiệm",
    "OPEN_ENDED": "Tự luận"
};


// Từ điển map activity_type sang Tiếng Việt cho các bé dễ đọc
export const ACTIVITY_TYPE_LABELS = {
    "EXERCISE": "Làm bài tập",
    "REVIEW": "Ôn bài"
};




/**
 * Chuyển đổi giá trị filter UI thành chuỗi ngày tháng cho Payload
 * Trả về định dạng chuỗi: "ddmmyyyy"
 */
export const getStartDateFromFilter = (filterValue) => {
    const today = new Date();
    let daysToSubtract = 7; // Mặc định là tuần

    if (filterValue === "Theo ngày" || filterValue === 1) daysToSubtract = 1;
    if (filterValue === "Theo tuần" || filterValue === 7) daysToSubtract = 7;
    if (filterValue === "Theo tháng" || filterValue === 30) daysToSubtract = 30;
    if (filterValue === "60 ngày" || filterValue === 60) daysToSubtract = 60;
    if (filterValue === "90 ngày" || filterValue === 90) daysToSubtract = 90;

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - daysToSubtract);

    // Lấy ngày, tháng, năm
    const day = String(targetDate.getDate()).padStart(2, '0');
    const month = String(targetDate.getMonth() + 1).padStart(2, '0'); // Tháng trong JS bắt đầu từ 0
    const year = targetDate.getFullYear();

    // Trả về chuỗi ddmmyyyy
    return `${day}${month}${year}`; 
};

/**
 * Biến đổi dữ liệu mảng 3 chiều của API (Target: SCORE)
 * Fix: Luôn đảm bảo hiển thị đủ 3 môn học trên Radar Chart
 */
export const transformScoreData = (rawData) => {
    // 1. Khởi tạo mặc định 3 môn với điểm số 0%
    const defaultData = {
        "MATHS": { achieved: 0, max: 0, label: SUBJECT_LABELS["MATHS"], percentage: 0 },
        "VIETNAMESE": { achieved: 0, max: 0, label: SUBJECT_LABELS["VIETNAMESE"], percentage: 0 },
        "ENGLISH": { achieved: 0, max: 0, label: SUBJECT_LABELS["ENGLISH"], percentage: 0 }
    };

    // 2. Cập nhật dữ liệu thực tế từ API (nếu có)
    if (rawData && Array.isArray(rawData)) {
        rawData.forEach(item => {
            const achieved = parseFloat(item[0]) || 0;
            const max = parseFloat(item[1]) || 0;
            const subjectKey = item[2]; // "MATHS", "VIETNAMESE", "ENGLISH"

            // Nếu key tồn tại trong defaultData thì ghi đè kết quả
            if (defaultData[subjectKey]) {
                defaultData[subjectKey].achieved = achieved;
                defaultData[subjectKey].max = max;
                defaultData[subjectKey].percentage = max > 0 ? parseFloat(((achieved / max) * 100).toFixed(2)) : 0;
            }
        });
    }

    // 3. Trả về mảng theo đúng thứ tự cố định (Toán -> Văn -> Anh)
    return [
        defaultData["MATHS"],
        defaultData["VIETNAMESE"],
        defaultData["ENGLISH"]
    ];
};


/**
 * Biến đổi dữ liệu mảng 2 chiều (Target: COUNT_ITEM, COUNT_ACTIVITY)
 * Thường dùng cho Pie Chart, Bar Chart, Donut Chart
 */
export const transformCountData = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) return [];
    
    return rawData.map(item => {
        const count = parseInt(item[0], 10) || 0;
        const rawLabel = item[1]; // Cột tên môn học (VD: "MATHS")
        
        return {
            count: count,
            // Dò tìm tên tiếng Việt trong từ điển, nếu không có thì giữ nguyên nhãn gốc
            label: SUBJECT_LABELS[rawLabel] || rawLabel 
        };
    });
};



/**
 * Biến đổi dữ liệu mảng 2 chiều cho Heatmap (Biểu đồ 3)
 * VD API trả về: [[107, "2026-05-17"]]
 * Output cho UI: [{ date: "2026/05/17", count: 107 }]
 */
export const transformHeatmapData = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) return [];
    
    return rawData.map(item => {
        const count = parseInt(item[0], 10) || 0;
        const dateString = item[1] || "";
        
        return {
            // Chuyển format ngày từ YYYY-MM-DD sang YYYY/MM/DD theo yêu cầu của UI cũ
            date: dateString.replace(/-/g, '/'), 
            count: count
        };
    });
};



/**
 * Biến đổi dữ liệu mảng 2 chiều cho Biểu đồ Vành khuyên (Target: COUNT_ACTIVITY)
 * VD API trả về: [[9, false], [2, true]]
 * Output cho UI: [{ count: 9, label: "Chưa nộp" }, { count: 2, label: "Đã nộp" }]
 */
export const transformCompletionData = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) return [];
    
    return rawData.map(item => {
        const count = parseInt(item[0], 10) || 0;
        const isSubmitted = item[1]; // true hoặc false
        
        return {
            count: count,
            label: isSubmitted === true ? "Đã nộp" : "Chưa nộp",
            // Gợi ý thêm mã màu để Recharts tự động nhận dạng:
            fill: isSubmitted === true ? "#4ade80" : "#f87171" // Xanh lá cho Đã nộp, Đỏ/Hồng cho Chưa nộp
        };
    });
};




/**
 * Biến đổi dữ liệu mảng 2 chiều cho Biểu đồ Cột (Biểu đồ 5)
 * VD API trả về: [[2, "OPEN_ENDED"], [5, "MULTIPLE_CHOICE_QUESTIONS"]]
 * Output cho UI: [{ count: 2, label: "Tự luận" }, { count: 5, label: "Trắc nghiệm" }]
 */
export const transformFormatData = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) return [];
    
    return rawData.map(item => {
        const count = parseInt(item[0], 10) || 0;
        const formatKey = item[1]; 
        
        return {
            count: count,
            // Dò tìm trong từ điển, nếu không có thì trả về formatKey gốc để tránh lỗi hiển thị trống
            label: FORMAT_LABELS[formatKey] || formatKey 
        };
    });
};



/**
 * Biến đổi dữ liệu mảng 4 chiều cho Biểu đồ Đường nhiều biến (Biểu đồ 6)
 * VD API trả về: 
 * [
 * [10, 100, "2026-05-17", "MATHS"],
 * [0, 100, "2026-05-17", "VIETNAMESE"]
 * ]
 * * Output cho UI: [{ date: "2026-05-17", MATHS: 10, VIETNAMESE: 0 }]
 */
export const transformScoreTrendData = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) return [];

    const dateMap = {};

    rawData.forEach(item => {
        const achieved = parseFloat(item[0]) || 0;
        const max = parseFloat(item[1]) || 0;
        const date = item[2];     // "2026-05-17"
        const subject = item[3];  // "MATHS", "VIETNAMESE"...

        // Tính toán phần trăm tương tự như Biểu đồ 1
        const percentage = max > 0 ? parseFloat(((achieved / max) * 100).toFixed(2)) : 0;

        // Nếu ngày này chưa có trong map thì khởi tạo
        if (!dateMap[date]) {
            dateMap[date] = { date: date };
        }

        // Gán giá trị phần trăm của môn học vào ngày đó
        dateMap[date][subject] = percentage;
    });

    // Chuyển đổi cấu trúc object thành mảng 
    const trendArray = Object.values(dateMap);

    // Sắp xếp các ngày theo thứ tự thời gian tăng dần để đường biểu đồ không bị rối mớ bòng bong
    return trendArray.sort((a, b) => new Date(a.date) - new Date(b.date));
};





/**
 * Biến đổi dữ liệu mảng 2 chiều cho Biểu đồ Thanh ngang (Biểu đồ 7)
 * VD API trả về: [[5, "REVIEW"], [6, "EXERCISE"]]
 * Output cho UI: [{ count: 5, label: "Ôn bài" }, { count: 6, label: "Làm bài tập" }]
 */
export const transformActivityTypeData = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) return [];
    
    return rawData.map(item => {
        const count = parseInt(item[0], 10) || 0;
        const typeKey = item[1]; 
        
        return {
            count: count,
            label: ACTIVITY_TYPE_LABELS[typeKey] || typeKey 
        };
    });
};