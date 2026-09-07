import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  FileImage,
  ScanLine,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";

import { analyzeReceipt } from "../services/ReceiptService";
import { addExpense } from "../services/ExpenseService";

const categories = [
  "FOOD",
  "TRAVEL",
  "SHOPPING",
  "BILLS",
  "ENTERTAINMENT",
  "HEALTH",
  "EDUCATION",
  "OTHER",
];

export default function ReceiptUpload() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    merchant: "",
    amount: "",
    date: "",
    category: "OTHER",
  });

  const imagePreview = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      toast.error("Receipt image must be smaller than 5 MB");
      return;
    }

    setFile(selectedFile);
    setAnalysis(null);

    setFormData({
      merchant: "",
      amount: "",
      date: "",
      category: "OTHER",
    });
  }

  async function handleAnalyze() {
    if (!file) {
      toast.error("Please select a receipt image");
      return;
    }

    try {
      setLoading(true);

      const result = await analyzeReceipt(file);

      setAnalysis(result);

      setFormData({
        merchant: result.merchant || "",
        amount: result.amount ?? "",
        date: result.date || "",
        category: result.category || "OTHER",
      });

      toast.success("Receipt analyzed successfully");
    } catch (error) {
      console.error("Receipt analysis failed:", error);

      toast.error(
        error.response?.data?.message ||
        "Unable to analyze receipt"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSaveExpense() {
    if (!formData.merchant.trim()) {
      toast.error("Merchant is required");
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    if (!formData.date) {
      toast.error("Date is required");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        item: formData.merchant.trim(),
        amount: Number(formData.amount),
        date: formData.date,
        category: formData.category,
      };

      await addExpense(payload);

      toast.success("Expense saved successfully");

      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to save expense:", error);

      toast.error(
        error.response?.data?.message ||
        "Unable to save expense"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">

        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600/15 p-3 text-blue-400">
              <ScanLine size={26} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Scan Receipt
              </h1>

              <p className="mt-1 text-slate-400">
                Upload a receipt and review the extracted expense details before saving.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

            <h2 className="text-lg font-semibold">
              Receipt image
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              PNG, JPG, or JPEG receipts work best.
            </p>

            <label className="mt-6 flex min-h-80 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/60 p-6 text-center transition hover:border-blue-500">

              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Receipt preview"
                  className="max-h-70 rounded-xl object-contain"
                />
              ) : (
                <>
                  <div className="rounded-full bg-blue-600/15 p-4 text-blue-400">
                    <Upload size={28} />
                  </div>

                  <p className="mt-4 font-medium">
                    Click to upload receipt
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Select an image from your device
                  </p>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {file && (
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-800 px-4 py-3">
                <FileImage
                  size={20}
                  className="text-blue-400"
                />

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {file.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!file || loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ScanLine size={19} />

              {loading
                ? "Analyzing receipt..."
                : "Analyze Receipt"}
            </button>
          </div>

          <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-xl sm:p-6">

            <div className="flex items-center gap-2">
              <CheckCircle2
                size={21}
                className={
                  analysis
                    ? "text-emerald-400"
                    : "text-slate-600"
                }
              />

              <h2 className="text-lg font-semibold">
                Review expense
              </h2>
            </div>

            {!analysis ? (
              <div className="flex min-h-105 items-center justify-center text-center">
                <div>
                  <ScanLine
                    size={42}
                    className="mx-auto text-slate-700"
                  />

                  <p className="mt-4 font-medium text-slate-400">
                    No receipt analyzed yet
                  </p>

                  <p className="mt-1 max-w-xs text-sm text-slate-600">
                    Upload and analyze a receipt to automatically fill the expense form.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 min-w-0 space-y-5">

                <Field
                  label="Merchant"
                  name="merchant"
                  value={formData.merchant}
                  onChange={handleChange}
                />

                <Field
                  label="Amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                />

                <Field
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                />

                <div className="min-w-0">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="box-border w-full min-w-0 max-w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-base text-white outline-none transition focus:border-blue-500"
                  >
                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                  <p className="text-sm text-amber-300">
                    Please review the extracted values before saving. OCR can occasionally misread receipt text.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveExpense}
                  disabled={saving}
                  className="w-full rounded-xl bg-emerald-600 py-3 font-semibold transition hover:bg-emerald-500 disabled:opacity-50"
                >
                  {saving
                    ? "Saving expense..."
                    : "Save Expense"}
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  step,
  value,
  onChange,
}) {
  const inputClassName =
    "box-border w-full min-w-0 max-w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-base text-white outline-none transition focus:border-blue-500";

  return (
    <div className="min-w-0">
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      {type === "date" ? (
        <div className="relative w-full min-w-0 max-w-full overflow-hidden">
          <input
            name={name}
            type="date"
            value={value}
            onChange={onChange}
            required
            className={`
    ${inputClassName}
    appearance-none
    pr-11
    [&::-webkit-calendar-picker-indicator]:opacity-0
  `}
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
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      ) : (
        <input
          name={name}
          type={type}
          step={step}
          value={value}
          onChange={onChange}
          className={inputClassName}
        />
      )}
    </div>
  );
}