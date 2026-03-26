async function truyXuatDatabaseRAG(cauHoiText){
    console.log("Truy xuất database RAG với câu hỏi: " + cauHoiText);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Giả lập độ trễ
    let ketQuaTuDB = "Đây là câu trả lời từ database RAG cho câu hỏi: " + cauHoiText;
    return ketQuaTuDB;
}

async function xuLyRAG(){
    var oNhap = document.getElementById('cau-hoi-rag');
    var oHienThi = document.getElementById('ket-qua-rag');

    var cauHoi = oNhap.value;

    if (cauHoi.trim() === "") {
        oHienThi.innerText = "Bé chưa nhập câu hỏi đâu!";
        oHienThi.style.color = "#ff4757";
        return;
    }

    oHienThi.innerText = "🦉 Cú Mèo đang lật sách tìm câu trả lời, bé đợi chút nhé...";
    oHienThi.style.color = "#1e90ff"; 

    var cauTraLoi = await truyXuatDatabaseRAG(cauHoi);

    oHienThi.innerText = cauTraLoi;
    oHienThi.style.color = "#2ed573"; 
}