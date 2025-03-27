"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { authClient } from "../lib/auth-client";
import DeleteAccountModal from "./components/DeleteAccountModal";
import Image from "next/image";

const ProfileUpdateForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [username, setUsername] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetch("/api/auth/user/profile-image");
        const result = await response.json();

        if (response.ok && result.imageUrl) {
          setProfileImageUrl(result.imageUrl);
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    fetchProfileImage();
  }, []);

  const handleUsernameChange = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/user/update-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("Username updated successfully!");
        setError("");
      } else {
        setError(result.error || "Failed to update username");
        setSuccess("");
      }
    } catch (error) {
      console.error("Error updating username:", error);
      setError("An unexpected error occurred. Please try again.");
      setSuccess("");
    }
  };
  const handlePasswordChange = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/user/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmNewPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("Password updated successfully!");
        setError("");
      } else {
        setError(result.error || "Failed to update password");
        setSuccess("");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setError("An unexpected error occurred. Please try again.");
      setSuccess("");
    }
  };

  const handleUploadProfilePicture = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (!image) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("/api/auth/user/upload-profile-picture", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("Profile picture uploaded successfully!");
        setError("");
      } else {
        setError(result.error || "Failed to upload profile picture");
        setSuccess("");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setError("An unexpected error occurred. Please try again.");
      setSuccess("");
    }
  };

  const handleRemoveProfilePicture = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/user/remove-profile-picture", {
        method: "POST",
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("Profile picture removed successfully!");
        setError("");
      } else {
        setError(result.error || "Failed to remove profile picture");
        setSuccess("");
      }
    } catch (error) {
      console.error("Error removing profile picture:", error);
      setError("An unexpected error occurred. Please try again.");
      setSuccess("");
    }
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();

      setSuccess("Logged out successfully!");
      setError("");

      // Redirect to the login page or home page
      router.push("/login"); // Replace "/login" with your desired route
    } catch (error) {
      console.error("Error logging out:", error);
      setError("An unexpected error occurred. Please try again.");
      setSuccess("");
    }
  };

  const handleDeleteAccount = async (password: string) => {
    try {
      const response = await fetch("/api/auth/user/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("Account deleted successfully!");
        setError("");

        router.push("/");
      } else {
        setError(result.error || "Failed to delete account");
        setSuccess("");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("An unexpected error occurred. Please try again.");
      setSuccess("");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

      <label className="block font-medium">Profile Picture</label>
      {profileImageUrl ? (
        <Image
          src={profileImageUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center">
          <span className="text-gray-500">No Image</span>
        </div>
      )}
      <div className="mb-4">
        <label className="block font-medium">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        onClick={handleUsernameChange}
      >
        Save Changes
      </button>

      <div className="mb-4">
        <label className="block font-medium">Profile Picture</label>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full"
        />
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={handleUploadProfilePicture}
        >
          Upload Profile Picture
        </button>
        <button
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md"
          onClick={handleRemoveProfilePicture}
        >
          Remove Profile Picture
        </button>
      </div>

      <h3 className="text-xl font-bold mb-2">Change Password</h3>

      <div className="mb-4">
        <label className="block font-medium">Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium">Confirm New Password</label>
        <input
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <button
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md"
        onClick={handlePasswordChange}
      >
        Save Password Changes
      </button>

      <button
        className="mb-4 px-4 py-2 bg-red-500 text-white rounded-md"
        onClick={() => setIsDeleteModalOpen(true)}
      >
        Delete Account
      </button>
      <button
        className="px-4 py-2 bg-gray-500 text-white rounded-md"
        onClick={handleLogout}
      >
        Log Out
      </button>
      {success && <p className="text-green-500 mt-4">{success}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
};

export default ProfileUpdateForm;
