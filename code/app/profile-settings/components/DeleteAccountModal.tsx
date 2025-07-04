import React, { useState } from "react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-off-white bg-opacity-40 flex items-center justify-center px-6 sm:px-0">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Delete Account</h2>
        <p className="mb-4">
          Are you sure you want to delete your account? This action cannot be
          undone.
        </p>
        <input
          type="password"
          placeholder="Confirm your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        />
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 rounded text-gray-600 sm:hover:text-gray-800 font-medium"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-incorrect sm:hover:bg-incorrect-hover text-white rounded-md font-medium drop-shadow-sm"
            onClick={() => onConfirm(password)}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
