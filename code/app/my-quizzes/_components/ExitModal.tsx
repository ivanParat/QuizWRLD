"use client";

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ExitModal({
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-off-white bg-opacity-40 flex items-center justify-center px-6 sm:px-0">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-medium mb-4">
          Are you sure you want to exit without saving?
        </h2>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-500 text-white sm:hover:bg-gray-400 sm:active:bg-gray-400 disabled:opacity-60 font-medium drop-shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-incorrect text-white sm:hover:bg-incorrect-hover sm:active:bg-incorrect-hover disabled:opacity-60 font-medium drop-shadow-sm"
          >
            Yes, Exit
          </button>
        </div>
      </div>
    </div>
  );
}
