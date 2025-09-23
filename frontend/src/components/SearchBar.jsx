export default function SearchBar() {
  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <input
        type="text"
        placeholder="Search for courses..."
        className="w-full p-4 rounded-2xl shadow-md text-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
      />
    </div>
  );
}
