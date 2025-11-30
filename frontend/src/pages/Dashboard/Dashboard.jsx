// src/pages/Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { useStoredContext } from "../../context/useStoredContext";

const API_URL = import.meta?.env?.VITE_API_URL || "http://localhost:5000";
const NEON = ["#7C3AED", "#06B6D4", "#60A5FA", "#34D399", "#F59E0B"];

function GlassCard({ children, className = "" }) {
  return (
    <div
      className={
        "rounded-2xl p-5 border border-white/10 bg-white/6 dark:bg-slate-900/40 backdrop-blur-md shadow-sm hover:shadow-lg transition " +
        className
      }
    >
      {children}
    </div>
  );
}

export default function Dashboard() {
  console.log("Rendering Dashboard Page");
  const { user, getUser } = useStoredContext();
  const [quizData, setQuizData] = useState(null);
  const [discussionData, setDiscussionData] = useState(null);
  const [error, setError] = useState("");
  const [streak, setStreak] = useState(0);
  const [showCoursesList, setShowCoursesList] = useState("none"); // 'none', 'all', or 'completed'
  const [showCalendar, setShowCalendar] = useState(false);
  const [loginDates, setLoginDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    // Refresh user data on mount
    getUser();

    // Calculate streak and track login dates
    try {
      const key = userId ? `streak_${userId}` : "streak_guest";
      const datesKey = userId ? `login_dates_${userId}` : "login_dates_guest";
      
      const getYMD = (d) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      };
      
      const todayStr = getYMD(new Date());
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yestStr = getYMD(yesterday);

      const raw = localStorage.getItem(key);
      const datesRaw = localStorage.getItem(datesKey);
      let obj = null;
      let dates = [];
      
      try {
        obj = raw ? JSON.parse(raw) : null;
        dates = datesRaw ? JSON.parse(datesRaw) : [];
      } catch (e) {
        obj = null;
        dates = [];
        console.error(e);
      }

      // Add today to login dates if not already there
      if (!dates.includes(todayStr)) {
        dates.push(todayStr);
        localStorage.setItem(datesKey, JSON.stringify(dates));
      }
      setLoginDates(dates);

      if (!obj) {
        obj = { lastVisit: todayStr, streak: 1 };
        localStorage.setItem(key, JSON.stringify(obj));
        setStreak(obj.streak);
      } else if (obj.lastVisit === todayStr) {
        setStreak(Number(obj.streak) || 0);
      } else if (obj.lastVisit === yestStr) {
        obj.streak = (Number(obj.streak) || 0) + 1;
        obj.lastVisit = todayStr;
        localStorage.setItem(key, JSON.stringify(obj));
        setStreak(obj.streak);
      } else {
        obj.streak = 1;
        obj.lastVisit = todayStr;
        localStorage.setItem(key, JSON.stringify(obj));
        setStreak(obj.streak);
      }
    } catch (e) {
      setStreak(0);
      console.error("Error calculating streak:", e);
    }
  }, [userId, getUser]);

  useEffect(() => {
    let cancelled = false;
    const fetchQuizAndDiscussionData = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`${API_URL}/api/dashboard/${userId}`);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        if (cancelled) return;

        setQuizData(json.quiz || {
          totalQuizzesPlayed: 0,
          totalCorrect: 0,
          averageScore: 0,
          byCourse: [],
        });

        setDiscussionData(json.discussions || { enrolled: [] });
        console.log("Dashboard discussions data:", json.discussions);
        setError("");
      } catch (err) {
        if (cancelled) return;
        console.error("Dashboard fetch error:", err);
        setError("Failed to load quiz and discussion data.");
        setQuizData({
          totalQuizzesPlayed: 0,
          totalCorrect: 0,
          averageScore: 0,
          byCourse: [],
        });
        setDiscussionData({ enrolled: [] });
      }
    };

    fetchQuizAndDiscussionData();
    return () => (cancelled = true);
  }, [userId]);

  // Calculate progress for a course (same logic as Landing page)
  const calculateProgress = (progressArray, totalClasses) => {
    if (!Array.isArray(progressArray) || progressArray.length === 0) return 0;
    const completed = progressArray.filter(Boolean).length;
    return Math.round((completed / totalClasses) * 100);
  };

  // Get total classes in a course (same logic as Landing page)
  const getTotalClasses = (course) => {
    if (!course || !Array.isArray(course.modules)) return 0;
    return course.modules.reduce(
      (total, module) => total + (module.classCount || 0),
      0
    );
  };

  // Get all enrolled courses (both ongoing and completed)
  const allCourses = user?.enrolledCourses || [];

  // Get course stats
  const courseStats = useMemo(() => {
    const total = allCourses.length;
    const completed = allCourses.filter((ec) => ec.isComplete).length;
    const ongoing = total - completed;
    
    const totalProgress = allCourses.reduce((sum, ec) => {
      const totalClasses = getTotalClasses(ec.course);
      return sum + calculateProgress(ec.progress, totalClasses);
    }, 0);
    
    const avgProgress = total > 0 ? Math.round(totalProgress / total) : 0;

    return {
      totalEnrolled: total,
      completedCourses: completed,
      ongoingCourses: ongoing,
      avgCourseProgress: avgProgress,
    };
  }, [allCourses]);

  // Subject emoji mapping
  const subjectEmojis = {
    math: { icon: "📐", name: "Math" },
    Math: { icon: "📐", name: "Math" },
    MATH: { icon: "📐", name: "Math" },
    science: { icon: "🔬", name: "Science" },
    Science: { icon: "🔬", name: "Science" },
    SCIENCE: { icon: "🔬", name: "Science" },
    social: { icon: "🏘️", name: "Social" },
    Social: { icon: "🏘️", name: "Social" },
    SOCIAL: { icon: "🏘️", name: "Social" },
    "social science": { icon: "🏘️", name: "Social Science" },
    "Social Science": { icon: "🏘️", name: "Social Science" },
  };

  const getSubjectIcon = (subjectName) => {
    return subjectEmojis[subjectName] || { icon: "📚", name: subjectName };
  };

  // Get subject-wise course breakdown
  const subjectStats = useMemo(() => {
    const subjects = {};
    
    allCourses.forEach((ec) => {
      const subject = ec.course?.subject || "Other";
      if (!subjects[subject]) {
        subjects[subject] = {
          name: subject,
          total: 0,
          completed: 0,
          avgProgress: 0,
          courses: [],
          topics: {},
        };
      }
      subjects[subject].total += 1;
      subjects[subject].courses.push(ec);
      
      // Track topics/categories
      const category = ec.course?.category || "General";
      if (!subjects[subject].topics[category]) {
        subjects[subject].topics[category] = {
          name: category,
          count: 0,
          completed: 0,
        };
      }
      subjects[subject].topics[category].count += 1;
      if (ec.isComplete) {
        subjects[subject].completed += 1;
        subjects[subject].topics[category].completed += 1;
      }
    });

    // Calculate average progress per subject
    Object.keys(subjects).forEach((subject) => {
      const courses = subjects[subject].courses;
      const totalProgress = courses.reduce((sum, ec) => {
        const totalClasses = getTotalClasses(ec.course);
        return sum + calculateProgress(ec.progress, totalClasses);
      }, 0);
      subjects[subject].avgProgress = courses.length > 0 ? Math.round(totalProgress / courses.length) : 0;
    });

    // Sort by completed count descending
    return Object.values(subjects).sort((a, b) => b.completed - a.completed);
  }, [allCourses]);

  // Get topic interest stats (all topics across all subjects)
  const topicInterestStats = useMemo(() => {
    const topics = {};
    
    allCourses.forEach((ec) => {
      const category = ec.course?.category || "General";
      const subject = ec.course?.subject || "Other";
      
      if (!topics[category]) {
        topics[category] = {
          name: category,
          subject,
          count: 0,
          completed: 0,
          totalProgress: 0,
        };
      }
      topics[category].count += 1;
      if (ec.isComplete) {
        topics[category].completed += 1;
      }
      const totalClasses = getTotalClasses(ec.course);
      const progress = calculateProgress(ec.progress, totalClasses);
      topics[category].totalProgress += progress;
    });

    // Calculate average progress per topic and sort by interest (count)
    const topicsArray = Object.values(topics).map(topic => ({
      ...topic,
      avgProgress: Math.round(topic.totalProgress / topic.count),
    }));

    return topicsArray.sort((a, b) => b.count - a.count);
  }, [allCourses]);

  // Helper function to get calendar days
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getYMD = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const isDateLogged = (day) => {
    const dateStr = getYMD(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    );
    return loginDates.includes(dateStr);
  };

  const getDayOfWeek = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const dayIndex = today.getDay();
    return days[dayIndex];
  };

  const getWeekDays = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const days = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - currentDay + i);
      const logged = loginDates.includes(getYMD(date));
      days.push({
        name: dayNames[i],
        logged,
        isToday: i === currentDay,
      });
    }
    return days;
  };

  const weekDays = getWeekDays();

  const safeQuiz = quizData || {
    totalQuizzesPlayed: 0,
    totalCorrect: 0,
    averageScore: 0,
    byCourse: [],
  };
  const safeDiscussions = Array.isArray(discussionData?.created)
    ? discussionData.created
    : discussionData && Array.isArray(discussionData)
    ? discussionData
    : [];
  const recentActivity = JSON.parse(
    localStorage.getItem("recentActivities") || "[]"
  );

  const pieData = useMemo(
    () => [
      { name: "Completed", value: courseStats.completedCourses },
      { name: "In Progress", value: courseStats.ongoingCourses },
    ],
    [courseStats.completedCourses, courseStats.ongoingCourses]
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 text-slate-900 dark:text-slate-100">
      {!userId && (
        <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800">
          Please sign in first. No userId found in local storage.
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight">Dashboard</h2>
        
        {/* Futuristic Streak Display - Horizontal */}
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="cursor-pointer"
        >
          <div className="relative bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/50 rounded-xl px-4 py-2 hover:border-orange-400/80 transition-all hover:shadow-lg hover:shadow-orange-500/20 flex items-center gap-2">
            <div className="text-2xl animate-pulse">🔥</div>
            <div>
              <p className="text-2xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                {streak}
              </p>
            </div>
            
            {/* Week days indicator - Compact */}
            <div className="flex gap-1 ml-2 pl-2 border-l border-orange-500/30">
              {weekDays.map((day, idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded text-xs font-bold flex items-center justify-center transition-all ${
                    day.logged
                      ? "bg-gradient-to-br from-orange-400 to-red-400 text-white shadow-lg shadow-orange-500/50"
                      : "bg-slate-700 text-slate-400"
                  } ${day.isToday ? "ring-2 ring-orange-300" : ""}`}
                  title={day.name}
                >
                  {day.name.charAt(0)}
                </div>
              ))}
            </div>
          </div>
        </button>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-orange-500/30 p-6 max-w-md w-full shadow-2xl shadow-orange-500/20">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Login Calendar</h3>
                <p className="text-sm text-slate-400 mt-1">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={() => setShowCalendar(false)}
                className="text-slate-400 hover:text-white text-2xl transition"
              >
                ✕
              </button>
            </div>

            {/* Month Navigation */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                  )
                }
                className="flex-1 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-lg text-sm text-slate-300 transition"
              >
                ← Prev
              </button>
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="flex-1 px-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 rounded-lg text-sm text-orange-300 transition font-semibold"
              >
                Today
              </button>
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                  )
                }
                className="flex-1 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-lg text-sm text-slate-300 transition"
              >
                Next →
              </button>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="h-8 flex items-center justify-center text-xs font-bold text-slate-400"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {Array.from({
                length: getFirstDayOfMonth(currentMonth),
              }).map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="h-8 bg-slate-800/50 rounded"
                />
              ))}
              {Array.from({ length: getDaysInMonth(currentMonth) }).map(
                (_, idx) => {
                  const day = idx + 1;
                  const isLogged = isDateLogged(day);
                  const isToday =
                    new Date().getDate() === day &&
                    new Date().getMonth() === currentMonth.getMonth() &&
                    new Date().getFullYear() === currentMonth.getFullYear();

                  return (
                    <div
                      key={day}
                      className={`h-8 rounded flex items-center justify-center text-xs font-bold transition-all ${
                        isLogged
                          ? "bg-gradient-to-br from-orange-400 to-red-400 text-white shadow-lg shadow-orange-500/50"
                          : "bg-slate-700/50 text-slate-400"
                      } ${
                        isToday
                          ? "ring-2 ring-orange-300 ring-inset"
                          : ""
                      }`}
                    >
                      {isLogged && <span className="text-lg">🔥</span>}
                      {!isLogged && day}
                    </div>
                  );
                }
              )}
            </div>

            {/* Stats */}
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-400">Total Login Days</p>
              <p className="text-2xl font-bold text-orange-400 mt-1">
                {loginDates.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setShowCoursesList(showCoursesList === "all" ? "none" : "all")}
          className="text-left rounded-2xl p-5 border border-white/10 bg-white/6 dark:bg-slate-900/40 backdrop-blur-md shadow-sm hover:shadow-lg hover:scale-[1.02] transition cursor-pointer"
        >
          <p className="text-slate-400 text-sm">Courses Enrolled</p>
          <p className="text-3xl font-bold mt-1">{courseStats.totalEnrolled}</p>
          <div className="text-sm text-slate-500 mt-1">
            {courseStats.completedCourses} completed, {courseStats.ongoingCourses} ongoing
          </div>
        </button>

        <button
          onClick={() => setShowCoursesList(showCoursesList === "completed" ? "none" : "completed")}
          className="text-left rounded-2xl p-5 border border-white/10 bg-white/6 dark:bg-slate-900/40 backdrop-blur-md shadow-sm hover:shadow-lg hover:scale-[1.02] transition cursor-pointer"
        >
          <p className="text-slate-400 text-sm">Courses Completed</p>
          <p className="text-3xl font-bold mt-1">
            {courseStats.completedCourses}
          </p>
          <div className="text-sm text-slate-500 mt-1">
            Out of {courseStats.totalEnrolled} courses
          </div>
        </button>
      </div>

      {/* Inline Courses List */}
      {showCoursesList !== "none" && (
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              {showCoursesList === "all"
                ? "All Enrolled Courses"
                : "Completed Courses"}
            </h3>
            <a
              href="/courses"
              className="text-indigo-400 text-sm hover:underline"
            >
              Browse Courses
            </a>
          </div>

          <div className="grid gap-4">
            {showCoursesList === "all" ? (
              // Show all courses
              allCourses.length === 0 ? (
                <div className="text-slate-400">No enrolled courses yet.</div>
              ) : (
                allCourses.map((ec, idx) => {
                  const course = ec.course;
                  const totalClasses = getTotalClasses(course);
                  const progressPercent = calculateProgress(
                    ec.progress,
                    totalClasses
                  );
                  const isComplete = ec.isComplete;
                  const courseLink = course
                    ? `/courses/${course.courseType || course.slug}/${
                        course._id
                      }`
                    : "/courses";

                  return (
                    <a
                      key={ec._id || idx}
                      href={courseLink}
                      className="block rounded-lg p-3 border border-white/6 hover:bg-white/5 transition"
                    >
                      <div className="flex justify-between items-center">
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                            {course?.title || "Untitled Course"}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {isComplete ? (
                              <span className="text-green-400 font-semibold">
                                ✓ Completed
                              </span>
                            ) : (
                              <span>In Progress</span>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-slate-400 ml-4">
                          {progressPercent}%
                        </div>
                      </div>
                      <div className="mt-3 w-full h-3 bg-slate-700/30 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${progressPercent}%` }}
                          className="h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        />
                      </div>
                    </a>
                  );
                })
              )
            ) : (
              // Show completed courses only
              allCourses.filter((ec) => ec.isComplete).length === 0 ? (
                <div className="text-slate-400">No completed courses yet.</div>
              ) : (
                allCourses
                  .filter((ec) => ec.isComplete)
                  .map((ec, idx) => {
                    const course = ec.course;
                    const totalClasses = getTotalClasses(course);
                    const progressPercent = calculateProgress(
                      ec.progress,
                      totalClasses
                    );
                    const courseLink = course
                      ? `/courses/${course.courseType || course.slug}/${
                          course._id
                        }`
                      : "/courses";

                    return (
                      <a
                        key={ec._id || idx}
                        href={courseLink}
                        className="block rounded-lg p-3 border border-white/6 hover:bg-white/5 transition"
                      >
                        <div className="flex justify-between items-center">
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                              {course?.title || "Untitled Course"}
                            </div>
                            <div className="text-xs text-green-400 font-semibold mt-1">
                              ✓ Completed
                            </div>
                          </div>
                          <div className="text-sm text-slate-400 ml-4">
                            {progressPercent}%
                          </div>
                        </div>
                        <div className="mt-3 w-full h-3 bg-slate-700/30 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${progressPercent}%` }}
                            className="h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                          />
                        </div>
                      </a>
                    );
                  })
              )
            )}
          </div>
        </GlassCard>
      )}


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Futuristic Course Completion Breakdown */}
        <GlassCard>
          <h3 className="font-semibold mb-6 text-lg">Course Analytics</h3>
          <div className="space-y-6">
            {/* Circular Progress Indicators */}
            <div className="flex justify-around items-center">
              {/* Completed Courses Circle */}
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    fill="none"
                    stroke="rgba(100, 116, 139, 0.2)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    fill="none"
                    stroke="url(#completedGradient)"
                    strokeWidth="3"
                    strokeDasharray={`${
                      (courseStats.completedCourses / courseStats.totalEnrolled) * 264 || 0
                    } 264`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="completedGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold text-green-400">
                    {courseStats.completedCourses}
                  </p>
                  <p className="text-xs text-slate-400">Completed</p>
                </div>
              </div>

              {/* Ongoing Courses Circle */}
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    fill="none"
                    stroke="rgba(100, 116, 139, 0.2)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    fill="none"
                    stroke="url(#ongoingGradient)"
                    strokeWidth="3"
                    strokeDasharray={`${
                      (courseStats.ongoingCourses / courseStats.totalEnrolled) * 264 || 0
                    } 264`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="ongoingGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#60a5fa" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold text-blue-400">
                    {courseStats.ongoingCourses}
                  </p>
                  <p className="text-xs text-slate-400">Ongoing</p>
                </div>
              </div>

              {/* Total Courses Circle */}
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    fill="none"
                    stroke="rgba(100, 116, 139, 0.2)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    fill="none"
                    stroke="url(#totalGradient)"
                    strokeWidth="3"
                    strokeDasharray="264 264"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="totalGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold text-purple-400">
                    {courseStats.totalEnrolled}
                  </p>
                  <p className="text-xs text-slate-400">Total</p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-3 border border-green-500/20">
                <p className="text-xs text-slate-400">Completion Rate</p>
                <p className="text-lg font-bold text-green-400 mt-1">
                  {courseStats.totalEnrolled > 0
                    ? Math.round(
                        (courseStats.completedCourses / courseStats.totalEnrolled) * 100
                      )
                    : 0}
                  %
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-3 border border-blue-500/20">
                <p className="text-xs text-slate-400">Avg Progress</p>
                <p className="text-lg font-bold text-blue-400 mt-1">
                  {courseStats.avgCourseProgress}%
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Futuristic Quiz Stats */}
        <GlassCard>
          <h3 className="font-semibold mb-6 text-lg">Quiz Performance</h3>
          <div className="space-y-6">
            {/* Radial Score Display */}
            <div className="flex justify-around items-center">
              {/* Accuracy */}
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    fill="none"
                    stroke="rgba(100, 116, 139, 0.2)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    fill="none"
                    stroke="url(#accuracyGradient)"
                    strokeWidth="3"
                    strokeDasharray={`${
                      ((safeQuiz.totalQuizzesPlayed > 0
                        ? (safeQuiz.totalCorrect / safeQuiz.totalQuizzesPlayed) * 100
                        : 0) / 100) * 264
                    } 264`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="accuracyGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold text-amber-400">
                    {safeQuiz.totalQuizzesPlayed > 0
                      ? Math.round(
                          (safeQuiz.totalCorrect / safeQuiz.totalQuizzesPlayed) * 100
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-slate-400">Accuracy</p>
                </div>
              </div>

              {/* Average Score */}
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    fill="none"
                    stroke="rgba(100, 116, 139, 0.2)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth="3"
                    strokeDasharray={`${
                      ((safeQuiz.averageScore || 0) / 100) * 264
                    } 264`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="scoreGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#0891b2" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold text-cyan-400">
                    {safeQuiz.averageScore}
                  </p>
                  <p className="text-xs text-slate-400">Score</p>
                </div>
              </div>

              {/* Quizzes Played */}
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    fill="none"
                    stroke="rgba(100, 116, 139, 0.2)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    fill="none"
                    stroke="url(#quizzesGradient)"
                    strokeWidth="3"
                    strokeDasharray={`${
                      Math.min((safeQuiz.totalQuizzesPlayed / 20) * 264, 264)
                    } 264`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="quizzesGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#f472b6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold text-pink-400">
                    {safeQuiz.totalQuizzesPlayed}
                  </p>
                  <p className="text-xs text-slate-400">Played</p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg p-3 border border-amber-500/20">
                <p className="text-xs text-slate-400">Correct Answers</p>
                <p className="text-lg font-bold text-amber-400 mt-1">
                  {safeQuiz.totalCorrect}
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-lg p-3 border border-pink-500/20">
                <p className="text-xs text-slate-400">Total Attempted</p>
                <p className="text-lg font-bold text-pink-400 mt-1">
                  {safeQuiz.totalQuizzesPlayed}
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Topic Interest Graph */}
      {topicInterestStats.length > 0 && (
        <GlassCard className="col-span-1 md:col-span-2 lg:col-span-3">
          <h3 className="font-semibold mb-6 text-lg">📊 Your Topic Interests</h3>
          <div className="space-y-4">
            {/* Topic Interest Bar Chart */}
            <div className="space-y-4">
              {topicInterestStats.slice(0, 8).map((topic, idx) => {
                const maxCount = Math.max(...topicInterestStats.map(t => t.count)) || 1;
                const barWidth = (topic.count / maxCount) * 100;
                
                const topicColors = [
                  { bg: "bg-gradient-to-r from-blue-500 to-cyan-500", text: "text-blue-400", icon: "🎓" },
                  { bg: "bg-gradient-to-r from-green-500 to-emerald-500", text: "text-green-400", icon: "🌱" },
                  { bg: "bg-gradient-to-r from-purple-500 to-pink-500", text: "text-purple-400", icon: "✨" },
                  { bg: "bg-gradient-to-r from-orange-500 to-red-500", text: "text-orange-400", icon: "🔥" },
                  { bg: "bg-gradient-to-r from-pink-500 to-rose-500", text: "text-pink-400", icon: "💎" },
                  { bg: "bg-gradient-to-r from-cyan-500 to-blue-500", text: "text-cyan-400", icon: "🚀" },
                  { bg: "bg-gradient-to-r from-indigo-500 to-purple-500", text: "text-indigo-400", icon: "⚡" },
                  { bg: "bg-gradient-to-r from-teal-500 to-green-500", text: "text-teal-400", icon: "💡" },
                ];
                const color = topicColors[idx % topicColors.length];

                return (
                  <div key={topic.name} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1 flex items-center gap-2">
                        <span className="text-lg">{color.icon}</span>
                        <h4 className="font-semibold text-slate-200 capitalize flex-1">{topic.name}</h4>
                        <span className="text-xs text-slate-400 bg-slate-700/40 px-2 py-1 rounded">
                          {topic.completed}/{topic.count} completed
                        </span>
                      </div>
                      <div className="ml-4 text-right">
                        <p className={`text-lg font-bold ${color.text}`}>{topic.count}</p>
                        <p className="text-xs text-slate-400">courses</p>
                      </div>
                    </div>

                    {/* Bar Container */}
                    <div className="relative h-8 bg-slate-700/20 rounded-lg overflow-hidden border border-slate-600/30">
                      {/* Background bar */}
                      <div
                        className={`absolute inset-y-0 left-0 ${color.bg} opacity-30 transition-all duration-1000 ease-out`}
                        style={{ width: `${barWidth}%` }}
                      />

                      {/* Foreground bar with glow effect */}
                      <div
                        className={`absolute inset-y-0 left-0 ${color.bg} shadow-lg transition-all duration-1000 ease-out`}
                        style={{ width: `${barWidth}%` }}
                      />

                      {/* Stats overlay */}
                      <div className="absolute inset-0 flex items-center px-3 justify-between text-sm font-semibold">
                        <span className="text-slate-200 group-hover:opacity-100 transition">
                          {topic.avgProgress}% avg
                        </span>
                        <span className={`text-white ${color.text.replace('text-', 'drop-shadow-lg')} font-bold`}>
                          {Math.round(barWidth)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Topic Summary Stats */}
            <div className="mt-6 pt-6 border-t border-slate-700/30 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-xs text-slate-400">Total Topics</p>
                <p className="text-2xl font-bold text-blue-400 mt-1">{topicInterestStats.length}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-3">
                <p className="text-xs text-slate-400">Most Popular</p>
                <p className="text-lg font-bold text-green-400 mt-1 capitalize truncate">
                  {topicInterestStats[0]?.name || "N/A"}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-3">
                <p className="text-xs text-slate-400">Avg Per Topic</p>
                <p className="text-2xl font-bold text-purple-400 mt-1">
                  {Math.round(
                    topicInterestStats.reduce((sum, t) => sum + t.count, 0) / topicInterestStats.length
                  )}
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-3">
                <p className="text-xs text-slate-400">Completed</p>
                <p className="text-2xl font-bold text-orange-400 mt-1">
                  {topicInterestStats.reduce((sum, t) => sum + t.completed, 0)}
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Futuristic Course-wise Quiz Performance */}
      {safeQuiz.byCourse && safeQuiz.byCourse.length > 0 && (
        <GlassCard>
          <h3 className="font-semibold mb-6 text-lg">Course-wise Quiz Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeQuiz.byCourse.map((course, idx) => {
              const score = Number(course.averageScore) || 0;
              const fillPercentage = (score / 100) * 100;
              return (
                <div
                  key={idx}
                  className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-4 hover:border-slate-600/50 transition"
                >
                  {/* Background glow effect */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition blur-xl"
                  />
                  <div className="relative z-10">
                    <p className="text-sm text-slate-300 truncate font-medium">
                      {course.title}
                    </p>
                    <div className="mt-3 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-full transition-all duration-1000"
                        style={{ width: `${fillPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-slate-400">Performance</p>
                      <p className="text-sm font-bold text-purple-400">{score}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Your Created Questions</h3>
        </div>

        <div className="space-y-3">
          {safeDiscussions && safeDiscussions.length > 0 ? (
            safeDiscussions.slice(0, 3).map((d) => (
              <a
                key={d.id || d._id}
                href="/discussions"
                className="block p-3 rounded-lg border border-white/6 hover:bg-white/5 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium line-clamp-1">
                    {d.title || "Untitled Question"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(
                      d.updatedAt || d.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </span>
                </div>
                {d.snippet && (
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                    {d.snippet}
                  </p>
                )}
              </a>
            ))
          ) : (
            <div className="text-slate-400 text-sm py-4 text-center">
              No questions created yet. Start a discussion to share your knowledge!
            </div>
          )}
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Activity</h3>
        </div>

        <div className="space-y-3">
          {recentActivity.slice(0, 6).map((a, idx) => (
            <a
              key={idx}
              href={a.url || "#"}
              className="block p-3 rounded-lg border border-white/6 hover:bg-white/5 transition"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium line-clamp-1">
                  {a.title || a.type || "Activity"}
                </div>
                <div className="text-xs text-slate-400">
                  {new Date(a.timestamp || Date.now()).toLocaleString()}
                </div>
              </div>
              {a.description && (
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                  {a.description}
                </p>
              )}
            </a>
          ))}
          {recentActivity.length === 0 && (
            <div className="text-slate-400 text-sm">
              No recent activity yet.
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
