import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../../components/Profile/ProfileCard";
import EnrolledCourses from "../../components/Profile/EnrolledCourses";
import CreatedDiscussions from "../../components/Profile/CreatedDiscussions";
import EnrolledGroups from "../../components/Profile/EnrolledGroups";
import SettingsSection from "../../components/Profile/SettingsSection";
import { useStoredContext } from "../../context/useStoredContext";
import { LogOut, UserCircle } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ProfilePage() {
  console.log("Rendering Profile Page");
  const userId = localStorage.getItem("userId");
  const { user, setUser, getUser } = useStoredContext();
  const [section, setSection] = useState("courses");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user?.profile || {});
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
  }, [getUser]);

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      const updatedUser = await res.json();

      setUser(updatedUser);
      setEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
    navigate("/login");
  };

  if (!user)
    return (
      <div className="p-6 text-center text-xl font-medium dark:text-gray-200">
        Loading profile...
      </div>
    );
  const avatarUrl = user?.profile?.avatarUrl;
  return (
    <div className="flex max-w-7xl mx-auto p-6 gap-8">
      {/* -------- LEFT PROFILE INFO PANEL -------- */}
      <aside className="w-72 bg-white dark:bg-gray-900 shadow-lg rounded-2xl border dark:border-gray-700 p-6 h-fit flex flex-col items-center text-center">
        {/* Profile Picture */}
        <div className="mb-4">
          {avatarUrl ? (
            <img
              src={user?.profile?.avatarUrl || "/default-avatar.png"}
              className="w-28 h-28 rounded-full object-cover shadow-md border dark:border-gray-600"
              alt="avatar"
            />
          ) : (
            <div className="w-28 h-28 rounded-full border-4 border-white dark:border-gray-800 shadow flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <UserCircle className="w-20 h-20 text-gray-500 dark:text-gray-400" />
            </div>
          )}
        </div>

        {/* Username */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {user.username}
        </h2>

        {/* Email */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
          {user.email}
        </p>

        {/* Bio */}
        {user?.profile?.bio && (
          <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 px-2">
            {user.profile.bio}
          </p>
        )}

        {/* Edit button */}
        <button
          onClick={() => setEditing(true)}
          className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-4 py-2 rounded-xl transition-all"
        >
          Edit Profile
        </button>

        {/* If editing → show ProfileCard inside left panel */}
        {editing && (
          <div className="mt-5 w-full">
            <ProfileCard
              user={user}
              editing={editing}
              form={form}
              setForm={setForm}
              onSave={handleUpdate}
              onEdit={() => setEditing(true)}
              onCancel={() => setEditing(false)}
            />
          </div>
        )}

        {/* Divider */}
        <div className="w-full h-px bg-gray-300 dark:bg-gray-700 my-6"></div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-medium px-4 py-2 rounded-xl shadow-md transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* -------- RIGHT SIDE CONTENT -------- */}
      <div className="flex-1">
        {/* -------- TOP MENU -------- */}
        <nav className="flex justify-center gap-6 mb-6 bg-white dark:bg-gray-900 p-4 shadow-md rounded-xl border dark:border-gray-700">
          {[
            { key: "courses", label: "Enrolled Courses" },
            { key: "groups", label: "Quiz Groups" },
            { key: "discussions", label: "Created Discussions" },
            { key: "settings", label: "Settings" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${
                  section === item.key
                    ? "bg-indigo-500 text-white shadow"
                    : "text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-gray-800"
                }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* -------- CONTENT SECTION -------- */}
        <main className="bg-white dark:bg-gray-900 dark:text-gray-200 p-6 shadow-md rounded-xl min-h-[400px] border dark:border-gray-700">
          {section === "courses" && (
            <EnrolledCourses courses={user.enrolledCourses} />
          )}

          {section === "groups" && (
            <EnrolledGroups groups={user.enrolledQuizGroups} />
          )}

          {section === "discussions" && <CreatedDiscussions userId={userId} />}

          {section === "settings" && (
            <SettingsSection user={user} setUser={setUser} />
          )}
        </main>
      </div>
    </div>
  );
}
