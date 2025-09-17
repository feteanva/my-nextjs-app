"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserManagement from "@/components/UserManagement";

export default function SettingsPage() {
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "admin",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [domain, setDomain] = useState("");

  const [siteInfoSuccess, setSiteInfoSuccess] = useState("");
  const [siteInfoError, setSiteInfoError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);

        // Start all fetches in parallel
        const [userRes, siteInfoRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/settings/site-info"),
        ]);

        // Handle user
        if (!userRes.ok) throw new Error("Failed to fetch profile");
        const userData = await userRes.json();
        const siteInfoData = await siteInfoRes.json();
        setUser(userData.user);
        setDomain(siteInfoData.domain);
        if (userData.user.role !== "admin") {
          router.push("/dashboard");
          return;
        }
      } catch (err) {
        setError("Failed to load profile data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setUpdating(true);

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update profile");
      }

      setSuccess("Profile updated successfully");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while updating profile"
      );
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setUpdating(true);

    try {
      const response = await fetch("/api/auth/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to change password");
      }

      setPasswordSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setPasswordError(
        err instanceof Error
          ? err.message
          : "An error occurred while changing password"
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleSiteInfoChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSiteInfoError("");
    setSiteInfoSuccess("");
    setUpdating(true);

    try {
      const response = await fetch("/api/settings/site-info", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update site information");
      }

      setSiteInfoSuccess("Site information updated successfully");
    } catch (err: unknown) {
      setSiteInfoError(
        err instanceof Error
          ? err.message
          : "An error occurred while updating site information"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue"></div>
      </div>
    );
  }

  // If user is not an admin, don't render the settings page
  if (user.role !== "admin") {
    return null;
  }

  return (
    <div className="py-10">
      <div className="container max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="grid grid-cols-1 gap-8">
          {/* User Management Section */}
          <div className="md:col-span-2">
            <UserManagement />
          </div>

          {/* Website Information && Change Site logo */}
          <div className="md:col-span-2 space-y-5">
            {/* Website Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Website Information
              </h2>
              {siteInfoError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {siteInfoError}
                </div>
              )}
              {siteInfoSuccess && (
                <div className="mb-4 p-3 bg-indigo-100 text-indigo-700 rounded">
                  {siteInfoSuccess}
                </div>
              )}

              <form onSubmit={handleSiteInfoChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Website Domain
                  </label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue focus:border-blue"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full bg-indigo-500 py-2 px-4 bg-theme-main border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-theme-main focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue"
                >
                  {updating ? "Updating..." : "Update Website Domain"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
