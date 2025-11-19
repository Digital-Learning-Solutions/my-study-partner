import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ThemeToggler from "./ThemeToggler";
import Button from "./ui/Button";
import {
  X,
  LogOut,
  Settings,
  LayoutDashboard,
  Edit,
  CreditCard,
} from "lucide-react";
// import Cookies from "js-cookie";
import { useStoredContext } from "../context/useStoredContext";

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false); // desktop profile dropdown
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // mobile profile drawer
  const [authenticated, setAuthenticated] = useState(false);
  const { user, setUser } = useStoredContext();
  const navigate = useNavigate();

  // console.log("Navbar User:", user);
  // Separate refs for desktop and mobile to prevent conflicts
  const desktopBtnRef = useRef(null);
  const desktopMenuRef = useRef(null);
  const mobileBtnRef = useRef(null);
  const mobilePanelRef = useRef(null);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/courses", label: "Courses" },
    { to: "/quiz", label: "Quizzes" },
    { to: "/discussions", label: "Discussions" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthenticated(!!token);
  }, [user]);

  // Close DESKTOP profile dropdown on outside click / Esc
  useEffect(() => {
    const onClickOutside = (e) => {
      if (!profileOpen) return;
      if (
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(e.target) &&
        desktopBtnRef.current &&
        !desktopBtnRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [profileOpen]);

  // Close MOBILE sidebar on outside click / Esc, and lock scroll
  useEffect(() => {
    const onClickOutside = (e) => {
      if (!mobileSidebarOpen) return;
      if (
        mobilePanelRef.current &&
        !mobilePanelRef.current.contains(e.target) &&
        mobileBtnRef.current &&
        !mobileBtnRef.current.contains(e.target)
      ) {
        setMobileSidebarOpen(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === "Escape") setMobileSidebarOpen(false);
    };

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);

    // lock body scroll when sidebar is open
    if (mobileSidebarOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("mousedown", onClickOutside);
        document.removeEventListener("keydown", onEsc);
        document.body.style.overflow = prev;
      };
    }

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [mobileSidebarOpen]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setUser(null);
      setProfileOpen(false);
      setMobileSidebarOpen(false);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const avatar = user?.profile?.avatarUrl;
  const displayName = user?.profile?.fullName || user?.username || "User";
  const initial =
    user?.profile?.fullName?.[0]?.toUpperCase() ||
    user?.username?.[0]?.toUpperCase() ||
    "U";

  return (
    <nav className="glass sticky top-0 z-50">
      <div className="section-container py-3 flex justify-between items-center">
        {/* ✅ Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="https://placehold.co/150x50/3b82f6/ffffff?text=YourLogo"
            alt="LearniVerse"
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

          {/* ✅ Desktop: Profile Dropdown */}
          {authenticated && user ? (
            <div className="relative">
              <button
                ref={desktopBtnRef}
                type="button"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition focus:outline-none focus:ring-2 focus:ring-brand-600"
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt={displayName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-brand-600 text-white flex items-center justify-center rounded-full font-semibold">
                    {initial}
                  </div>
                )}
                <span className="text-slate-700 dark:text-slate-200 font-medium">
                  {displayName}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`h-4 w-4 transition-transform ${
                    profileOpen ? "rotate-180" : "rotate-0"
                  }`}
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Desktop Dropdown */}
              <div
                ref={desktopMenuRef}
                role="menu"
                aria-label="Profile options"
                className={`absolute right-0 mt-2 w-60 origin-top-right rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1 shadow-xl transition-all duration-150 ${
                  profileOpen
                    ? "pointer-events-auto scale-100 opacity-100"
                    : "pointer-events-none scale-95 opacity-0"
                }`}
              >
                <DropdownLink
                  to="/dashboard"
                  onClick={() => setProfileOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownLink>
                <DropdownLink
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </DropdownLink>
                <DropdownLink
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </DropdownLink>
                <DropdownLink
                  to="/subscriptions"
                  onClick={() => setProfileOpen(false)}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Subscriptions</span>
                </DropdownLink>
                <hr className="my-1 border-slate-200 dark:border-slate-700" />
                <DropdownButton onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownButton>
              </div>
            </div>
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

        {/* ✅ Mobile Header Right (NO hamburger) */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggler />

          {/* Mobile: avatar toggles SLIDING SIDEBAR */}
          {authenticated && user ? (
            <button
              ref={mobileBtnRef}
              type="button"
              aria-haspopup="dialog"
              aria-expanded={mobileSidebarOpen}
              onClick={() => setMobileSidebarOpen(true)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand-600"
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt={displayName}
                  className="w-9 h-9 object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center w-full h-full">
                  {initial}
                </span>
              )}
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
      </div>

      {/* ✅ MOBILE PROFILE SLIDING SIDEBAR */}
      {/* Overlay + Panel */}
      <div
        className={`md:hidden fixed inset-0 z-[60] transition ${
          mobileSidebarOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        role="presentation"
        aria-hidden={!mobileSidebarOpen}
        aria-modal={mobileSidebarOpen}
      >
        {/* overlay */}
        <div
          className={`absolute inset-0 transition-opacity duration-200 ${
            mobileSidebarOpen ? "opacity-100" : "opacity-0"
          } bg-gradient-to-br from-slate-900/70 via-slate-900/60 to-slate-900/40 dark:from-black/70 dark:via-black/60 dark:to-black/40 backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:backdrop-blur-md`}
          onClick={() => setMobileSidebarOpen(false)}
        />
        {/* panel */}
        <aside
          ref={mobilePanelRef}
          className={`absolute right-0 top-0 h-full w-72 max-w-[80vw] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl transition-transform duration-200 ${
            mobileSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-label="Account"
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              {avatar ? (
                <img
                  src={avatar}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-brand-600 text-white flex items-center justify-center rounded-full font-semibold">
                  {initial}
                </div>
              )}
              <div className="leading-tight">
                <div className="text-slate-800 dark:text-slate-100 font-medium">
                  {displayName}
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-xs">
                  Account
                </div>
              </div>
            </div>
            <button
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-2">
            <MobileItem
              to="/dashboard"
              setMenuOpen={() => setMobileSidebarOpen(false)}
              icon={<LayoutDashboard className="h-4 w-4" />}
            >
              Dashboard
            </MobileItem>
            <MobileItem
              to="/settings"
              setMenuOpen={() => setMobileSidebarOpen(false)}
              icon={<Settings className="h-4 w-4" />}
            >
              Settings
            </MobileItem>
            <MobileItem
              to="/profile"
              setMenuOpen={() => setMobileSidebarOpen(false)}
              icon={<Edit className="h-4 w-4" />}
            >
              Edit Profile
            </MobileItem>
            <MobileItem
              to="/subscriptions"
              setMenuOpen={() => setMobileSidebarOpen(false)}
              icon={<CreditCard className="h-4 w-4" />}
            >
              Subscriptions
            </MobileItem>

            <button
              onClick={handleLogout}
              className="mt-1 w-full inline-flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-white/5"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </aside>
      </div>
    </nav>
  );
}

function DropdownLink({ to, onClick, children }) {
  return (
    <Link
      to={to}
      role="menuitem"
      tabIndex={0}
      onClick={onClick}
      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none transition hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800"
    >
      {children}
    </Link>
  );
}

function DropdownButton({ onClick, children }) {
  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={0}
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-200 outline-none transition hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800"
    >
      {children}
    </button>
  );
}

function MobileItem({ to, setMenuOpen, icon, children }) {
  return (
    <Link
      to={to}
      onClick={setMenuOpen}
      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      {icon}
      {children}
    </Link>
  );
}
