import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function MonthlyBarChart({ expenses = [] }) {
  const monthlyTotals = {};

  expenses.forEach((expense) => {
    if (!expense.date) {
      return;
    }

    // Prevent timezone issues with YYYY-MM-DD dates.
    const date = new Date(`${expense.date}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const year = date.getFullYear();
    const monthNumber = date.getMonth();

    // Unique key prevents Jun 2025 and Jun 2026 from merging.
    const monthKey = `${year}-${String(
      monthNumber + 1
    ).padStart(2, "0")}`;

    if (!monthlyTotals[monthKey]) {
      monthlyTotals[monthKey] = {
        month: date.toLocaleString("en-IN", {
          month: "short",
          year: "2-digit",
        }),
        total: 0,
        sortKey: new Date(year, monthNumber, 1).getTime(),
      };
    }

    monthlyTotals[monthKey].total += Number(
      expense.amount || 0
    );
  });

  const data = Object.values(monthlyTotals)
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ month, total }) => ({
      month,
      total,
    }));

  function formatCurrency(value) {
    return `₹${Number(value).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;
  }

  if (data.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center text-gray-500 dark:text-gray-400">
        No monthly data available
      </div>
    );
  }

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 40,
            right: 20,
            left: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid
            vertical={false}
            stroke="#334155"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="month"
            tick={{ fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tickFormatter={formatCurrency}
            tick={{ fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
            width={75}
          />

          <Tooltip
            cursor={{
              fill: "rgba(59, 130, 246, 0.08)",
            }}
            formatter={(value) => [
              formatCurrency(value),
              "Spent",
            ]}
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #374151",
              borderRadius: "12px",
              color: "#ffffff",
            }}
            labelStyle={{
              color: "#ffffff",
              fontWeight: 600,
            }}
            itemStyle={{
              color: "#93C5FD",
            }}
          />

          <Bar
            dataKey="total"
            name="Spent"
            fill="#3B82F6"
            radius={[10, 10, 0, 0]}
            animationDuration={1200}
            animationEasing="ease-out"
            maxBarSize={90}
          >
            <LabelList
              dataKey="total"
              position="top"
              formatter={formatCurrency}
              fill="#D1D5DB"
              fontSize={13}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyBarChart;