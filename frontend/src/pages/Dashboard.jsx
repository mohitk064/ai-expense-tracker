import { useEffect, useState } from "react";
import AddExpenseForm from "../components/AddExpenseForm";
import {
  deleteExpense,
  getExpenses,
} from "../services/ExpenseService";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadExpenses() {
      try {
        const expenseData = await getExpenses();
        setExpenses(expenseData);
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
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

  async function handleDelete(id) {
  console.log("Deleting expense:", id);

  try {
    await deleteExpense(id);

    setExpenses((currentExpenses) =>
      currentExpenses.filter(
        (expense) => Number(expense.id) !== Number(id)
      )
    );

    console.log("Delete successful");
  } catch (error) {
    console.error("Delete failed:", error);
    setError("Unable to delete expense");
  }
}

  if (loading) {
    return <p>Loading expenses...</p>;
  }

  return (
    <div>
      <h1>Expense Dashboard</h1>

      <AddExpenseForm
        onExpenseAdded={handleExpenseAdded}
      />

      <hr />

      <h2>Your Expenses</h2>

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