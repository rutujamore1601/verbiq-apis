const ExcelJS = require("exceljs");

const processExcel = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  const columnHeaders = [];

  const worksheet = await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet(1);

  sheet.getRow(1).eachCell({ includeEmpty: true }, (cell, colNumber) => {
    columnHeaders[colNumber] = toCamelCase(cell.value);
  });

  const data = [];
  for (let i = 2; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);
    const rowData = {};

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const columnHeader = columnHeaders[colNumber];
      rowData[columnHeader] = cell.value;
    });

    data.push(rowData);
  }

  return data;
};

const toCamelCase = (str) =>
  str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, "");

module.exports = {
  processExcel
};
