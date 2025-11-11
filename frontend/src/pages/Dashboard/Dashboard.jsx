import { useEffect, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from 'recharts';

const API_URL = import.meta?.env?.VITE_API_URL || 'http://localhost:5000';
const COLORS = ['#34d399', '#60a5fa', '#a78bfa', '#fbbf24', '#f87171'];

export default function Dashboard() {
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
    const [showCourses, setShowCourses] = useState(false);
    // Streak state (tracked per-user in localStorage). Uses YYYY-MM-DD dates.
    const [streak, setStreak] = useState(0);

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
            ...(json.courses || {}),
            detail: Array.isArray(json.courses?.detail) ? json.courses.detail : [],
            totalEnrolled: Number(json.courses?.totalEnrolled) || 0,
            completedCourses: Number(json.courses?.completedCourses) || 0,
            avgCourseProgress: Number(json.courses?.avgCourseProgress) || 0,
            totalClasses: Number(json.courses?.totalClasses) || 0,
            watchedClasses: Number(json.courses?.watchedClasses) || 0,
          },
          quiz: json.quiz || { totalQuizzesPlayed: 0, totalCorrect: 0, averageScore: 0 },
          updatedAt: json.updatedAt,
        };
        setData(safe);
        setError('');
      } catch (e) {
        if (cancelled) return;
        setError('Failed to load dashboard data.');
        setData({
          courses: { totalEnrolled: 0, completedCourses: 0, avgCourseProgress: 0, totalClasses: 0, watchedClasses: 0, detail: [] },
          quiz: { totalQuizzesPlayed: 0, totalCorrect: 0, averageScore: 0 },
          updatedAt: new Date().toISOString(),
        });
      }
    };
    fetchData();
    return () => { cancelled = true; };
    // Update daily visit streak (simple localStorage-backed implementation).
    // Keyed by userId when available so each user has their own streak.
    try {
      const key = userId ? `streak_${userId}` : 'streak_guest';
      const getYMD = (d) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };
      const todayStr = getYMD(new Date());
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yestStr = getYMD(yesterday);

      const raw = localStorage.getItem(key);
      let obj = null;
      try { obj = raw ? JSON.parse(raw) : null; } catch (e) { obj = null; }

      if (!obj) {
        obj = { lastVisit: todayStr, streak: 1 };
        localStorage.setItem(key, JSON.stringify(obj));
        setStreak(obj.streak);
      } else if (obj.lastVisit === todayStr) {
        // already counted today
        setStreak(Number(obj.streak) || 0);
      } else if (obj.lastVisit === yestStr) {
        // consecutive day
        obj.streak = (Number(obj.streak) || 0) + 1;
        obj.lastVisit = todayStr;
        localStorage.setItem(key, JSON.stringify(obj));
        setStreak(obj.streak);
      } else {
        // reset streak
        obj.streak = 1;
        obj.lastVisit = todayStr;
        localStorage.setItem(key, JSON.stringify(obj));
        setStreak(obj.streak);
      }
    } catch (e) {
      // Ignore localStorage errors (e.g., private mode). Keep streak at 0.
      // console.warn('Streak init failed', e);
    }
  }, [userId]);

  const safeCourses = data?.courses || { totalEnrolled: 0, completedCourses: 0, avgCourseProgress: 0, totalClasses: 0, watchedClasses: 0, detail: [] };
  const safeQuiz = data?.quiz || { totalQuizzesPlayed: 0, totalCorrect: 0, averageScore: 0, byCourse: [] };
  const safeDiscussions = Array.isArray(data?.discussions?.enrolled) ? data.discussions.enrolled : [];
  const recentActivity = Array.isArray(data?.activity) ? data.activity : [];

  const pieData = useMemo(() => [
    { name: 'Completed', value: Number(safeCourses.completedCourses) || 0 },
    { name: 'In Progress', value: Math.max(0, (Number(safeCourses.totalEnrolled) || 0) - (Number(safeCourses.completedCourses) || 0)) },
  ], [safeCourses.completedCourses, safeCourses.totalEnrolled]);

  const progressBars = Array.isArray(safeCourses.detail) ? safeCourses.detail : [];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {!userId && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg">
          Please sign in first. No userId found in local storage.
        </div>
      )}

      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h2>
      {/* Streak badge aligned to the right, just below the header */}
      <div className="flex justify-end -mt-2 mb-4">
        <div className="text-right">
          <div className="text-xs text-slate-500">Streak</div>
          <div className="inline-block mt-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold px-3 py-1 rounded-full shadow-sm">
            {streak} {streak === 1 ? 'day' : 'days'}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          type="button"
          onClick={() => setShowCourses((s) => !s)}
          className="text-left bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow transition"
        >
          <p className="text-slate-500 text-sm flex items-center gap-2">
            Courses Enrolled
            <span className="text-xs text-blue-600 dark:text-blue-400">{showCourses ? 'Hide' : 'View'}</span>
          </p>
          <p className="text-3xl font-semibold mt-1">{safeCourses.totalEnrolled}</p>
        </button>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 text-sm">Courses Completed</p>
          <p className="text-3xl font-semibold mt-1">{safeCourses.completedCourses}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 text-sm">Avg Progress</p>
          <p className="text-3xl font-semibold mt-1">{safeCourses.avgCourseProgress}%</p>
        </div>
      </div>

      {showCourses && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Enrolled Courses</h3>
            <a href="/courses" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">Browse Courses</a>
          </div>
          <div className="space-y-4">
            {progressBars.length === 0 && (
              <div className="text-slate-500">No enrolled courses yet.</div>
            )}
            {progressBars.map((c) => {
              const courseLink = c.courseId && c.category ? `/courses/${encodeURIComponent(c.category)}/${c.courseId}` : (c.courseId ? `/courses/${c.courseId}` : '/courses');
              return (
                <a
                  key={c.id}
                  href={courseLink}
                  className="block border border-slate-200 dark:border-slate-700 rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                >
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700 dark:text-slate-200 line-clamp-1">
                      {c.title}
                      {c.subject && (
                        <span className="ml-2 text-xs text-slate-500">({c.subject})</span>
                      )}
                    </span>
                    <span className="text-slate-500">{Number(c.progress) || 0}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-3 bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${Number(c.progress) || 0}%` }} />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold mb-4">Course Completion Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold mb-4">Classes Watched</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={[{ name: 'Watched', value: Number(safeCourses.watchedClasses) || 0 }, { name: 'Total', value: Number(safeCourses.totalClasses) || 0 }]}>                    
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 text-sm">Quizzes Played</p>
          <p className="text-3xl font-semibold mt-1">{safeQuiz.totalQuizzesPlayed}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 text-sm">Total Correct</p>
          <p className="text-3xl font-semibold mt-1">{safeQuiz.totalCorrect}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 text-sm">Average Score</p>
          <p className="text-3xl font-semibold mt-1">{safeQuiz.averageScore}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold mb-4">Average Quiz Score by Course</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={(safeQuiz.byCourse || []).map(q => ({ name: q.title, avg: Number(q.averageScore) || 0 }))}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="avg" fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {(!safeQuiz.byCourse || safeQuiz.byCourse.length === 0) && (
            <div className="text-slate-500 text-sm mt-2">No quiz data yet.</div>
          )}
        </div>
<div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold mb-4">Overall Average Marks</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                {(() => {
                  const scored = Math.max(0, Math.min(100, Number(safeQuiz.averageScore) || 0));
                  const pie = [
                    { name: 'Scored', value: scored },
                    { name: 'Remaining', value: Math.max(0, 100 - scored) },
                  ];
                  return (
                    <>
                      <Pie data={pie} dataKey="value" nameKey="name" outerRadius={90} label>
                        {pie.map((entry, index) => (
                          <Cell key={`avg-cell-${index}`} fill={index === 0 ? '#60a5fa' : '#e5e7eb'} />
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
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Enrolled Discussions</h3>
          <a href="/discussions" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">View All</a>
        </div>
        <div className="space-y-3">
          {safeDiscussions.slice(0,3).map((d) => (
            <a key={d.id || d._id} href={`/discussions`} className="block p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition">
              <div className="flex items-center justify-between">
                <div className="text-slate-800 dark:text-slate-100 font-medium line-clamp-1">{d.title || 'Untitled Discussion'}</div>
                <div className="text-xs text-slate-500">{new Date(d.updatedAt || d.createdAt || Date.now()).toLocaleDateString()}</div>
              </div>
              {d.snippet && <div className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{d.snippet}</div>}
            </a>
          ))}
          {safeDiscussions.length === 0 && (
            <div className="text-slate-500 text-sm">No enrolled discussions yet.</div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Activity</h3>
          <a href="/dashboard" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">View All</a>
        </div>
        <div className="space-y-3">
          {recentActivity.slice(0,6).map((a, idx) => (
            <a key={a.id || idx} href={a.url || '#'} className="block p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition">
              <div className="flex items-center justify-between">
                <div className="text-slate-800 dark:text-slate-100 font-medium line-clamp-1">
                  {a.title || a.type || 'Activity'}
                </div>
                <div className="text-xs text-slate-500">{new Date(a.timestamp || Date.now()).toLocaleString()}</div>
              </div>
              {a.description && <div className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{a.description}</div>}
            </a>
          ))}
          {recentActivity.length === 0 && (
            <div className="text-slate-500 text-sm">No recent activity yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
    