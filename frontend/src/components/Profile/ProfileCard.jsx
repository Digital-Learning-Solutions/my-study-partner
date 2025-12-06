import React, { useRef } from "react";
import { Camera, Edit3, Save, X, UserCircle } from "lucide-react";

export default function ProfileCard({
  user,
  editing,
  form,
  setForm,
  onSave,
  onEdit,
  onCancel,
}) {
  const fileInputRef = useRef(null);

  // Handle Avatar Upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, avatarUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const avatarUrl = form.avatarUrl || user?.profile?.avatarUrl;

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-md border dark:border-gray-700">
      {/* Avatar */}
      <div className="flex justify-center mb-4 relative">
        <div className="relative group w-28 h-28">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow"
            />
          ) : (
            <div className="w-28 h-28 rounded-full border-4 border-white dark:border-gray-800 shadow flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <Camera className="w-20 h-20 text-gray-500 dark:text-gray-400" />
            </div>
          )}

          {/* Upload overlay when editing */}
          {editing && (
            <>
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <Camera className="text-white w-6 h-6" />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
            </>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="text-center">
        {editing ? (
          <>
            <input
              type="text"
              value={form.fullName || ""}
              onChange={handleChange("fullName")}
              placeholder="Full Name"
              className="w-full text-center text-lg font-semibold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 outline-none dark:text-white"
            />

            <textarea
              value={form.bio || ""}
              onChange={handleChange("bio")}
              placeholder="Tell something about yourself..."
              className="mt-3 w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 text-sm outline-none text-gray-600 dark:text-gray-300"
              rows={2}
            />
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {user?.profile?.fullName || user?.username}
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {user?.profile?.bio || "No bio available."}
            </p>

            <p className="text-xs text-gray-400 mt-2">@{user?.username}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-5 flex justify-center">
        {editing ? (
          <div className="flex gap-3">
            <button
              onClick={onSave}
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow transition"
            >
              <Save className="w-4 h-4" /> Save
            </button>

            <button
              onClick={onCancel}
              className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-800 px-4 py-2 rounded-xl shadow transition hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={onEdit}
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow transition"
          >
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
