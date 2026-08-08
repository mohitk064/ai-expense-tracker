import {
  Brain,
  Lightbulb,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import {
  formatCategory,
  getExpenseAnalytics,
} from "../utils/expenseAnalytics";

function formatCurrency(value) {
  return `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function AIInsights({ expenses = [] }) {
  if (expenses.length === 0) {
    return (
      <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-sm sm:p-6 dark:border-blue-900/50 dark:from-blue-950/30 dark:to-indigo-950/30">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white sm:h-11 sm:w-11">
            <Brain size={21} />
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-white">
              AI Insights
            </h3>

            <p className="mt-1 text-sm leading-5 text-gray-500 dark:text-gray-400">
              Add expenses to receive personalized insights.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const analytics = getExpenseAnalytics(expenses);

  const {
    averageExpense,
    highestExpense,
    topCategory,
    topCategoryPercentage,
    transactionCount,
  } = analytics;

  const formattedTopCategory = formatCategory(
    topCategory || "OTHER"
  );

  let recommendation =
    "Your spending looks fairly balanced.";

  if (topCategoryPercentage >= 50) {
    recommendation = `${formattedTopCategory} makes up ${topCategoryPercentage.toFixed(
      1
    )}% of your spending. Consider reviewing this category for possible savings.`;
  } else if (averageExpense >= 1000) {
    recommendation =
      "Your average transaction is relatively high. Reviewing your largest purchases may help reduce spending.";
  } else if (transactionCount >= 10) {
    recommendation =
      "You are tracking expenses consistently. Keep reviewing your monthly trends.";
  }

  const insights = [
    {
      icon: <TrendingUp size={18} />,
      title: "Top category",
      value: `${formattedTopCategory} · ${topCategoryPercentage.toFixed(
        1
      )}%`,
    },
    {
      icon: <Target size={18} />,
      title: "Highest expense",
      value: highestExpense
        ? `${highestExpense.item} · ${formatCurrency(
            highestExpense.amount
          )}`
        : "No data",
    },
    {
      icon: <Sparkles size={18} />,
      title: "Average transaction",
      value: formatCurrency(averageExpense),
    },
  ];

  return (
    <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-sm sm:p-6 dark:border-blue-900/50 dark:from-blue-950/30 dark:to-indigo-950/30">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm sm:h-11 sm:w-11">
          <Brain size={21} />
        </div>

        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-white">
            AI Insights
          </h3>

          <p className="mt-1 text-sm leading-5 text-gray-500 dark:text-gray-400">
            Smart observations based on the active filters.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:gap-4 md:grid-cols-3">
        {insights.map((insight) => (
          <div
            key={insight.title}
            className="min-w-0 rounded-xl border border-white/70 bg-white/80 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/70"
          >
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              {insight.icon}

              <p className="text-sm font-medium">
                {insight.title}
              </p>
            </div>

            <p className="mt-2 break-words text-sm font-semibold leading-6 text-gray-900 sm:text-base dark:text-white">
              {insight.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-xl bg-blue-600 px-4 py-4 text-white sm:mt-5">
        <Lightbulb
          size={20}
          className="mt-0.5 shrink-0"
        />

        <div className="min-w-0">
          <p className="text-sm font-semibold">
            Smart recommendation
          </p>

          <p className="mt-1 break-words text-sm leading-6 text-blue-100">
            {recommendation}
          </p>
        </div>
      </div>
    </section>
  );
}

export default AIInsights;