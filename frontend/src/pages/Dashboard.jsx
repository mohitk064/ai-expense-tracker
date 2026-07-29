import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  WalletCards,
  Pencil,
  Trash2,
  ReceiptText,
  TrendingUp,
  Sparkles,
} from "lucide-react";

import AddExpenseForm from "../components/AddExpenseForm";
import ThemeToggle from "../components/ThemeToggle";
import StatCard from "../components/StatCard";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

import {
  deleteExpense,
  getExpenses,
} from "../services/ExpenseService";

function Dashboard() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingExpense, setEditingExpense] =
    useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadExpenses() {
      try {
        const expenseData = await getExpenses();
        setExpenses(expenseData);
      } catch (error) {
        console.error(error);
        setError("Unable to load expenses");
      } finally {
        setLoading(false);
      }
    }

    loadExpenses();
  }, []);

  const totalExpenses = useMemo(() => {
    return expenses.reduce(
      (total, expense) =>
        total + Number(expense.amount),
      0
    );
  }, [expenses]);

  const averageExpense = useMemo(() => {
    if (expenses.length === 0) {
      return 0;
    }

    return totalExpenses / expenses.length;
  }, [totalExpenses, expenses.length]);

  function handleExpenseAdded(savedExpense) {
    setExpenses((currentExpenses) => [
      savedExpense,
      ...currentExpenses,
    ]);
  }

  function handleExpenseUpdated(updatedExpense) {
    setExpenses((currentExpenses) =>
      currentExpenses.map((expense) =>
        Number(expense.id) === Number(updatedExpense.id)
          ? updatedExpense
          : expense
      )
    );

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

      setExpenseToDelete(null);
    } catch (error) {
      console.error(error);
      setError("Unable to delete expense");
    } finally {
      setDeleting(false);
    }
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

  function handleLogout() {
    localStorage.removeItem("token");

    navigate("/login", {
      replace: true,
    });
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

  const filteredExpenses = expenses.filter((expense) =>
    expense.item.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              className="
    flex items-center gap-2
    rounded-lg border border-gray-300
    bg-white px-4 py-2
    text-sm font-semibold text-gray-700
    shadow-sm
    transition-all duration-200
    hover:bg-gray-100 hover:shadow
    focus:outline-none focus:ring-2 focus:ring-blue-500
    dark:border-gray-700
    dark:bg-gray-800
    dark:text-gray-200
    dark:hover:bg-gray-700
  "
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
            value={`₹${totalExpenses.toLocaleString("en-IN", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}`}
            description="Across all saved expenses"
            icon={<WalletCards size={22} />}
          />

          <StatCard
            title="Transactions"
            value={expenses.length}
            description={`${expenses.length} saved expense${expenses.length === 1 ? "" : "s"
              }`}
            icon={<ReceiptText size={22} />}
          />

          <StatCard
            title="Average expense"
            value={`₹${averageExpense.toLocaleString("en-IN", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}`}
            description="Average amount per transaction"
            icon={<TrendingUp size={22} />}
          />

          <StatCard
            title="AI status"
            value="Coming soon"
            description="Smart analysis is the next phase"
            icon={<Sparkles size={22} />}
          />
        </section>

        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm transition-colors dark:bg-gray-900 dark:shadow-black/20">
          <h3 className="mb-5 text-xl font-semibold text-gray-900 dark:text-white">
            {editingExpense
              ? "Update expense"
              : "Add expense"}
          </h3>

          <AddExpenseForm
            onExpenseAdded={handleExpenseAdded}
            onExpenseUpdated={handleExpenseUpdated}
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
              View and manage your saved expenses.
            </p>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="🔍 Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-900"
            />
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
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => (
                      <tr
                        key={expense.id}
                        className="transition hover:bg-gray-50 dark:hover:bg-gray-800/70"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                          {expense.item}
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                            {expense.category}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                          ₹
                          {Number(
                            expense.amount
                          ).toLocaleString("en-IN")}
                        </td>

                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                          {formatDate(expense.date)}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-3">
                            <button
                              type="button"
                              onClick={() => handleEdit(expense)}
                              className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-950/70"
                            >
                              <Pencil size={16} />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteRequest(expense)}
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
                        <div className="text-4xl">🔍</div>

                        <p className="mt-3 font-semibold text-gray-700 dark:text-gray-200">
                          No matching expenses
                        </p>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Try a different search.
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