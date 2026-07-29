import { AlertTriangle, Trash2, X } from "lucide-react";

function DeleteConfirmationModal({
  isOpen,
  expense,
  onConfirm,
  onCancel,
  deleting = false,
}) {
  if (!isOpen || !expense) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
            <AlertTriangle size={24} />
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            aria-label="Close delete confirmation"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-5">
          <h2
            id="delete-modal-title"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            Delete expense?
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              “{expense.item}”
            </span>
            ? This action cannot be undone.
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={17} />

            {deleting ? "Deleting..." : "Delete expense"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;