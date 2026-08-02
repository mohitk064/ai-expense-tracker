import { Brain } from "lucide-react";
import {
  getExpenseAnalytics,
  formatCategory,
} from "../utils/expenseAnalytics";

function AIScoreCard({ expenses = [] }) {
  const analytics = getExpenseAnalytics(expenses);

  const {
    averageExpense,
    transactionCount,
    categoryCount,
    topCategory,
    topCategoryPercentage,
  } = analytics;

  let score = 50;

  if (transactionCount >= 5) score += 10;
  if (transactionCount >= 10) score += 5;

  if (categoryCount >= 3) score += 10;
  if (categoryCount >= 5) score += 5;

  if (averageExpense <= 500) {
    score += 10;
  } else if (averageExpense >= 1500) {
    score -= 10;
  }

  score = Math.max(0, Math.min(100, score));

  let label = "Needs more data";
  let description =
    "Add at least three expenses to receive a more meaningful financial score.";

  if (transactionCount >= 3) {
    const formattedTopCategory = formatCategory(
      topCategory || "OTHER"
    );

    if (score >= 85) {
      label = "Excellent";
      description =
        topCategoryPercentage <= 40
          ? "Your spending is well distributed across categories. Keep tracking consistently."
          : `${formattedTopCategory} is your largest category at ${topCategoryPercentage.toFixed(
            1
          )}%, but your overall spending still looks well managed.`;
    } else if (score >= 70) {
      label = "Good";
      description = `${formattedTopCategory} accounts for ${topCategoryPercentage.toFixed(
        1
      )}% of your spending. Keep monitoring this category to maintain healthy spending habits.`;
    } else if (score >= 50) {
      label = "Fair";
      description = `${formattedTopCategory} makes up ${topCategoryPercentage.toFixed(
        1
      )}% of your spending. Review this category first for possible savings.`;
    } else {
      label = "Needs attention";
      description = `${formattedTopCategory} represents ${topCategoryPercentage.toFixed(
        1
      )}% of your total spending. Consider setting a monthly limit for this category.`;
    }
  }

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progressOffset =
    circumference - (score / 100) * circumference;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            AI Financial Score
          </p>

          <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
            {label}
          </p>

          <p className="mt-2 text-sm leading-5 text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>

        <div className="relative h-28 w-28 shrink-0">
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full -rotate-90"
          >
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              strokeWidth="9"
              className="stroke-gray-200 dark:stroke-gray-800"
            />

            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              className="stroke-blue-600 transition-all duration-1000 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Brain
              size={18}
              className="mb-1 text-blue-600 dark:text-blue-400"
            />

            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {score}
            </span>

            <span className="text-xs text-gray-500 dark:text-gray-400">
              /100
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIScoreCard;