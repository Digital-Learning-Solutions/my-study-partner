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
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [showCourses, setShowCourses] = useState(false);
  const [streak] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`${API_URL}/api/dashboard/${userId}`);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        if (cancelled) return;

        const safe = {
          courses: {
            detail: Array.isArray(json.courses?.detail)
              ? json.courses.detail
              : [],
            totalEnrolled: Number(json.courses?.totalEnrolled) || 0,
            completedCourses: Number(json.courses?.completedCourses) || 0,
            avgCourseProgress: Number(json.courses?.avgCourseProgress) || 0,
            totalClasses: Number(json.courses?.totalClasses) || 0,
            watchedClasses: Number(json.courses?.watchedClasses) || 0,
          },
          quiz: json.quiz || {
            totalQuizzesPlayed: 0,
            totalCorrect: 0,
            averageScore: 0,
            byCourse: [],
          },
          discussions: json.discussions || { enrolled: [] },
          updatedAt: json.updatedAt,
        };

        setData(safe);
        setError("");
      } catch (err) {
        if (cancelled) return;
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data.");
        setData({
          courses: {
            detail: [],
            totalEnrolled: 0,
            completedCourses: 0,
            avgCourseProgress: 0,
            totalClasses: 0,
            watchedClasses: 0,
          },
          quiz: {
            totalQuizzesPlayed: 0,
            totalCorrect: 0,
            averageScore: 0,
            byCourse: [],
          },
          discussions: { enrolled: [] },
          updatedAt: new Date().toISOString(),
        });
      }
    };

    fetchData();
    return () => (cancelled = true);
  }, [userId]);

  const safeCourses = data?.courses || {
    totalEnrolled: 0,
    completedCourses: 0,
    avgCourseProgress: 0,
    totalClasses: 0,
    watchedClasses: 0,
    detail: [],
  };
  const safeQuiz = data?.quiz || {
    totalQuizzesPlayed: 0,
    totalCorrect: 0,
    averageScore: 0,
    byCourse: [],
  };
  const safeDiscussions = Array.isArray(data?.discussions?.enrolled)
    ? data.discussions.enrolled
    : [];
  const recentActivity = JSON.parse(
    localStorage.getItem("recentActivities") || "[]"
  );

  const pieData = useMemo(
    () => [
      { name: "Completed", value: Number(safeCourses.completedCourses) || 0 },
      {
        name: "In Progress",
        value: Math.max(
          0,
          (Number(safeCourses.totalEnrolled) || 0) -
            (Number(safeCourses.completedCourses) || 0)
        ),
      },
    ],
    [safeCourses.completedCourses, safeCourses.totalEnrolled]
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
        <div className="text-right">
          <div className="text-xs text-slate-500">Streak</div>
          <div className="inline-block mt-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold px-3 py-1 rounded-full shadow">
            {streak} {streak === 1 ? "day" : "days"}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          type="button"
          onClick={() => setShowCourses((s) => !s)}
          className="text-left rounded-2xl p-5 border border-white/6 bg-white/5 hover:scale-[1.01] shadow transition"
        >
          <p className="text-slate-400 text-sm flex items-center gap-2">
            Courses Enrolled{" "}
            <span className="text-xs text-indigo-400">
              {showCourses ? "Hide" : "View"}
            </span>
          </p>
          <p className="text-3xl font-bold mt-2">{safeCourses.totalEnrolled}</p>
          <p className="text-sm text-slate-500 mt-1">
            Updated: {new Date(data?.updatedAt || Date.now()).toLocaleString()}
          </p>
        </button>

        <GlassCard>
          <p className="text-slate-400 text-sm">Courses Completed</p>
          <p className="text-3xl font-bold mt-1">
            {safeCourses.completedCourses}
          </p>
          <div className="text-sm text-slate-500 mt-1">
            Average completion: {safeCourses.avgCourseProgress}%
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-slate-400 text-sm">Avg Progress</p>
          <p className="text-3xl font-bold mt-1">
            {safeCourses.avgCourseProgress}%
          </p>
          <div className="text-sm text-slate-500 mt-1">
            Classes watched: {safeCourses.watchedClasses} /{" "}
            {safeCourses.totalClasses}
          </div>
        </GlassCard>
      </div>

      {showCourses && (
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Enrolled Courses</h3>
            <a
              href="/courses"
              className="text-indigo-400 text-sm hover:underline"
            >
              Browse Courses
            </a>
          </div>

          <div className="grid gap-4">
            {safeCourses.detail.length === 0 && (
              <div className="text-slate-400">No enrolled courses yet.</div>
            )}

            {safeCourses.detail.map((c, idx) => {
              const percentage = Number(c.progressPercentage || 0);
              const courseLink =
                c.courseLink ||
                (c.courseId
                  ? `/courses/${encodeURIComponent(c.category || "general")}/${
                      c.courseId
                    }`
                  : "/courses");
              return (
                <a
                  key={c.courseId || c.id || idx}
                  href={courseLink}
                  className="block rounded-lg p-3 border border-white/6 hover:bg-white/5 transition"
                >
                  <div className="flex justify-between items-center">
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                        {c.title}
                      </div>
                      {c.subject && (
                        <div className="text-xs text-slate-400 mt-1">
                          {c.subject}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-slate-400">{percentage}%</div>
                  </div>
                  <div className="mt-3 w-full h-3 bg-slate-700/30 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${percentage}%` }}
                      className="h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    />
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    Classes: {c.watchedClasses}/{c.totalClasses}
                  </div>
                </a>
              );
            })}
          </div>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="font-semibold mb-4">Course Completion Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={NEON[index % NEON.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-semibold mb-4">Classes Watched</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart
                data={[
                  {
                    name: "Watched",
                    value: Number(safeCourses.watchedClasses) || 0,
                  },
                  {
                    name: "Total",
                    value: Number(safeCourses.totalClasses) || 0,
                  },
                ]}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#60A5FA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard>
          <p className="text-slate-400 text-sm">Quizzes Played</p>
          <p className="text-3xl font-bold mt-1">
            {safeQuiz.totalQuizzesPlayed}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-slate-400 text-sm">Total Correct</p>
          <p className="text-3xl font-bold mt-1">{safeQuiz.totalCorrect}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-slate-400 text-sm">Average Score</p>
          <p className="text-3xl font-bold mt-1">{safeQuiz.averageScore}</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="font-semibold mb-4">Average Quiz Score by Course</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart
                data={(safeQuiz.byCourse || []).map((q) => ({
                  name: q.title,
                  avg: Number(q.averageScore) || 0,
                }))}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="avg" fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {(!safeQuiz.byCourse || safeQuiz.byCourse.length === 0) && (
            <div className="text-slate-500 text-sm mt-2">No quiz data yet.</div>
          )}
        </GlassCard>

        <GlassCard>
          <h3 className="font-semibold mb-4">Overall Average Marks</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                {(() => {
                  const scored = Math.max(
                    0,
                    Math.min(100, Number(safeQuiz.averageScore) || 0)
                  );
                  const pie = [
                    { name: "Scored", value: scored },
                    { name: "Remaining", value: 100 - scored },
                  ];
                  return (
                    <>
                      <Pie data={pie} dataKey="value" outerRadius={90} label>
                        {pie.map((entry, index) => (
                          <Cell
                            key={`avg-cell-${index}`}
                            fill={index === 0 ? NEON[1] : "#e5e7eb"}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </>
                  );
                })()}
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Enrolled Discussions</h3>
          <a
            href="/discussions"
            className="text-indigo-400 text-sm hover:underline"
          >
            View All
          </a>
        </div>

        <div className="space-y-3">
          {safeDiscussions.slice(0, 3).map((d) => (
            <a
              key={d.id || d._id}
              href="/discussions"
              className="block p-3 rounded-lg border border-white/6 hover:bg-white/5 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium line-clamp-1">
                  {d.title || "Untitled Discussion"}
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
          ))}
          {safeDiscussions.length === 0 && (
            <div className="text-slate-400 text-sm">
              No enrolled discussions yet.
            </div>
          )}
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Activity</h3>
          <a
            href="/dashboard"
            className="text-indigo-400 text-sm hover:underline"
          >
            View All
          </a>
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
