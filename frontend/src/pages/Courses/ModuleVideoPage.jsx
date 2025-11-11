import { useState } from "react";
import { useLocation } from "react-router-dom";
import ReactPlayer from "react-player";
import QuizSection from "./QuizSection";

export default function ModuleVideosPage() {
  const location = useLocation();
  const { classes, title, content, courseId } = location.state;

  const [activeVideo, setActiveVideo] = useState(classes[0] || null);

  function extractYouTubeId(url) {
    const regExp =
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200">
      {/* Left Sidebar */}
      <aside className="md:w-1/4 w-full bg-white dark:bg-slate-800 border-r shadow-md">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{content}</p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {classes?.map((cls) => (
            <li
              key={cls.id}
              onClick={() => setActiveVideo(cls)}
              className={`p-4 cursor-pointer transition-colors duration-200 
                ${
                  activeVideo?.id === cls.id
                    ? "bg-blue-100 dark:bg-blue-700"
                    : "hover:bg-blue-50 dark:hover:bg-blue-800"
                }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-100">
                  {cls.title}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {cls.duration} min
                </span>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Right Content Area */}
      <main className="flex-1 p-6">
        {activeVideo ? (
          <>
            <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              {activeVideo.title}
            </h1>
            <div className="relative w-full rounded-xl overflow-hidden shadow-lg aspect-video">
              <iframe
                key={activeVideo.id}
                src={`https://www.youtube.com/embed/${extractYouTubeId(
                  activeVideo.videoUrl
                )}`}
                title={activeVideo.title}
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Quiz Section */}
            <QuizSection
              title={activeVideo.title}
              videoUrl={activeVideo.videoUrl}
              id={activeVideo.id}
              courseId={courseId}
            />
          </>
        ) : (
          <p className="text-gray-700 dark:text-gray-400">
            Select a video from the sidebar to start learning.
          </p>
        )}
      </main>
    </div>
  );
}
