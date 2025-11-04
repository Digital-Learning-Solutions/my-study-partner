export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-border bg-white shadow-soft hover:shadow-soft-lg transition-all duration-200 dark:bg-gray-900 dark:border-white/10 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}


