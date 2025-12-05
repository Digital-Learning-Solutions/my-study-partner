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

  // Find next class to complete for a course
  const findNextClassForCourse = (enrolledCourse) => {
    const course = enrolledCourse.course;
    const progress = enrolledCourse.progress || [];
    if (!course.modules) return null;

    for (const mod of course.modules) {
      for (const cls of mod.classes) {
        if (!progress[cls.id]) {
          return { module: mod, class: cls };
        }
      }
    }
    return null; // All classes completed
  };

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
          <div className="ml-8">
            <div className="relative group">
              {/* Glowing background effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

              {/* Main streak card */}
              <div className="relative bg-white/10 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-2xl hover:shadow-orange-500/25 transition-all duration-500 hover:scale-105">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Current Streak
                  </div>

                  {/* Streak number with enhanced styling */}
                  <div className="relative flex items-center justify-center">
                    <div className="text-5xl font-black bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-pulse drop-shadow-lg">
                      {streak}
                    </div>

                    {/* Static fire design */}
                    <div className="ml-3 text-4xl">
                      <span className="filter drop-shadow-2xl">🔥</span>
                    </div>

                    {/* Glowing ring effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400/20 to-pink-500/20 blur-xl animate-pulse"></div>
                  </div>
                </div>

                {/* Days text with futuristic styling */}
                <div className="text-center">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 border border-orange-300/30">
                    {streak === 1 ? "day" : "days"}
                  </span>
                </div>

                {/* Achievement badge for streaks */}
                {streak >= 7 && (
                  <div className="mt-3 text-center">
                    <span className="inline-block px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full animate-bounce">
                      🔥 HOT STREAK!
                    </span>
                  </div>
                )}
              </div>
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
                const nextClassInfo = findNextClassForCourse(ec);
                const courseLink = nextClassInfo
                  ? `/courses/${course.courseType || course.slug}/${course._id}/${nextClassInfo.module.title.toLowerCase().split(" ").join("-")}`
                  : `/courses/${course.courseType || course.slug}/${course._id}`;

                return (
                  <Link
                    key={ec._id}
                    to={courseLink}
                    state={
                      nextClassInfo
                        ? {
                            classes: nextClassInfo.module.classes,
                            title: nextClassInfo.module.title,
                            content: nextClassInfo.module.content,
                            courseId: course._id,
                            nextClassId: nextClassInfo.class.id,
                          }
                        : null
                    }
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
                Test your skills in this trending quiz with 100+ participants and and compete with your friends!              </p>
              <div className="flex justify-center space-x-4 mb-4">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                  100+ Players
                </span>
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                  Friends: Everyone
                </span>
              </div>
              
              <div className="flex justify-center space-x-4 mb-4">
                <Link
                to="/quiz/solo"
                className="inline-block px-8 py-3 bg-white text-orange-500 font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Go Solo
              </Link>
               <Link
                to="/quiz/multiplayer"
                className="inline-block px-8 py-3 bg-white text-orange-500 font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                With Friends
              </Link>
              </div>
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
