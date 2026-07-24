import { useState } from "react";
import { addExpense } from "../services/ExpenseService";

function AddExpenseForm({ onExpenseAdded }) {
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      const savedExpense = await addExpense(expenseRequest);

      onExpenseAdded(savedExpense);

      setItem("");
      setAmount("");
      setDate("");
    } catch (error) {
      console.error("Failed to add expense:", error);

      setError(
        error.response?.data?.message || "Unable to add expense"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Expense</h2>

      <div>
        <label htmlFor="item">Item</label>
        <br />

        <input
          id="item"
          type="text"
          value={item}
          onChange={(event) => setItem(event.target.value)}
          required
        />
      </div>

      <br />

      <div>
        <label htmlFor="amount">Amount</label>
        <br />

        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          min="0.01"
          step="0.01"
          required
        />
      </div>

      <br />

      <div>
        <label htmlFor="date">Date</label>
        <br />

        <input
          id="date"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          required
        />
      </div>

      <br />

      <button type="submit" disabled={submitting}>
        {submitting ? "Adding..." : "Add Expense"}
      </button>

      {error && <p>{error}</p>}
    </form>
  );
}

export default AddExpenseForm;