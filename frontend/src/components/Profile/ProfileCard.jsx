import React, { useRef } from "react";
import { Camera, Edit3, Save, X, UserCircle } from "lucide-react";
// import defaultAvatar from "../../assets/upload_area.png";

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

  // 🔹 Avatar change handler
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, avatarUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // 🔹 Unified input handler
  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const avatarUrl = form.avatarUrl || user?.profile?.avatarUrl;

  return (
    <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-xl">
      {/* Header background */}
      <div className="h-32 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

      {/* Content */}
      <div className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6 -mt-16 relative z-10">
        {/* Avatar or Icon */}
        <div className="relative group w-28 h-28">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile Avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-md"
            />
          ) : (
            <div className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-800 shadow-md flex items-center justify-center bg-slate-200 dark:bg-slate-700">
              <UserCircle
                className="text-slate-400 dark:text-slate-500 h-3/5"
                size={80}
              />
            </div>
          )}

          {/* Upload overlay (only visible in edit mode) */}
          {editing && (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
              />
            </>
          )}
        </div>

        {/* Profile details */}
        <div className="flex-1 w-full">
          {editing ? (
            <>
              <input
                type="text"
                value={form.fullName || ""}
                onChange={handleChange("fullName")}
                placeholder="Full Name"
                className="text-2xl font-semibold w-full border-b focus:outline-none focus:border-blue-500 bg-transparent dark:text-white dark:border-slate-600"
              />
              <textarea
                value={form.bio || ""}
                onChange={handleChange("bio")}
                placeholder="Write something about yourself..."
                className="mt-2 w-full border-b focus:outline-none focus:border-blue-500 bg-transparent text-slate-600 dark:text-slate-300 dark:border-slate-600"
                rows={2}
              />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {user?.profile?.fullName || user?.username}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                {user?.profile?.bio || "No bio added yet."}
              </p>
              <p className="text-sm text-slate-400 mt-2">
                @{user?.username} • {user?.email}
              </p>
            </>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-end gap-2 md:ml-auto">
          {editing ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onSave}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
              >
                <Save className="w-4 h-4" /> Save
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center gap-1 bg-gray-200 dark:bg-slate-700 text-slate-800 dark:text-white px-4 py-2 rounded-lg shadow transition hover:bg-gray-300 dark:hover:bg-slate-600"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
