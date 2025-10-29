// src/pages/Profile/ProfilePage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../../components/Profile/ProfileCard";
import EnrolledCourses from "../../components/Profile/EnrolledCourses";
import CreatedDiscussions from "../../components/Profile/CreatedDiscussions";
import { useStoredContext } from "../../context/useStoredContext";
import { LogOut } from "lucide-react";

export default function ProfilePage() {
  const userId = localStorage.getItem("userId");
  const { user, setUser, getUser } = useStoredContext();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user?.profile || {});
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/${userId}`, {
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
    setUser({});
    navigate("/");
  };

  if (!user) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="relative p-6 max-w-5xl mx-auto space-y-6">
      {/* --- LOGOUT BUTTON --- */}
      <div className="absolute right-6 top-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-xl shadow-md transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* --- PROFILE CARD --- */}
      <ProfileCard
        user={user}
        editing={editing}
        form={form}
        setForm={setForm}
        onSave={handleUpdate}
        onEdit={() => setEditing(true)}
        onCancel={() => setEditing(false)}
      />

      {/* --- ENROLLED COURSES --- */}
      <div className="mt-8">
        <EnrolledCourses courses={user.enrolledCourses} />
      </div>

      {/* --- CREATED DISCUSSIONS --- */}
      <div className="mt-8">
        <CreatedDiscussions userId={userId} />
      </div>
    </div>
  );
}
