export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-2xl border border-border dark:border-white/10 bg-white dark:bg-gray-900 shadow-soft hover:shadow-soft-lg transition-all duration-200 p-6 text-center">
      {Icon ? <Icon className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-3" /> : null}
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm">{description}</p>
    </div>
  );
}


