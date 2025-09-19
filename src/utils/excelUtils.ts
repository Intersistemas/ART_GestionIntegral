import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { pick } from './utils';

//#region types
export type TableRow = Record<string, any>;
export type TableColumn = Partial<ExcelJS.Column>;
export type TableRowFormatter = (value: any) => any;
export type TableColumnFormatter = (column: TableColumn, rowValue?: any) => any;
export type AddTableOptions = {
  formatters?: {
    column?: Record<string, TableColumnFormatter>,
    row?: Record<string, TableRowFormatter>,
  }
};
export type Sheet = ExcelJS.Worksheet;
export type SheetOptions = Partial<ExcelJS.AddWorksheetOptions>;
export type SaveTableOptions = {
  format?: "xlsx" | "csv",
  sheet?: {
    name?: string,
    options?: SheetOptions,
  },
  table?: AddTableOptions,
}
//#endregion types
//#region defaults
export const defaultTableColumnFormatter: TableColumnFormatter = Object.freeze((column, rowValue) => {
  if (column.width == null)
    column.width = calcWidth((Array.isArray(column.header))
      ? column.header.reduce((p, c) => c.length > p.length ? c : p)
      : column.header ?? "");
  if (rowValue == null) return rowValue;
  let width = calcWidth(rowValue);
  if (column.width < width) column.width = width;
  return rowValue;
  function calcWidth(value: string) { return value.length + 3 };
});
export const defaultTableRowFormatter: TableRowFormatter = Object.freeze((value) => value);
export const defaultKey = Object.freeze("");
export const defaultTableColumnFormatters: Record<string, TableColumnFormatter> = Object.freeze({ [defaultKey]: defaultTableColumnFormatter });
export const defaultTableRowFormatters: Record<string, TableRowFormatter> = Object.freeze({ [defaultKey]: defaultTableRowFormatter });
export const defaultTableOptions: AddTableOptions = Object.freeze({
  formatters: Object.freeze({ column: defaultTableColumnFormatters, row: defaultTableRowFormatters })
});
//#endregion defaults

export function addTable(
  sheet: Sheet,
  columns: Record<string, TableColumn>,
  rows: TableRow[],
  options?: AddTableOptions,
) {
  options = { ...defaultTableOptions, ...options };
  const formatters = {
    column: { ...defaultTableColumnFormatters, ...options.formatters?.column },
    row: { ...defaultTableRowFormatters, ...options.formatters?.row },
  };

  const headers = Object.fromEntries(Object.entries(columns).map(([key, value]) => [key, { ...value }]));
  const lines = rows.map((row) => Object.fromEntries(Object.entries(pick(row, headers)).map(([key, value]) => {
    const columnFormatter = formatters.column[key] ?? formatters.column[defaultKey];
    const rowFormatter = formatters.row[key] ?? formatters.row[defaultKey];
    return [key, columnFormatter(headers[key], rowFormatter(value))];
  })));
  sheet.columns = Object.values(headers);

  // Estilos para encabezado
  sheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'A8D08D' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  sheet.addRows(lines);
}

export async function saveXlsx(workbook: ExcelJS.Workbook, fileName: string) {
  return await workbook.xlsx.writeBuffer().then((buffer) => saveAs(
    new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    fileName
  ));
}

export async function saveCsv(workbook: ExcelJS.Workbook, fileName: string) {
  return await workbook.csv.writeBuffer().then((buffer) => saveAs(
    new Blob([buffer], { type: 'application/text' }),
    fileName
  ));
}

export async function saveTable(
  columns: Record<string, TableColumn>,
  rows: TableRow[],
  fileName: string,
  options?: SaveTableOptions,
) {
  options ??= {};
  options.sheet ??= {};

  const workbook = new ExcelJS.Workbook();

  addTable(workbook.addWorksheet(options.sheet.name, options.sheet.options), columns, rows, options.table);

  switch (options.format ?? "xlsx") {
    case "xlsx": return await saveXlsx(workbook, fileName);
    case "csv": return await saveCsv(workbook, fileName);
  }
}