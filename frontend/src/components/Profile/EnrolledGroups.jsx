export default function EnrolledGroups({ groups }) {
  console.log("Rendering EnrolledGroups with groups:", groups);
  if (!groups?.length)
    return (
      <p className="text-gray-600 dark:text-gray-300">
        You haven't joined any quiz groups yet.
      </p>
    );

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400">
        Enrolled Quiz Groups
      </h2>

      <div className="space-y-4">
        {groups.map((item) => (
          <div
            key={item.group}
            className="
              border p-4 rounded-xl shadow-sm 
              bg-indigo-50 border-indigo-200 
              dark:bg-zinc-800 dark:border-zinc-700
            "
          >
            <p className="text-gray-800 dark:text-gray-200">
              <span className="font-semibold">Group Name:</span>{" "}
              {item?.group?.name}
            </p>

            <p className="text-gray-800 dark:text-gray-200">
              <span className="font-semibold">Joined At:</span>{" "}
              {new Date(item.joinedAt).toLocaleString()}
            </p>

            <p className="font-semibold mt-2 text-gray-900 dark:text-gray-100">
              Stats:
            </p>

            <ul className="ml-4 list-disc text-sm text-gray-700 dark:text-gray-300">
              <li>Total Games: {item.stats.totalGames}</li>
              <li>Total Score: {item.stats.totalScore}</li>
              <li>Best Score: {item.stats.bestScore}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
