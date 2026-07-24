import { useEffect, useState } from "react";
import AddExpenseForm from "../components/AddExpenseForm";

import {
  getExpenses,
  deleteExpense,
} from "../services/ExpenseService";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);

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

  async function handleDelete(id) {
    try {
      await deleteExpense(id);

      setExpenses((currentExpenses) =>
        currentExpenses.filter(
          (expense) =>
            Number(expense.id) !== Number(id)
        )
      );
    } catch (error) {
      console.error(error);
      setError("Unable to delete expense");
    }
  }

  function handleEdit(expense) {
    setEditingExpense(expense);
  }

  function handleCancelEdit() {
    setEditingExpense(null);
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Expense Dashboard</h1>

      <AddExpenseForm
        onExpenseAdded={handleExpenseAdded}
        onExpenseUpdated={handleExpenseUpdated}
        editingExpense={editingExpense}
        onCancelEdit={handleCancelEdit}
      />

      <hr />

      {error && <p>{error}</p>}

      {expenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Item</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.item}</td>
                <td>₹{expense.amount}</td>
                <td>{expense.date}</td>

                <td>
                  <button
                    onClick={() =>
                      handleEdit(expense)
                    }
                  >
                    Edit
                  </button>

                  {" "}

                  <button
                    onClick={() =>
                      handleDelete(expense.id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;