import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ThemeToggler from "./ThemeToggler";
import Button from "./ui/Button";
import { Menu, X, User } from "lucide-react";
// import Cookies from "js-cookie";
import { useStoredContext } from "../context/useStoredContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const { user } = useStoredContext();
  const navigate = useNavigate();

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/courses", label: "Courses" },
    { to: "/quiz", label: "Quizzes" },
    { to: "/discussions", label: "Discussions" },
  ];

  useEffect(() => {
    // ✅ Check JWT in cookies
    const token = localStorage.getItem("token");
    setAuthenticated(!!token);
  }, [user]);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <nav className="glass sticky top-0 z-50">
      <div className="section-container py-3 flex justify-between items-center">
        {/* ✅ Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="https://placehold.co/150x50/3b82f6/ffffff?text=YourLogo"
            alt="Logo"
            className="h-10 w-auto rounded"
          />
        </Link>

        {/* ✅ Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-slate-600 dark:text-slate-300 hover:text-brand-700 dark:hover:text-brand-600 transition font-medium ${
                  isActive
                    ? "text-brand-700 dark:text-brand-600 font-semibold"
                    : ""
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <ThemeToggler />

          {/* ✅ Auth Section */}
          {authenticated && user ? (
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              {user.profile?.avatarUrl ? (
                <img
                  src={user.profile.avatarUrl}
                  alt={user.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-brand-600 text-white flex items-center justify-center rounded-full font-semibold">
                  {user.profile?.fullName?.[0]?.toUpperCase() ||
                    user.username?.[0]?.toUpperCase() ||
                    "U"}
                </div>
              )}
              <span className="text-slate-700 dark:text-slate-200 font-medium">
                {user.profile?.fullName || user.username}
              </span>
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-600 dark:text-slate-300 font-medium hover:text-brand-700 transition"
              >
                Login
              </Link>
              <Link to="/register">
                <Button className="shadow-md">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* ✅ Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggler />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-slate-700 dark:text-slate-300 focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* ✅ Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-inner">
          <div className="flex flex-col space-y-3 px-6 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block text-slate-700 dark:text-slate-300 py-1 hover:text-brand-700 dark:hover:text-brand-600 transition ${
                    isActive
                      ? "text-brand-700 dark:text-brand-600 font-semibold"
                      : ""
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            {authenticated && user ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleProfileClick();
                }}
                className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-lg p-2"
              >
                <User className="w-5 h-5 text-brand-600" />
                <div className="text-left">
                  <div className="text-slate-700 dark:text-slate-200 font-medium">
                    {user.profile?.fullName || user.username}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-sm">
                    View Profile
                  </div>
                </div>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block text-slate-700 dark:text-slate-300 hover:text-brand-700 dark:hover:text-brand-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block bg-brand-600 text-white text-center py-2 rounded-lg hover:bg-brand-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
