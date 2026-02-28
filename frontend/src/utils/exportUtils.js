import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getImageUrl } from "./imageUtils";

// Helper to fetch an image and convert it to a base64 string
const fetchImageAsBase64 = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.warn("Failed to fetch image for export:", url, error);
        return null;
    }
};

export const exportToPDF = async (title, columns, data, fileName) => {
    const doc = jsPDF();

    doc.text(title, 14, 15);

    // Filter out columns that don't have an accessor (like Actions) 
    // And add a custom Photo column at the beginning if profileImage exists in any data
    const hasPhotos = data.some(row => row.profileImage);
    let tableColumns = columns
        .filter(col => col.header !== "Actions")
        .map(col => col.header);

    if (hasPhotos) {
        tableColumns = ["Photo", ...tableColumns];
    }

    // Pre-fetch all images
    const imageMap = {};
    if (hasPhotos) {
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const url = getImageUrl(row.profileImage);
            if (url) {
                const base64 = await fetchImageAsBase64(url);
                if (base64) {
                    imageMap[i] = base64; // Store base64 by row index
                }
            }
        }
    }

    const tableRows = data.map(row => {
        const rowData = columns
            .filter(col => col.header !== "Actions")
            .map(col => {
                const val = row[col.accessor];
                return val !== undefined ? val : "";
            });

        // Add empty string for Photo column placeholder
        if (hasPhotos) {
            return ["", ...rowData];
        }
        return rowData;
    });

    // Use autoTable function directly for better compatibility with Vite/Production
    autoTable(doc, {
        head: [tableColumns],
        body: tableRows,
        startY: 20,
        bodyStyles: { minCellHeight: hasPhotos ? 15 : null }, // Make rows taller for images
        columnStyles: hasPhotos ? { 0: { cellWidth: 20 } } : undefined, // Give photo column fixed width
        didDrawCell: function (data) {
            // Draw image in the first column if it's a body cell and we have an image
            if (hasPhotos && data.section === 'body' && data.column.index === 0) {
                const base64 = imageMap[data.row.index];
                if (base64) {
                    // Coordinates and dimensions
                    const x = data.cell.x + 2;
                    const y = data.cell.y + 2;
                    const dim = 11; // 11x11 square image

                    // Ensure image is png or jpeg
                    const format = base64.includes("image/png") ? "PNG" : "JPEG";

                    try {
                        doc.addImage(base64, format, x, y, dim, dim);
                    } catch (e) {
                        console.warn("Failed to add image to PDF", e);
                    }
                }
            }
        }
    });

    doc.save(`${fileName}.pdf`);
};

export const exportToExcel = async (data, fileName, columns) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    const hasPhotos = data.some(row => row.profileImage);

    // Define columns
    let excelColumns = columns
        .filter(col => col.header !== "Actions")
        .map(col => ({
            header: col.header,
            key: col.accessor,
            width: 25
        }));

    if (hasPhotos) {
        excelColumns = [
            { header: "Photo", key: "photo_placeholder", width: 15 },
            ...excelColumns
        ];
    }

    worksheet.columns = excelColumns;

    // Add data rows
    data.forEach(row => {
        const rowData = { ...row };
        if (hasPhotos) {
            rowData.photo_placeholder = ""; // Empty string, image goes here
        }
        worksheet.addRow(rowData);
    });

    // Handle images if any exist
    if (hasPhotos) {
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const rowIndex = i + 2; // +1 because array is 0-indexed, +1 because row 1 is headers

            // Set row height taller for images
            worksheet.getRow(rowIndex).height = 45;

            const url = getImageUrl(row.profileImage);
            if (url) {
                const base64 = await fetchImageAsBase64(url);
                if (base64) {
                    try {
                        const imageId = workbook.addImage({
                            base64: base64,
                            extension: base64.includes("image/png") ? 'png' : 'jpeg',
                        });

                        // Add image to worksheet at specific cell
                        // Col 0 = A, so tl is cell top-left
                        worksheet.addImage(imageId, {
                            tl: { col: 0.2, row: rowIndex - 1 + 0.2 }, // Slightly offset from top-left
                            ext: { width: 40, height: 40 }
                        });
                    } catch (e) {
                        console.warn("Failed to add image to Excel document", e);
                    }
                }
            }
        }
    }

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
