export function Button({
  children,
  className = "",
  onClick,
  type = "button",
  disabled = false,
  size = "default",
  variant = "primary",
}) {
  const sizeClasses = {
    sm: "h-9 px-4 text-sm",
    default: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base",
  };

  const variantClasses = {
    primary:
      "bg-[#2E5077] text-white hover:bg-[#25425f] shadow-sm shadow-slate-900/10",
    secondary:
      "bg-white text-slate-900 border border-slate-200/80 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-900 hover:bg-slate-100/70",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    link: "bg-transparent text-[#2E5077] hover:underline",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-[var(--radius-card)] font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E5077]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
