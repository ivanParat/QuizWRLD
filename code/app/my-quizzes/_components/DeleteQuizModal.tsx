"use client";

import { useState } from "react";

interface Props {
  quizTitle: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  open: boolean;
}

export default function DeleteQuizModal({
  quizTitle,
  onConfirm,
  onCancel,
  open,
}: Props) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-off-white bg-opacity-40 flex items-center justify-center px-6 sm:px-0">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">
          Delete quiz &quot;{quizTitle}&quot;?
        </h2>
        <p className="text-gray-600 mb-6">This action cannot be undone.</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded text-gray-600 sm:hover:text-gray-800 font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              setLoading(true);
              await onConfirm();
              setLoading(false);
            }}
            className="px-4 py-2 rounded-md bg-incorrect text-white sm:hover:bg-incorrect-hover sm:active:bg-incorrect-hover disabled:opacity-60 font-medium drop-shaodw-sm"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
