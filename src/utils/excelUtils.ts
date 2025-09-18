import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { pick } from './utils';

//#region types
export type TableColumnFormatter = (key: string, column: Partial<ExcelJS.Column>, row?: any) => void;
export type TableRowFormatter = (value: any) => any;
export type TableRowFormatters = Record<string, TableRowFormatter>;
export type TableOptions = { columnFormatter?: TableColumnFormatter, rowFormatters?: TableRowFormatters }
//#endregion types
//#region defaults
export const defaultTableColumnFormatter: TableColumnFormatter = (key, column, row) => {
  if (column.width == null) {
    let columnText = (Array.isArray(column.header))
      ? column.header.reduce((p, h) => h.length > p.length ? h : p)
      : column.header ?? "";
    column.width = clacWidth(columnText);
  }
  if (row == null || row[key] == null) return;
  let width = clacWidth(row[key]);
  if (column.width < width) column.width = width;
  function clacWidth(value: string) { return value.length + 5 };
};
export const defaultTableRowFormatter: TableRowFormatter = (value) => value;
export const defaultTableRowFormatters: TableRowFormatters = Object.freeze({ "": defaultTableRowFormatter });
export const defaultTableOptions: TableOptions = Object.freeze({
  columnFormatter: defaultTableColumnFormatter,
  rowFormatters: defaultTableRowFormatters
});
//#endregion defaults

export function addTable(
  sheet: ExcelJS.Worksheet,
  columns: Record<string, Partial<ExcelJS.Column>>,
  rows: any[],
  options: TableOptions = defaultTableOptions,
) {
  let { columnFormatter = defaultTableColumnFormatter, rowFormatters } = options;
  rowFormatters = { ...defaultTableRowFormatters, ...rowFormatters };

  const headers = Object.fromEntries(Object.entries(columns).map(([key, v]) => {
    const column: Partial<ExcelJS.Column> = { ...v };
    columnFormatter(key, column);
    return [key, column]
  }));
  const lines = rows.map((row) => Object.fromEntries(Object.entries(pick(row, headers)).map(([key, value]) => {
    const rowFormatter = rowFormatters[key] ?? rowFormatters[""];
    const result = (rowFormatter)(value);
    columnFormatter(key, headers[key], result);
    return [key, result];
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