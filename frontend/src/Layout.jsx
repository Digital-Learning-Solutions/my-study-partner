import { Routes, Route, Navigate } from "react-router-dom";
import Intro from "./Intro";
import LoginPage from "./LoginPage";
import RegistrationPage from "./RegistrationPage";
import Quiz from "./Quiz";
import Cource from "./Course";
import Navbar from "./components/Navbar";
import Discussion from "./Discussion";
import ProfilePage from "./pages/Profile/ProfilePage";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import SubscriptionPage from "./pages/Subscriptions/SubscriptionPage.jsx";
import { useStoredContext } from "./context/useStoredContext.js";
import ChatBot from "./components/ChatBot.jsx";

function Layout() {
  const { user } = useStoredContext();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
        <Navbar />
      </header>

      <main className="flex-grow bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        <Routes>
          <Route index element={<Intro />} />

          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegistrationPage />} />
          <Route path="/quiz/*" element={<Quiz />} />
          <Route path="/courses/*" element={<Cource />} />
          <Route path="/discussions/*" element={<Discussion />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* 🔥 Updated Dashboard Route */}
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" replace />}
          />

          <Route path="/subscriptions" element={<SubscriptionPage />} />
        </Routes>
      </main>

      <footer className="bg-slate-800 dark:bg-slate-950 text-slate-300 dark:text-slate-400">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <p>
              &copy; {new Date().getFullYear()} AI Learning Partner. All Rights
              Reserved.
            </p>
          </div>
        </div>
      </footer>
      <ChatBot />
    </div>
  );
}

export default Layout;
