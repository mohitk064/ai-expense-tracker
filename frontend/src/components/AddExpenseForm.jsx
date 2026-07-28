import { useEffect, useState } from "react";

import {
  addExpense,
  updateExpense,
} from "../services/ExpenseService";
import { ChevronDown } from "lucide-react";
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

function formatCategory(category) {
  return category
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function AddExpenseForm({
  onExpenseAdded,
  onExpenseUpdated,
  editingExpense,
  onCancelEdit,
}) {
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    if (editingExpense) {
      setItem(editingExpense.item);
      setAmount(editingExpense.amount);
      setDate(editingExpense.date);
      setCategory(editingExpense.category || "");
    } else {
      clearForm();
    }
  }, [editingExpense]);

  function clearForm() {
    setItem("");
    setAmount("");
    setDate("");
    setCategory("");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const expenseRequest = {
      item,
      amount: Number(amount),
      date,
      category,
    };

    try {
      setSubmitting(true);

      if (editingExpense) {
        const updatedExpense = await updateExpense(
          editingExpense.id,
          expenseRequest
        );

        onExpenseUpdated(updatedExpense);
      } else {
        const savedExpense = await addExpense(
          expenseRequest
        );

        onExpenseAdded(savedExpense);
      }

      clearForm();
    } catch (error) {
      console.error("Expense operation failed:", error);

      setError(
        error.response?.data?.message ??
        "Unable to save expense"
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancel() {
    clearForm();
    onCancelEdit();
  }

  const inputClassName =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-900";

  const labelClassName =
    "mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label
            htmlFor="item"
            className={labelClassName}
          >
            Item
          </label>

          <input
            id="item"
            type="text"
            value={item}
            onChange={(event) =>
              setItem(event.target.value)
            }
            placeholder="Example: Dinner, Uber, Groceries"
            required
            className={inputClassName}
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="category"
            className={labelClassName}
          >
            Category
          </label>

          <div className="relative">
            <select
              id="category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              required
              className={`${inputClassName} appearance-none pr-12`}
            >
              <option value="">Select a category</option>

              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {formatCategory(category)}
                </option>
              ))}
            </select>

            <ChevronDown
              size={18}
              aria-hidden="true"
              className="
        pointer-events-none
        absolute right-5 top-1/2
        -translate-y-1/2
        text-gray-500
        dark:text-gray-400
      "
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="amount"
            className={labelClassName}
          >
            Amount
          </label>

          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(event) =>
              setAmount(event.target.value)
            }
            placeholder="0.00"
            min="0.01"
            step="0.01"
            required
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="date"
            className={labelClassName}
          >
            Date
          </label>

          <input
            id="date"
            type="date"
            value={date}
            onChange={(event) =>
              setDate(event.target.value)
            }
            required
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end md:col-span-2">
          {editingExpense && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-blue-300 dark:disabled:bg-blue-900"
          >
            {submitting
              ? "Saving..."
              : editingExpense
                ? "Update Expense"
                : "Add Expense"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default AddExpenseForm;