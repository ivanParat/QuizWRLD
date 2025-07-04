"use client";

interface Props {
  message: string;
  onConfirm: () => void;
}

export default function SuccessOrErrorModal({
  message,
  onConfirm,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-off-white bg-opacity-40 flex items-center justify-center px-6 sm:px-0">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <p className="text-lg font-medium mb-4">
          {message}
        </p>
        <div className="flex justify-end">
          <button
            onClick={() => {
              onConfirm();
            }}
            className="px-4 py-2 rounded-md bg-brand text-white sm:hover:bg-brand-hover sm:active:bg-brand-hover disabled:opacity-60 font-medium drop-shadow-sm"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}
