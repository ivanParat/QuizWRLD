"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { authClient } from "../lib/auth-client";
import DeleteAccountModal from "./components/DeleteAccountModal";
import Image from "next/image";
import Cookies from "js-cookie";

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
  const [isProfilePictureReady, setIsProfilePictureReady] = useState(false);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetch("/api/auth/user/profile-image");
        const result = await response.json();

        if (response.ok && result.imageUrl) {
          setProfileImageUrl(result.imageUrl);
        }
        setIsProfilePictureReady(true);
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
      const userId = session?.user?.id;
      type RatingsCookie = {
        ratings: Record<string, number>;
      };
      const cookieRaw = Cookies.get("quizRatings");
      const cookieRatings: RatingsCookie | null = cookieRaw ? JSON.parse(cookieRaw) : null;
      if(userId && cookieRatings && Object.keys(cookieRatings.ratings).length > 0)
      await fetch("/api/ratings/toDb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId, ratings: cookieRatings.ratings }),
      });

      await authClient.signOut();

      setSuccess("Logged out successfully!");
      setError("");

      router.push("/login");
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
    <>
    <div className="max-w-lg mx-auto p-6 bg-background-form text-main-text rounded-xl shadow-md space-y-8">
      <div>
        <div className="flex justify-center w-full">
          {isProfilePictureReady ? (
            profileImageUrl ? (
              <div className="relative w-48 h-48 drop-shadow-md">
                <Image
                  src={profileImageUrl}
                  alt="Profile"
                  fill={true}
                  className="w-48 h-48 rounded-full object-cover mb-4"
                />
              </div>
            ) : (
              <div className="w-48 h-48 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
                <span className="text-gray-600">No profile picture</span>
              </div>
            )
          ) : (
            <div className="w-48 h-48 flex flex-col justify-center items-center">Loading...</div>
          )}
        </div>

        <div className="mb-4">
          <h3 className="block font-semibold text-lg">Profile Picture</h3>
          <label className="inline-flex items-center px-4 py-2 bg-brand text-white cursor-pointer hover:bg-brand-hover active:bg-brand-hover rounded-md font-semibold drop-shadow-sm mb-2 mt-2">
            Find Image
            <input
              type="file"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
          <div className="flex flex-col space-y-4 items-start md:space-y-0 md:flex-row md:space-x-3 mt-2">
            <button
              className="px-4 py-2 bg-brand hover:bg-brand-hover active:bg-brand-hover text-white rounded-md font-semibold drop-shadow-sm"
              onClick={handleUploadProfilePicture}
            >
              Upload the Image
            </button>
            <button
              className="px-4 py-2 bg-gray-500 hover:bg-gray-400 active:bg-gray-400 text-white rounded-md font-semibold drop-shadow-sm"
              onClick={handleRemoveProfilePicture}
            >
              Remove Profile Picture
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4">
          <label className="block font-semibold text-lg">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded-md bg-off-white drop-shadow-sm"
          />
        </div>
        <button
          className="mb-3 px-4 py-2 bg-brand hover:bg-brand-hover active:bg-brand-hover text-white rounded-md font-semibold drop-shadow-sm"
          onClick={handleUsernameChange}
        >
          Save Changes
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Password</h3>

        <div className="mb-4">
          <label className="block font-medium">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 border rounded-md bg-off-white drop-shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded-md bg-off-white drop-shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Confirm New Password</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full p-2 border rounded-md bg-off-white drop-shadow-sm"
          />
        </div>

        <button
          className="mb-4 px-4 py-2 bg-brand hover:bg-brand-hover active:bg-brand-hover text-white rounded-md font-semibold drop-shadow-sm"
          onClick={handlePasswordChange}
        >
          Save Changes
        </button>
      </div>

      <div className="flex space-x-3">
        <button
          className="px-4 py-2 bg-incorrect hover:bg-incorrect-hover active:bg-incorrect-hover text-white rounded-md font-semibold drop-shadow-sm"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          Delete Account
        </button>
        <button
          className="px-4 py-2 bg-gray-500 hover:bg-gray-400 active:bg-gray-400 text-white rounded-md font-semibold drop-shadow-sm"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
      {success && <p className="text-correct mt-4">{success}</p>}
      {error && <p className="text-incorrect mt-4">{error}</p>}
    </div>
    <DeleteAccountModal
      isOpen={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      onConfirm={handleDeleteAccount}
    />
    </>
  );
};

export default ProfileUpdateForm;
