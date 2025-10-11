// src/components/Tabs.jsx
export default function Tabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="flex gap-4 border-b border-gray-300 dark:border-gray-700 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-2 ${
            activeTab === tab
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-300"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
