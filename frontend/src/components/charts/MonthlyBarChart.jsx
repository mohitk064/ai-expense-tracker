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

    const date = new Date(
      `${expense.date}T00:00:00`
    );

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const year = date.getFullYear();
    const monthNumber = date.getMonth();

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
        sortKey: new Date(
          year,
          monthNumber,
          1
        ).getTime(),
      };
    }

    monthlyTotals[monthKey].total +=
      Number(expense.amount || 0);
  });

  const data = Object.values(monthlyTotals)
    .sort(
      (first, second) =>
        first.sortKey - second.sortKey
    )
    .map(({ month, total }) => ({
      month,
      total,
    }));

  function formatCurrency(value) {
    return `₹${Number(value).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 0,
      }
    )}`;
  }

  function formatYAxis(value) {
    const number = Number(value);

    if (number >= 100000) {
      return `₹${(
        number / 100000
      ).toFixed(1)}L`;
    }

    if (number >= 1000) {
      return `₹${(
        number / 1000
      ).toFixed(1)}K`;
    }

    return `₹${number}`;
  }

  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center sm:h-96">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          No monthly data available
        </p>
      </div>
    );
  }

  return (
    <div className="h-80 w-full sm:h-96">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={data}
          margin={{
            top: 35,
            right: 8,
            left: 0,
            bottom: 5,
          }}
          barCategoryGap="25%"
        >
          <CartesianGrid
            vertical={false}
            stroke="#334155"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="month"
            tick={{
              fill: "#9CA3AF",
              fontSize: 11,
            }}
            axisLine={false}
            tickLine={false}
            minTickGap={12}
          />

          <YAxis
            tickFormatter={formatYAxis}
            tick={{
              fill: "#9CA3AF",
              fontSize: 11,
            }}
            axisLine={false}
            tickLine={false}
            width={58}
          />

          <Tooltip
            cursor={{
              fill:
                "rgba(59, 130, 246, 0.08)",
            }}
            formatter={(value) => [
              formatCurrency(value),
              "Spent",
            ]}
            contentStyle={{
              backgroundColor: "#111827",
              border:
                "1px solid #374151",
              borderRadius: "12px",
              color: "#ffffff",
              fontSize: "13px",
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
            radius={[8, 8, 0, 0]}
            animationDuration={1200}
            animationEasing="ease-out"
            maxBarSize={72}
          >
            <LabelList
              dataKey="total"
              position="top"
              formatter={formatYAxis}
              fill="#D1D5DB"
              fontSize={11}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyBarChart;