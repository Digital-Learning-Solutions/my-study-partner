import { Link, useLocation } from "react-router-dom";

export default function CourseModulesPage() {
  const location = useLocation();
  const modules = location.state;
  console.log(modules);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Maths</h1>
      <p className="text-gray-600 mb-6">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum ratione
        error veritatis nemo culpa incidunt neque repellendus dignissimos
        doloribus vero corporis maiores et, qui consequatur deserunt quidem
        nihil sequi perspiciatis!
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {modules.map((mod) => (
          <Link
            to={`${mod.title.toLowerCase().split(" ").join("-")}`}
            state={{
              classes: mod.classes,
              title: mod.title,
              content: mod.content,
            }}
            key={mod.id}
          >
            <div
              key={mod.id}
              className="border rounded-xl p-4 shadow hover:bg-blue-50 transition cursor-pointer"
            >
              <h3 className="font-semibold">{mod.title}</h3>
              <p className="text-sm text-gray-600">Classes: {mod.classCount}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
