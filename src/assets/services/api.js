// File: src/services/api.js

/**
 * Hàm dùng chung để fetch và parse dữ liệu từ Google Sheets (CSV)
 */
export async function fetchCsvData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.text();
        
        // Bỏ dòng header đầu tiên và tách cột
        const rows = data.split('\n').slice(1);
        return rows.map(row => {
            // Regex xử lý việc tách cột CSV chuẩn xác kể cả khi có dấu phẩy trong chuỗi
            const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
            return cols;
        }).filter(cols => cols.length >= 2); // Chỉ lấy những dòng hợp lệ
    } catch (error) {
        console.error("Lỗi fetch dữ liệu:", error);
        return [];
    }
}