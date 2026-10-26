const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-9 w-9",
};

export default function Spinner({
  size = "md",
  label = "Loading…",
  className = "",
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-3 text-sm text-slate-600 ${className}`}
    >
      <span
        aria-hidden="true"
        className={`animate-spin rounded-full border-2 border-slate-200 border-t-[#071a33] ${
          sizeClasses[size] ?? sizeClasses.md
        }`}
      />
      <span>{label}</span>
    </div>
  );
}
