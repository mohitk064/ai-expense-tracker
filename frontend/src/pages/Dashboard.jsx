import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IndianRupee,
  LogOut,
  Pencil,
  ReceiptText,
  Trash2,
  TrendingUp,
  Trophy,
  WalletCards,
} from "lucide-react";
import toast from "react-hot-toast";

import AddExpenseForm from "../components/AddExpenseForm";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import MonthlyBarChart from "../components/charts/MonthlyBarChart";
import StatCard from "../components/StatCard";
import ThemeToggle from "../components/ThemeToggle";
import AIInsights from "../components/AIInsights";
import AIScoreCard from "../components/AIScoreCard";

import {
  deleteExpense,
  getExpenses,
} from "../services/ExpenseService";

const CATEGORIES = [
  "FOOD",
  "TRAVEL",
  "SHOPPING",
  "BILLS",
  "ENTERTAINMENT",
  "HEALTH",
  "EDUCATION",
  "OTHER",
];

const insightCardClassName = `
  rounded-xl
  bg-gray-50
  p-4
  transition-all
  duration-200
  hover:-translate-y-1
  hover:scale-[1.02]
  hover:bg-gray-100
  hover:shadow-lg
  dark:bg-gray-800
  dark:hover:bg-gray-700
`;

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

function formatCategory(category) {
  return category
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatCurrency(value) {
  return `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function parseExpenseDate(dateValue) {
  if (!dateValue) {
    return null;
  }

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function matchesDateRange(
  dateValue,
  selectedDateRange
) {
  if (selectedDateRange === "ALL") {
    return true;
  }

  const expenseDate = parseExpenseDate(dateValue);

  if (!expenseDate) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (selectedDateRange) {
    case "TODAY":
      return (
        expenseDate.getTime() === today.getTime()
      );

    case "LAST_7_DAYS": {
      const startDate = new Date(today);

      startDate.setDate(today.getDate() - 6);

      return (
        expenseDate >= startDate &&
        expenseDate <= today
      );
    }

    case "LAST_30_DAYS": {
      const startDate = new Date(today);

      startDate.setDate(today.getDate() - 29);

      return (
        expenseDate >= startDate &&
        expenseDate <= today
      );
    }

    case "THIS_MONTH":
      return (
        expenseDate.getFullYear() ===
        today.getFullYear() &&
        expenseDate.getMonth() === today.getMonth()
      );

    case "LAST_MONTH": {
      const lastMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      );

      return (
        expenseDate.getFullYear() ===
        lastMonth.getFullYear() &&
        expenseDate.getMonth() ===
        lastMonth.getMonth()
      );
    }

    case "THIS_YEAR":
      return (
        expenseDate.getFullYear() ===
        today.getFullYear()
      );

    default:
      return true;
  }
}

function Dashboard() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingExpense, setEditingExpense] =
    useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("ALL");
  const [selectedDateRange, setSelectedDateRange] =
    useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");

  const [expenseToDelete, setExpenseToDelete] =
    useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadExpenses() {
      try {
        const expenseData = await getExpenses();

        setExpenses(expenseData);
      } catch (error) {
        console.error(error);

        setError("Unable to load expenses");
        toast.error("Unable to load expenses");
      } finally {
        setLoading(false);
      }
    }

    loadExpenses();
  }, []);

  const filteredExpenses = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return expenses.filter((expense) => {
      const item =
        expense.item?.toLowerCase() ?? "";

      const rawCategory =
        expense.category || "OTHER";

      const category =
        formatCategory(rawCategory).toLowerCase();

      const amount = String(expense.amount ?? "");
      const date = String(expense.date ?? "");

      const matchesSearch =
        !search ||
        item.includes(search) ||
        category.includes(search) ||
        amount.includes(search) ||
        date.includes(search);

      const matchesCategory =
        selectedCategory === "ALL" ||
        rawCategory === selectedCategory;

      const matchesDate = matchesDateRange(
        expense.date,
        selectedDateRange
      );

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDate
      );
    });
  }, [
    expenses,
    searchTerm,
    selectedCategory,
    selectedDateRange,
  ]);

  const sortedExpenses = useMemo(() => {
    const sorted = [...filteredExpenses];

    switch (sortBy) {
      case "NEWEST":
        return sorted.sort((first, second) => {
          const firstDate =
            parseExpenseDate(first.date)?.getTime() ?? 0;

          const secondDate =
            parseExpenseDate(second.date)?.getTime() ?? 0;

          return secondDate - firstDate;
        });

      case "OLDEST":
        return sorted.sort((first, second) => {
          const firstDate =
            parseExpenseDate(first.date)?.getTime() ?? 0;

          const secondDate =
            parseExpenseDate(second.date)?.getTime() ?? 0;

          return firstDate - secondDate;
        });

      case "HIGHEST":
        return sorted.sort(
          (first, second) =>
            Number(second.amount) -
            Number(first.amount)
        );

      case "LOWEST":
        return sorted.sort(
          (first, second) =>
            Number(first.amount) -
            Number(second.amount)
        );

      case "AZ":
        return sorted.sort((first, second) =>
          String(first.item ?? "").localeCompare(
            String(second.item ?? ""),
            "en",
            {
              sensitivity: "base",
            }
          )
        );

      case "ZA":
        return sorted.sort((first, second) =>
          String(second.item ?? "").localeCompare(
            String(first.item ?? ""),
            "en",
            {
              sensitivity: "base",
            }
          )
        );

      default:
        return sorted;
    }
  }, [filteredExpenses, sortBy]);

  const totalExpenses = useMemo(() => {
    return filteredExpenses.reduce(
      (total, expense) =>
        total + Number(expense.amount),
      0
    );
  }, [filteredExpenses]);

  const averageExpense = useMemo(() => {
    if (filteredExpenses.length === 0) {
      return 0;
    }

    return (
      totalExpenses / filteredExpenses.length
    );
  }, [totalExpenses, filteredExpenses.length]);

  const highestExpense = useMemo(() => {
    if (filteredExpenses.length === 0) {
      return null;
    }

    return filteredExpenses.reduce(
      (highest, expense) =>
        Number(expense.amount) >
          Number(highest.amount)
          ? expense
          : highest
    );
  }, [filteredExpenses]);

  const topCategory = useMemo(() => {
    if (filteredExpenses.length === 0) {
      return null;
    }

    const categoryTotals =
      filteredExpenses.reduce(
        (totals, expense) => {
          const category =
            expense.category || "OTHER";

          totals[category] =
            (totals[category] || 0) +
            Number(expense.amount);

          return totals;
        },
        {}
      );

    return Object.entries(categoryTotals).reduce(
      (highest, current) =>
        current[1] > highest[1]
          ? current
          : highest
    );
  }, [filteredExpenses]);

  function handleExpenseAdded(savedExpense) {
    setExpenses((currentExpenses) => [
      savedExpense,
      ...currentExpenses,
    ]);
  }

  function handleExpenseUpdated(updatedExpense) {
    setExpenses((currentExpenses) =>
      currentExpenses.map((expense) =>
        Number(expense.id) ===
          Number(updatedExpense.id)
          ? updatedExpense
          : expense
      )
    );

    setEditingExpense(null);
  }

  function handleEdit(expense) {
    setEditingExpense(expense);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleCancelEdit() {
    setEditingExpense(null);
  }

  function handleDeleteRequest(expense) {
    setExpenseToDelete(expense);
  }

  function handleDeleteCancel() {
    if (deleting) {
      return;
    }

    setExpenseToDelete(null);
  }

  async function handleDeleteConfirm() {
    if (!expenseToDelete) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteExpense(expenseToDelete.id);

      setExpenses((currentExpenses) =>
        currentExpenses.filter(
          (expense) =>
            Number(expense.id) !==
            Number(expenseToDelete.id)
        )
      );

      if (
        Number(editingExpense?.id) ===
        Number(expenseToDelete.id)
      ) {
        setEditingExpense(null);
      }

      toast.success(
        `${expenseToDelete.item} deleted successfully`
      );

      setExpenseToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete expense");
    } finally {
      setDeleting(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");

    toast.success("Logged out successfully");

    navigate("/login", {
      replace: true,
    });
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 transition-colors dark:bg-gray-950">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />

          <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-300">
            Loading expenses...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 transition-colors dark:bg-gray-950">
      <header className="border-b border-gray-200 bg-white transition-colors dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <WalletCards size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                ExpenseAI
              </h1>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Track and understand your spending
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-100 hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <LogOut size={17} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Expense Dashboard
          </h2>

          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Manage your expenses and monitor your
            spending.
          </p>
        </section>

        <section className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total spent"
            numericValue={totalExpenses}
            prefix="₹"
            description="Based on active filters"
            icon={<WalletCards size={22} />}
          />

          <StatCard
            title="Transactions"
            numericValue={filteredExpenses.length}
            description={`${filteredExpenses.length} matching expense${filteredExpenses.length === 1 ? "" : "s"
              }`}
            icon={<ReceiptText size={22} />}
          />

          <StatCard
            title="Average expense"
            numericValue={averageExpense}
            prefix="₹"
            description="Average matching transaction"
            icon={<TrendingUp size={22} />}
          />

          <AIScoreCard expenses={filteredExpenses} />
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm transition-colors dark:bg-gray-900 dark:shadow-black/20 lg:col-span-2">
            <div className="mb-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Spending by category
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                See which categories account for most
                of your spending.
              </p>
            </div>

            <CategoryPieChart
              expenses={filteredExpenses}
            />
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm transition-colors dark:bg-gray-900 dark:shadow-black/20">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Quick insights
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              A snapshot of your filtered expenses.
            </p>

            <div className="mt-6 space-y-4">
              <div className={insightCardClassName}>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-yellow-100 p-2 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                    <Trophy size={20} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Top spending category
                    </p>

                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                      {topCategory
                        ? formatCategory(
                          topCategory[0]
                        )
                        : "No data"}
                    </p>

                    {topCategory && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(
                          topCategory[1]
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className={insightCardClassName}>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-green-100 p-2 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <IndianRupee size={20} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Highest expense
                    </p>

                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                      {highestExpense
                        ? highestExpense.item
                        : "No data"}
                    </p>

                    {highestExpense && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(
                          highestExpense.amount
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className={insightCardClassName}>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <TrendingUp size={20} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Average transaction
                    </p>

                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(
                        averageExpense
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className={insightCardClassName}>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                    <ReceiptText size={20} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total transactions
                    </p>

                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                      {filteredExpenses.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm transition-colors dark:bg-gray-900 dark:shadow-black/20">
          <div className="mb-5">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Monthly Spending Trend
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Track how your filtered expenses change
              month by month.
            </p>
          </div>

          <MonthlyBarChart
            expenses={filteredExpenses}
          />
        </section>

        <div className="mb-8">
          <AIInsights expenses={filteredExpenses} />
        </div>

        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm transition-colors dark:bg-gray-900 dark:shadow-black/20">
          <h3 className="mb-5 text-xl font-semibold text-gray-900 dark:text-white">
            {editingExpense
              ? "Update expense"
              : "Add expense"}
          </h3>

          <AddExpenseForm
            onExpenseAdded={handleExpenseAdded}
            onExpenseUpdated={
              handleExpenseUpdated
            }
            editingExpense={editingExpense}
            onCancelEdit={handleCancelEdit}
          />
        </section>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        <section className="overflow-hidden rounded-2xl bg-white shadow-sm transition-colors dark:bg-gray-900 dark:shadow-black/20">
          <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent expenses
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Search, filter, sort, and manage your
              saved expenses.
            </p>
          </div>

          <div className="grid gap-4 px-6 py-5 md:grid-cols-2 xl:grid-cols-[1fr_190px_190px_190px]">
            <input
              type="text"
              placeholder="Search by item, category, amount, or date..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-900"
            />

            <select
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-900"
            >
              <option value="ALL">
                All categories
              </option>

              {CATEGORIES.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {formatCategory(category)}
                </option>
              ))}
            </select>

            <select
              value={selectedDateRange}
              onChange={(event) =>
                setSelectedDateRange(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-900"
            >
              <option value="ALL">All time</option>
              <option value="TODAY">Today</option>
              <option value="LAST_7_DAYS">
                Last 7 days
              </option>
              <option value="LAST_30_DAYS">
                Last 30 days
              </option>
              <option value="THIS_MONTH">
                This month
              </option>
              <option value="LAST_MONTH">
                Last month
              </option>
              <option value="THIS_YEAR">
                This year
              </option>
            </select>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-900"
            >
              <option value="NEWEST">
                Newest first
              </option>
              <option value="OLDEST">
                Oldest first
              </option>
              <option value="HIGHEST">
                Highest amount
              </option>
              <option value="LOWEST">
                Lowest amount
              </option>
              <option value="AZ">Item A–Z</option>
              <option value="ZA">Item Z–A</option>
            </select>
          </div>

          {expenses.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="text-4xl">💰</div>

              <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-200">
                No expenses found
              </p>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Add your first expense using the form
                above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Item
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Category
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Amount
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Date
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {sortedExpenses.length > 0 ? (
                    sortedExpenses.map((expense) => (
                      <tr
                        key={expense.id}
                        className="transition hover:bg-gray-50 dark:hover:bg-gray-800/70"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                          {expense.item}
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                            {formatCategory(
                              expense.category ||
                              "OTHER"
                            )}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                          {formatCurrency(
                            expense.amount
                          )}
                        </td>

                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                          {formatDate(
                            expense.date
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(expense)
                              }
                              className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-950/70"
                            >
                              <Pencil size={16} />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteRequest(
                                  expense
                                )
                              }
                              className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/70"
                            >
                              <Trash2 size={16} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-10 text-center"
                      >
                        <div className="text-4xl">
                          🔍
                        </div>

                        <p className="mt-3 font-semibold text-gray-700 dark:text-gray-200">
                          No matching expenses
                        </p>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Try changing or clearing
                          your filters.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <DeleteConfirmationModal
        isOpen={Boolean(expenseToDelete)}
        expense={expenseToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        deleting={deleting}
      />
    </main>
  );
}

export default Dashboard;