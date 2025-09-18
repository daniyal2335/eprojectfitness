// frontend/src/utils/exportUtils.js
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // PDF table support

// Export to CSV (browser download)
export const exportToCSV = (data, filename) => {
  if (!data || !data.length) {
    alert("No data available to export");
    return;
  }
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
};

// Export to PDF (browser download)
export const exportToPDF = (data, filename) => {
  if (!data || !data.length) {
    alert("No data available to export");
    return;
  }

  const doc = new jsPDF();
  const headers = Object.keys(data[0]);
  const rows = data.map((row) => headers.map((h) => row[h]));

  doc.autoTable({
    head: [headers],
    body: rows,
  });

  doc.save(`${filename}.pdf`);
};
