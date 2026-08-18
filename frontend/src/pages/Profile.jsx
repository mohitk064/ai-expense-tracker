import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

import ThemeToggle from "../components/ThemeToggle";
import {
  changePassword,
  getUserProfile,
} from "../services/UserService";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);
  const [showNewPassword, setShowNewPassword] =
    useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (error) {
        console.error(error);
        setProfileError("Unable to load profile");
        toast.error("Unable to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handlePasswordChange(event) {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields");
      return;
    }

    if (newPassword.length < 8) {
      toast.error(
        "New password must contain at least 8 characters"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setSubmitting(true);

      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      toast.success("Password changed successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to change password";

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  function formatDate(dateValue) {
    if (!dateValue) {
      return "Not provided";
    }

    const [year, month, day] = dateValue.split("-");

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 transition-colors dark:bg-gray-950">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />

          <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-300">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 transition-colors dark:bg-gray-950">
      <header className="border-b border-gray-200 bg-white transition-colors dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={17} />
            <span>Dashboard</span>
          </button>

          <ThemeToggle />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>

          <p className="mt-1 text-gray-500 dark:text-gray-400">
            View your account information and manage your password.
          </p>
        </section>

        {profileError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {profileError}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl bg-white p-5 shadow-sm transition-colors sm:p-6 dark:bg-gray-900 dark:shadow-black/20">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Account information
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your personal account details.
              </p>
            </div>

            {profile && (
              <div className="space-y-4">
                <ProfileRow
                  icon={<User size={19} />}
                  label="Full name"
                  value={profile.name || "Not provided"}
                />

                <ProfileRow
                  icon={<Mail size={19} />}
                  label="Email"
                  value={profile.email || "Not provided"}
                />

                <ProfileRow
                  icon={<Phone size={19} />}
                  label="Phone number"
                  value={profile.phoneNumber || "Not provided"}
                />

                <ProfileRow
                  icon={<CalendarDays size={19} />}
                  label="Date of birth"
                  value={formatDate(profile.dateOfBirth)}
                />
              </div>
            )}
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm transition-colors sm:p-6 dark:bg-gray-900 dark:shadow-black/20">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Change password
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Enter your current password before choosing a new one.
              </p>
            </div>

            <form
              onSubmit={handlePasswordChange}
              className="space-y-4"
            >
              <PasswordField
                label="Current password"
                value={currentPassword}
                onChange={setCurrentPassword}
                showPassword={showCurrentPassword}
                onToggle={() =>
                  setShowCurrentPassword(
                    (current) => !current
                  )
                }
              />

              <PasswordField
                label="New password"
                value={newPassword}
                onChange={setNewPassword}
                showPassword={showNewPassword}
                onToggle={() =>
                  setShowNewPassword(
                    (current) => !current
                  )
                }
              />

              <PasswordField
                label="Confirm new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                showPassword={showConfirmPassword}
                onToggle={() =>
                  setShowConfirmPassword(
                    (current) => !current
                  )
                }
              />

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LockKeyhole size={17} />

                {submitting
                  ? "Changing password..."
                  : "Change password"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

function ProfileRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
      <div className="mt-0.5 rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {label}
        </p>

        <p className="mt-1 break-words font-semibold text-gray-900 dark:text-gray-100">
          {value}
        </p>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  showPassword,
  onToggle,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          disabled={false}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-900"
          placeholder={`Enter ${label.toLowerCase()}`}
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-200"
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>
    </div>
  );
}

export default Profile;