// components/UI.tsx
"use client";

export const Button = ({ children, className, variant, ...props }: any) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none";
  const variantClasses =
    variant === "outline"
      ? "border border-gray-700 hover:bg-gray-800 text-gray-300"
      : "text-white";
  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className, ...props }: any) => (
  <div
    className={`rounded-2xl border bg-gray-900 border-gray-800 shadow-lg ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className, ...props }: any) => (
  <div className={`flex flex-row items-center justify-between p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }: any) => (
  <h3 className={`text-lg font-semibold text-white ${className}`} {...props}>
    {children}
  </h3>
);

export const CardContent = ({ children, className, ...props }: any) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

export const Badge = ({ children, className, ...props }: any) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    {...props}
  >
    {children}
  </span>
);
