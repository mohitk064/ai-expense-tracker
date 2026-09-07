import { useEffect, useState } from "react";
import { ChevronDown, Calendar } from "lucide-react";
import toast from "react-hot-toast";

import {
  addExpense,
  updateExpense,
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

function formatCategory(category) {
  return category
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
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
      item: item.trim(),
      amount: Number(amount),
      date,
      category,
    };

    try {
      setSubmitting(true);

      if (editingExpense) {
        const updatedExpense =
          await updateExpense(
            editingExpense.id,
            expenseRequest
          );

        onExpenseUpdated(updatedExpense);

        toast.success(
          "Expense updated successfully!"
        );
      } else {
        const savedExpense = await addExpense(
          expenseRequest
        );

        onExpenseAdded(savedExpense);

        toast.success(
          "Expense added successfully!"
        );
      }

      clearForm();
    } catch (error) {
      console.error(
        "Expense operation failed:",
        error
      );

      const message =
        error.response?.data?.message ??
        "Unable to save expense";

      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancel() {
    clearForm();
    onCancelEdit();
  }

  const inputClassName = `
  box-border
  w-full
  min-w-0
  max-w-full
  rounded-lg
  border
  border-gray-300
  bg-white
  px-3
  py-2.5
  text-base
  text-gray-900
  outline-none
  transition
  placeholder:text-gray-400
  focus:border-blue-500
  focus:ring-2
  focus:ring-blue-200
  sm:px-4
  sm:py-3
  dark:border-gray-700
  dark:bg-gray-800
  dark:text-white
  dark:placeholder:text-gray-500
  dark:focus:border-blue-400
  dark:focus:ring-blue-900
`;

  const labelClassName =
    "mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <form onSubmit={handleSubmit} className="min-w-0 w-full">
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
        {/* Item */}
        <div className="min-w-0 md:col-span-2">
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
            disabled={submitting}
            className={inputClassName}
          />
        </div>

        {/* Category */}
        <div className="min-w-0 md:col-span-2">
          <label
            htmlFor="category"
            className={labelClassName}
          >
            Category
          </label>

          <div className="relative min-w-0">
            <select
              id="category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              required
              disabled={submitting}
              className={`${inputClassName} appearance-none pr-12`}
            >
              <option value="">
                Select a category
              </option>

              {CATEGORIES.map(
                (categoryOption) => (
                  <option
                    key={categoryOption}
                    value={categoryOption}
                  >
                    {formatCategory(
                      categoryOption
                    )}
                  </option>
                )
              )}
            </select>

            <ChevronDown
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            />
          </div>
        </div>

        {/* Amount */}
        <div className="min-w-0">
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
            disabled={submitting}
            className={inputClassName}
          />
        </div>

        {/* Date */}
        <div className="min-w-0">
          <label
            htmlFor="date"
            className={labelClassName}
          >
            Date
          </label>

          <div className="relative w-full min-w-0 max-w-full overflow-hidden">
            <input
              id="date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              disabled={submitting}
              className={`${inputClassName} appearance-none pr-11`}
              style={{
                WebkitAppearance: "none",
                minWidth: 0,
                width: "100%",
                maxWidth: "100%",
              }}
            />

            <Calendar
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-1 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end md:col-span-2">
          {editingExpense && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="w-full rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:py-3 sm:text-base dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-blue-300 disabled:hover:translate-y-0 sm:w-auto sm:py-3 sm:text-base dark:disabled:bg-blue-900"
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