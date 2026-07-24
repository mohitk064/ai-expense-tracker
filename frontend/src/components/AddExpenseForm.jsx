import { useEffect, useState } from "react";

import {
  addExpense,
  updateExpense,
} from "../services/ExpenseService";

function AddExpenseForm({
  onExpenseAdded,
  onExpenseUpdated,
  editingExpense,
  onCancelEdit,
}) {

  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setItem(editingExpense.item);
      setAmount(editingExpense.amount);
      setDate(editingExpense.date);
    }
  }, [editingExpense]);

  function handleCancel() {
    setItem("");
    setAmount("");
    setDate("");
    setError("");
    onCancelEdit();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    const expenseRequest = {
      item,
      amount: Number(amount),
      date,
    };

    try {

      if (editingExpense) {

        const updatedExpense =
          await updateExpense(
            editingExpense.id,
            expenseRequest
          );

        onExpenseUpdated(updatedExpense);

      } else {

        const savedExpense =
          await addExpense(expenseRequest);

        onExpenseAdded(savedExpense);
      }

      setItem("");
      setAmount("");
      setDate("");

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ??
        "Unable to save expense"
      );

    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>

      <h2>
        {editingExpense
          ? "Update Expense"
          : "Add Expense"}
      </h2>

      <label>Item</label>

      <br />

      <input
        type="text"
        value={item}
        onChange={(event) =>
          setItem(event.target.value)
        }
      />

      <br />
      <br />

      <label>Amount</label>

      <br />

      <input
        type="number"
        value={amount}
        onChange={(event) =>
          setAmount(event.target.value)
        }
      />

      <br />
      <br />

      <label>Date</label>

      <br />

      <input
        type="date"
        value={date}
        onChange={(event) =>
          setDate(event.target.value)
        }
      />

      <br />
      <br />

      <button
        type="submit"
        disabled={submitting}
      >
        {submitting
          ? editingExpense
            ? "Updating..."
            : "Adding..."
          : editingExpense
            ? "Update Expense"
            : "Add Expense"}
      </button>

      {editingExpense && (
        <>
          {" "}

          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        </>
      )}

      {error && <p>{error}</p>}

    </form>
  );
}

export default AddExpenseForm;