export function formatCategory(category) {
  return category
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

export function getExpenseAnalytics(
  expenses = []
) {
  if (expenses.length === 0) {
    return {
      totalSpent: 0,
      averageExpense: 0,
      highestExpense: null,
      topCategory: null,
      topCategoryAmount: 0,
      topCategoryPercentage: 0,
      transactionCount: 0,
      categoryCount: 0,
      categoryTotals: {},
    };
  }

  const totalSpent = expenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount || 0),
    0
  );

  const averageExpense =
    totalSpent / expenses.length;

  const highestExpense = expenses.reduce(
    (highest, expense) =>
      Number(expense.amount) >
      Number(highest.amount)
        ? expense
        : highest
  );

  const categoryTotals = expenses.reduce(
    (totals, expense) => {
      const category =
        expense.category || "OTHER";

      totals[category] =
        (totals[category] || 0) +
        Number(expense.amount || 0);

      return totals;
    },
    {}
  );

  const topCategoryEntry =
    Object.entries(categoryTotals).reduce(
      (highest, current) =>
        current[1] > highest[1]
          ? current
          : highest
    );

  const topCategory =
    topCategoryEntry[0];

  const topCategoryAmount =
    topCategoryEntry[1];

  const topCategoryPercentage =
    totalSpent > 0
      ? (topCategoryAmount / totalSpent) * 100
      : 0;

  return {
    totalSpent,
    averageExpense,
    highestExpense,
    topCategory,
    topCategoryAmount,
    topCategoryPercentage,
    transactionCount: expenses.length,
    categoryCount:
      Object.keys(categoryTotals).length,
    categoryTotals,
  };
}