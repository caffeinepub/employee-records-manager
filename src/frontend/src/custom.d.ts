// Type stubs for dynamically-imported export libraries
declare module "jspdf" {
  interface jsPDFOptions {
    orientation?: "portrait" | "landscape";
    unit?: string;
    format?: string | number[];
  }
  class jsPDF {
    constructor(options?: jsPDFOptions);
    setFont(fontName: string, fontStyle?: string): this;
    setFontSize(size: number): this;
    setTextColor(r: number, g?: number, b?: number): this;
    text(text: string, x: number, y: number): this;
    save(filename: string): void;
  }
  export default jsPDF;
}

declare module "jspdf-autotable" {
  import type jsPDF from "jspdf";
  interface AutoTableOptions {
    startY?: number;
    head?: (string | number)[][];
    body?: (string | number)[][];
    headStyles?: Record<string, unknown>;
    bodyStyles?: Record<string, unknown>;
    alternateRowStyles?: Record<string, unknown>;
    styles?: Record<string, unknown>;
    margin?: Record<string, number>;
  }
  function autoTable(doc: jsPDF, options: AutoTableOptions): void;
  export default autoTable;
}

declare module "xlsx" {
  namespace utils {
    function aoa_to_sheet(data: unknown[][]): WorkSheet;
    function book_new(): WorkBook;
    function book_append_sheet(wb: WorkBook, ws: WorkSheet, name: string): void;
  }
  function writeFile(wb: WorkBook, filename: string): void;
  interface WorkSheet {
    [key: string]: unknown;
    "!cols"?: { wch: number }[];
  }
  interface WorkBook {
    [key: string]: unknown;
  }
}

declare module "html2canvas" {
  interface Options {
    backgroundColor?: string | null;
    scale?: number;
    [key: string]: unknown;
  }
  function html2canvas(
    element: HTMLElement,
    options?: Options,
  ): Promise<HTMLCanvasElement>;
  export default html2canvas;
}
