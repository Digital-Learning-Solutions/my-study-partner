export default function Button({ variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-soft hover:shadow-soft-lg hover:scale-105 focus:ring-brand-600',
    ghost: 'text-brand-700 hover:bg-brand-50 hover:scale-105 focus:ring-brand-600',
    outline: 'border border-border text-slate-700 hover:bg-muted hover:scale-105 focus:ring-brand-600 dark:text-slate-200 dark:border-white/10 dark:hover:bg-white/5',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}


