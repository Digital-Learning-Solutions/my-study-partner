export default function EnrolledGroups({ groups }) {
  if (!groups?.length)
    return (
      <p className="text-gray-600">You haven't joined any quiz groups yet.</p>
    );

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
        Enrolled Quiz Groups
      </h2>
      <div className="space-y-4">
        {groups.map((item) => (
          <div
            key={item.group}
            className="border p-4 rounded-xl shadow-sm bg-indigo-50"
          >
            <p>
              <span className="font-semibold">Group ID:</span> {item.group}
            </p>
            <p>
              <span className="font-semibold">Joined At:</span>{" "}
              {new Date(item.joinedAt).toLocaleString()}
            </p>
            <p className="font-semibold mt-2">Stats:</p>
            <ul className="ml-4 list-disc text-sm">
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
