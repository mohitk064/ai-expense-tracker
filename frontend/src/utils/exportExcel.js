import * as XLSX from "xlsx";

function formatCategory(category) {
  return String(category || "OTHER")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const [year, month, day] = dateValue.split("-");

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function exportExpensesToExcel(
  expenses = [],
  analytics = {}
) {
  if (expenses.length === 0) {
    throw new Error("No expenses available to export");
  }

  const {
    totalSpent = 0,
    averageExpense = 0,
    transactionCount = expenses.length,
    topCategory = null,
    topCategoryAmount = 0,
  } = analytics;

  /*
   * Sheet 1: Summary
   */
  const summaryData = [
    ["ExpenseAI Expense Report"],
    [],
    ["Generated on", new Date().toLocaleString("en-IN")],
    ["Total spent", Number(totalSpent)],
    ["Transactions", Number(transactionCount)],
    ["Average expense", Number(averageExpense)],
    [
      "Top category",
      topCategory
        ? formatCategory(topCategory)
        : "No data",
    ],
    [
      "Top category amount",
      Number(topCategoryAmount),
    ],
  ];

  const summarySheet =
    XLSX.utils.aoa_to_sheet(summaryData);

  summarySheet["!cols"] = [
    { wch: 24 },
    { wch: 24 },
  ];

  /*
   * Apply number formats to summary currency cells.
   */
  ["B4", "B6", "B8"].forEach((cellReference) => {
    if (summarySheet[cellReference]) {
      summarySheet[cellReference].z =
        '₹#,##0.00';
    }
  });

  /*
   * Sheet 2: Expenses
   */
  const expenseRows = expenses.map((expense) => ({
    Item: expense.item || "",
    Category: formatCategory(expense.category),
    Amount: Number(expense.amount || 0),
    Date: formatDate(expense.date),
  }));

  const expenseSheet =
    XLSX.utils.json_to_sheet(expenseRows);

  expenseSheet["!cols"] = [
    { wch: 28 },
    { wch: 20 },
    { wch: 16 },
    { wch: 18 },
  ];

  /*
   * Add currency formatting to every amount cell.
   * Column C contains the Amount values.
   */
  for (
    let rowNumber = 2;
    rowNumber <= expenseRows.length + 1;
    rowNumber += 1
  ) {
    const cellReference = `C${rowNumber}`;

    if (expenseSheet[cellReference]) {
      expenseSheet[cellReference].z =
        '₹#,##0.00';
    }
  }

  /*
   * Enable filtering on the header row.
   */
  expenseSheet["!autofilter"] = {
    ref: `A1:D${expenseRows.length + 1}`,
  };

  /*
   * Create and export the workbook.
   */
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    summarySheet,
    "Summary"
  );

  XLSX.utils.book_append_sheet(
    workbook,
    expenseSheet,
    "Expenses"
  );

  const dateSuffix = new Date()
    .toISOString()
    .slice(0, 10);

  XLSX.writeFile(
    workbook,
    `expense-report-${dateSuffix}.xlsx`
  );
}