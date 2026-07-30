import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const CHART_COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#9333ea",
  "#0891b2",
  "#ea580c",
  "#64748b",
];

function formatCategory(category) {
  return category
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatCurrency(value) {
  return `₹${Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function CategoryPieChart({ expenses }) {
  const categoryTotals = expenses.reduce(
    (totals, expense) => {
      const category = expense.category || "OTHER";
      const amount = Number(expense.amount) || 0;

      totals[category] =
        (totals[category] || 0) + amount;

      return totals;
    },
    {}
  );

  const chartData = Object.entries(categoryTotals)
    .map(([category, total]) => ({
      name: formatCategory(category),
      value: total,
    }))
    .sort((first, second) => second.value - first.value);

  const totalAmount = chartData.reduce(
    (total, category) => total + category.value,
    0
  );

  if (chartData.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Add expenses to see category analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            innerRadius={70}
            outerRadius={115}
            paddingAngle={3}
            isAnimationActive
            animationDuration={1000}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={
                  CHART_COLORS[
                    index % CHART_COLORS.length
                  ]
                }
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value, name) => {
              const percentage =
                totalAmount > 0
                  ? (
                      (Number(value) / totalAmount) *
                      100
                    ).toFixed(1)
                  : 0;

              return [
                `${formatCurrency(value)} (${percentage}%)`,
                name,
              ];
            }}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #374151",
              backgroundColor: "#111827",
              color: "#ffffff",
            }}
          />

          <Legend
            verticalAlign="bottom"
            formatter={(value) => (
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="pointer-events-none absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(totalAmount)}
        </p>

        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Total
        </p>
      </div>
    </div>
  );
}

export default CategoryPieChart;