import { useState } from "react";
import ThemeToggler from "../ThemeToggler.jsx";

export default function SettingsSection({ user, setUser }) {
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");

  const updateEmail = async () => {
    await fetch(`http://localhost:5000/api/user/update-email/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  };

  const updatePassword = async () => {
    await fetch(`http://localhost:5000/api/user/update-password/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
  };

  const deleteAccount = async () => {
    await fetch(`http://localhost:5000/api/user/${user._id}`, {
      method: "DELETE",
    });

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Account Settings
      </h2>

      {/* THEME SECTION */}
      <section className="p-6 rounded-2xl border bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Appearance
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-4">
          Switch between light and dark mode.
        </p>

        <ThemeToggler />
      </section>

      {/* EMAIL UPDATE */}
      <section className="p-6 rounded-2xl border bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Change Email
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-4">
          Update the email address associated with your account.
        </p>

        <input
          className="border dark:border-gray-600 bg-transparent p-3 rounded-xl w-full text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          readOnly
        />

        <button
          onClick={updateEmail}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow transition"
        >
          Save Email
        </button>
      </section>

      {/* PASSWORD UPDATE */}
      <section className="p-6 rounded-2xl border bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Change Password
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-4">
          Choose a new secure password.
        </p>

        <input
          type="password"
          className="border dark:border-gray-600 bg-transparent p-3 rounded-xl w-full text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={updatePassword}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow transition"
        >
          Update Password
        </button>
      </section>

      {/* DELETE ACCOUNT */}
      <section className="p-6 rounded-2xl border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700 shadow-sm">
        <h3 className="text-xl font-semibold text-red-700 dark:text-red-400">
          Danger Zone
        </h3>
        <p className="text-red-500 dark:text-red-300 text-sm mt-1 mb-4">
          Permanently delete your account and all associated data.
        </p>

        <button
          onClick={deleteAccount}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl shadow transition"
        >
          Delete Account
        </button>
      </section>
    </div>
  );
}
