import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportToPDF = (title, columns, data, fileName) => {
    const doc = jsPDF();

    doc.text(title, 14, 15);

    // Filter out columns that don't have an accessor (like Actions) 
    const tableColumn = columns
        .filter(col => col.header !== "Actions")
        .map(col => col.header);

    const tableRows = data.map(row => {
        return columns
            .filter(col => col.header !== "Actions")
            .map(col => {
                const val = row[col.accessor];
                return val !== undefined ? val : "";
            });
    });

    // Use autoTable function directly for better compatibility with Vite/Production
    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
    });

    doc.save(`${fileName}.pdf`);
};

export const exportToExcel = async (data, fileName, columns) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    // Define columns
    const excelColumns = columns
        .filter(col => col.header !== "Actions")
        .map(col => ({
            header: col.header,
            key: col.accessor,
            width: 25
        }));

    worksheet.columns = excelColumns;

    // Add data
    worksheet.addRows(data);

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0D7377' } // Primary color #0D7377
        };
        cell.font = {
            color: { argb: 'FFFFFFFF' }, // White text
            bold: true,
            size: 12
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Write to buffer and save
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${fileName}.xlsx`);
};
