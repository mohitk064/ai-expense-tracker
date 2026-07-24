import api from "../api/axiosConfig";

export async function getExpenses() {
  const response = await api.get("/api/expenses");
  return response.data.data;
}

export async function addExpense(expenseRequest) {
  const response = await api.post(
    "/api/expenses",
    expenseRequest
  );

  return response.data.data;
}

export async function updateExpense(id, expenseRequest) {
  const response = await api.put(
    `/api/expenses/${id}`,
    expenseRequest
  );

  return response.data.data;
}

export async function deleteExpense(id) {
  const response = await api.delete(
    `/api/expenses/${id}`
  );

  return response.data;
}