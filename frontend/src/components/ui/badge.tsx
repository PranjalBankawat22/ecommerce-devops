type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error";
};

const variants = {
  default: "bg-indigo-50 text-indigo-700",
  success: "bg-green-50 text-green-700",
  warning: "bg-amber-50 text-amber-700",
  error: "bg-red-50 text-red-700",
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
