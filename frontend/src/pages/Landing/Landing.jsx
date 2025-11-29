import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStoredContext } from "../../context/useStoredContext";

function Landing() {
  console.log("Rendering Landing Page");
  const { user, getUser } = useStoredContext();
  const [recentActivities, setRecentActivities] = useState([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Refresh user data on mount
    getUser();

    // Load recent activities from localStorage
    const activities = JSON.parse(
      localStorage.getItem("recentActivities") || "[]"
    );
    setRecentActivities(activities.slice(0, 5)); // Show last 5

    // Calculate streak
    const userId = user?._id;
    try {
      const key = userId ? `streak_${userId}` : "streak_guest";
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
      let obj = null;
      try {
        obj = raw ? JSON.parse(raw) : null;
      } catch (e) {
        obj = null;
        console.error(e);
      }

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
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 animate-pulse">
            Welcome to My Study Partner
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Please log in to view your personalized dashboard.
          </p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Get Started
          </Link>
        </div>
      </div>
    );
  }

  // Calculate progress for a course
  const calculateProgress = (progressArray, totalClasses) => {
    if (!Array.isArray(progressArray) || progressArray.length === 0) return 0;
    const completed = progressArray.filter(Boolean).length;
    return Math.round((completed / totalClasses) * 100);
  };

  // Get total classes in a course
  const getTotalClasses = (course) => {
    if (!course || !Array.isArray(course.modules)) return 0;
    return course.modules.reduce(
      (total, module) => total + (module.classCount || 0),
      0
    );
  };

  // Filter ongoing (incomplete) courses with valid progress
  const ongoingCourses =
    user.enrolledCourses?.filter(
      (ec) => !ec.isComplete && getTotalClasses(ec.course) > 0
    ) || [];

  // Activity icons
  const getActivityIcon = (type) => {
    switch (type.toLowerCase()) {
      case "course":
        return "📚";
      case "quiz":
        return "🧠";
      case "discussion":
        return "💬";
      default:
        return "📝";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Welcome Section with Streak on Right */}
        <div className="flex items-center justify-between animate-fade-in">
          <div className="flex-1">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 animate-pulse">
              Welcome back, {user.profile?.fullName || user.username}!
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
              Ready to continue your learning journey?
            </p>
            <div className="flex justify-start space-x-4">
              <Link
                to="/courses"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Explore Courses
              </Link>
              <Link
                to="/quiz"
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Take a Quiz
              </Link>
            </div>
          </div>
          <div className="text-right ml-8">
            <div className="text-xs text-slate-500">Current Streak</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent animate-pulse flex items-center justify-center">
              {streak}
              <span className="text-3xl ml-4 drop-shadow-2xl text-orange-500 filter brightness-125">
                🔥
              </span>
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-300">
              {streak === 1 ? "day" : "days"}
            </div>
          </div>
        </div>

        {/* Ongoing Courses Section */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 dark:border-slate-700/50">
          <h2 className="text-3xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center">
            <span className="mr-3">🚀</span> Ongoing Courses
          </h2>
          {ongoingCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-300 text-lg mb-4">
                No ongoing courses. Let's get you started!
              </p>
              <Link
                to="/courses"
                className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ongoingCourses.map((ec) => {
                const course = ec.course;
                const totalClasses = getTotalClasses(course);
                const progressPercent = calculateProgress(
                  ec.progress,
                  totalClasses
                );
                const courseLink = course
                  ? `/courses/${course.courseType || course.slug}/${course._id}`
                  : "/courses";

                return (
                  <Link
                    key={ec._id}
                    to={courseLink}
                    className="group block bg-gradient-to-br from-white to-slate-50 dark:from-slate-700 dark:to-slate-600 rounded-xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-slate-200 dark:border-slate-600"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {course?.title || "Untitled Course"}
                        </h3>
                        <span className="text-sm text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-500 px-2 py-1 rounded-full">
                          {progressPercent}% complete
                        </span>
                      </div>
                      <div className="text-3xl">📖</div>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Trending Quiz Section */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 dark:border-slate-700/50">
          <h2 className="text-3xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center">
            <span className="mr-3">🔥</span> Trending Quiz
          </h2>
          <div className="text-center py-8">
            <div className="inline-block bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl mb-4">🧠</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Ultimate Knowledge Challenge
              </h3>
              <p className="text-orange-100 mb-6">
                Test your skills in this trending quiz with 1000+ participants!
              </p>
              <div className="flex justify-center space-x-4 mb-4">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                  1000+ Players
                </span>
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                  High Score: 95%
                </span>
              </div>
              <Link
                to="/quiz"
                className="inline-block px-8 py-3 bg-white text-orange-500 font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 dark:border-slate-700/50">
          <h2 className="text-3xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center">
            <span className="mr-3">⚡</span> Recent Activity
          </h2>
          {recentActivities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-300 text-lg mb-4">
                No recent activity. Start exploring to see your progress here!
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  to="/courses"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Courses
                </Link>
                <Link
                  to="/quiz"
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Quizzes
                </Link>
                <Link
                  to="/discussions"
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Discussions
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <Link
                  key={index}
                  to={activity.url || "#"}
                  className="group block bg-gradient-to-r from-slate-50 to-white dark:from-slate-700 dark:to-slate-600 rounded-xl p-4 hover:shadow-lg transform hover:scale-102 transition-all duration-300 border border-slate-200 dark:border-slate-600"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-300">
                        {activity.type} •{" "}
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors">
                      →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Landing;
