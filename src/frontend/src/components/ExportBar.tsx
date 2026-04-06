import { Button } from "@/components/ui/button";
import {
  FileSpreadsheet,
  FileText,
  FileType,
  Image as ImageIcon,
  Loader2,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { EmployeeRecord } from "../backend.d";

interface ExportBarProps {
  employees: EmployeeRecord[];
  selectedIds: Set<bigint>;
}

function getExportData(
  employees: EmployeeRecord[],
  selectedIds: Set<bigint>,
): EmployeeRecord[] {
  if (selectedIds.size === 0) return employees;
  return employees.filter((e) => selectedIds.has(e.id));
}

function formatEmployeeText(emp: EmployeeRecord): string {
  const lines = [`Employee Name: ${emp.name}`];
  if (emp.employeeId) lines.push(`Employee ID: ${emp.employeeId}`);
  if (emp.aadhaarNumber) lines.push(`Aadhaar Number: ${emp.aadhaarNumber}`);
  if (emp.uanNumber) lines.push(`UAN Number: ${emp.uanNumber}`);
  if (emp.bankAccountNumber)
    lines.push(`Bank Account: ${emp.bankAccountNumber}`);
  if (emp.ifscCode) lines.push(`IFSC Code: ${emp.ifscCode}`);
  if (emp.mobileNumber) lines.push(`Mobile: ${emp.mobileNumber}`);
  return lines.join("\n");
}

/** Load an external script once and cache the promise */
const scriptCache: Record<string, Promise<void> | undefined> = {};
function loadScript(src: string): Promise<void> {
  if (scriptCache[src]) return scriptCache[src];
  scriptCache[src] = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const el = document.createElement("script");
    el.src = src;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(el);
  });
  return scriptCache[src];
}

export function ExportBar({ employees, selectedIds }: ExportBarProps) {
  const [exporting, setExporting] = useState<string | null>(null);

  const totalCount = selectedIds.size || employees.length;
  const label =
    selectedIds.size > 0
      ? `${selectedIds.size} selected`
      : `All (${employees.length})`;

  const exportPDF = async () => {
    setExporting("pdf");
    try {
      const data = getExportData(employees, selectedIds);
      if (data.length === 0) {
        toast.error("No employees to export");
        return;
      }

      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
      );
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.3/jspdf.plugin.autotable.min.js",
      );

      // biome-ignore lint/suspicious/noExplicitAny: CDN global
      const { jsPDF } = (window as any).jspdf;
      const doc = new jsPDF({ orientation: "landscape" });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(30, 136, 229);
      doc.text("Employee Records", 14, 18);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Generated: ${new Date().toLocaleDateString()}  |  Total: ${data.length}`,
        14,
        26,
      );

      doc.autoTable({
        startY: 32,
        head: [
          [
            "Name",
            "Employee ID",
            "Aadhaar",
            "UAN",
            "Bank Account",
            "IFSC",
            "Mobile",
          ],
        ],
        body: data.map((e) => [
          e.name,
          e.employeeId || "-",
          e.aadhaarNumber || "-",
          e.uanNumber || "-",
          e.bankAccountNumber || "-",
          e.ifscCode || "-",
          e.mobileNumber || "-",
        ]),
        headStyles: {
          fillColor: [30, 136, 229],
          textColor: 255,
          fontStyle: "bold",
          fontSize: 10,
        },
        bodyStyles: { fontSize: 9 },
        alternateRowStyles: { fillColor: [243, 245, 247] },
        styles: { font: "helvetica" },
        margin: { left: 14, right: 14 },
      });

      doc.save(`employees_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success(`PDF exported (${data.length} records)`);
    } catch (_err) {
      toast.error("PDF export failed");
    } finally {
      setExporting(null);
    }
  };

  const exportExcel = async () => {
    setExporting("excel");
    try {
      const data = getExportData(employees, selectedIds);
      if (data.length === 0) {
        toast.error("No employees to export");
        return;
      }

      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",
      );

      // biome-ignore lint/suspicious/noExplicitAny: CDN global
      const XLSX = (window as any).XLSX;
      const wsData = [
        [
          "Employee Name",
          "Employee ID",
          "Aadhaar Number",
          "UAN Number",
          "Bank Account",
          "IFSC Code",
          "Mobile Number",
        ],
        ...data.map((e) => [
          e.name,
          e.employeeId || "",
          e.aadhaarNumber || "",
          e.uanNumber || "",
          e.bankAccountNumber || "",
          e.ifscCode || "",
          e.mobileNumber || "",
        ]),
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      ws["!cols"] = [
        { wch: 22 },
        { wch: 14 },
        { wch: 16 },
        { wch: 14 },
        { wch: 20 },
        { wch: 14 },
        { wch: 14 },
      ];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Employees");
      XLSX.writeFile(
        wb,
        `employees_${new Date().toISOString().slice(0, 10)}.xlsx`,
      );
      toast.success(`Excel exported (${data.length} records)`);
    } catch (_err) {
      toast.error("Excel export failed");
    } finally {
      setExporting(null);
    }
  };

  const exportImage = async () => {
    setExporting("image");
    try {
      const el = document.getElementById("employee-grid");
      if (!el) {
        toast.error("Could not capture grid");
        return;
      }
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
      );
      // biome-ignore lint/suspicious/noExplicitAny: CDN global
      const html2canvas = (window as any).html2canvas;
      const canvas = await html2canvas(el, {
        backgroundColor: "#F3F5F7",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `employees_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Image captured and downloaded");
    } catch (_err) {
      toast.error("Image export failed");
    } finally {
      setExporting(null);
    }
  };

  const exportText = () => {
    setExporting("text");
    try {
      const data = getExportData(employees, selectedIds);
      if (data.length === 0) {
        toast.error("No employees to export");
        return;
      }
      const lines = [
        "EMPLOYEE RECORDS",
        `Generated: ${new Date().toLocaleDateString()}`,
        `Total: ${data.length}`,
        "=".repeat(50),
        "",
        ...data.map(
          (e, i) =>
            `${i + 1}. ${formatEmployeeText(e)}\n${"\u2014".repeat(40)}`,
        ),
      ];
      const text = lines.join("\n");
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `employees_${new Date().toISOString().slice(0, 10)}.txt`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`Text exported (${data.length} records)`);
    } catch (_err) {
      toast.error("Text export failed");
    } finally {
      setExporting(null);
    }
  };

  const handleShare = async () => {
    const data = getExportData(employees, selectedIds);
    if (data.length === 0) {
      toast.error("No employees to share");
      return;
    }
    const separator = `\n\n${"\u2014".repeat(30)}\n\n`;
    const text = data.map(formatEmployeeText).join(separator);
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Employee Records",
          text,
        });
      } catch {
        // User cancelled — ignore
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    }
  };

  const btnClass =
    "h-9 px-3 bg-emp-export-bg border border-emp-border text-emp-text2 hover:bg-accent hover:text-emp-blue text-sm font-medium transition-colors";

  return (
    <div className="flex flex-wrap items-center gap-2" data-ocid="export.panel">
      <span className="text-xs text-emp-muted font-medium hidden sm:inline">
        {label}:
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={exportPDF}
        disabled={exporting !== null || totalCount === 0}
        className={btnClass}
        data-ocid="export.pdf.button"
      >
        {exporting === "pdf" ? (
          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
        ) : (
          <FileText className="w-3.5 h-3.5 mr-1.5 text-red-500" />
        )}
        PDF
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={exportExcel}
        disabled={exporting !== null || totalCount === 0}
        className={btnClass}
        data-ocid="export.excel.button"
      >
        {exporting === "excel" ? (
          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
        ) : (
          <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-green-600" />
        )}
        Excel
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={exportImage}
        disabled={exporting !== null || totalCount === 0}
        className={btnClass}
        data-ocid="export.image.button"
      >
        {exporting === "image" ? (
          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
        ) : (
          <ImageIcon className="w-3.5 h-3.5 mr-1.5 text-purple-500" />
        )}
        Image
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={exportText}
        disabled={exporting !== null || totalCount === 0}
        className={btnClass}
        data-ocid="export.text.button"
      >
        {exporting === "text" ? (
          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
        ) : (
          <FileType className="w-3.5 h-3.5 mr-1.5 text-emp-blue" />
        )}
        Text
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        disabled={totalCount === 0}
        className={`${btnClass} ml-1`}
        data-ocid="export.share.button"
      >
        <Share2 className="w-3.5 h-3.5 mr-1.5 text-emp-blue" />
        Share
      </Button>
    </div>
  );
}
