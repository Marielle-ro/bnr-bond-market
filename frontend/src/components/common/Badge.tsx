import React, { FC } from "react";

interface BadgeProps {
  variant?: "approved" | "pending" | "suspended" | "active" | "inactive";
  children: React.ReactNode;
}

const Badge: FC<BadgeProps> = ({ variant = "active", children }) => {
  const styles: Record<string, string> = {
    approved:  "bg-green-50 text-green-700 border-green-200",
    pending:   "bg-yellow-50 text-yellow-700 border-yellow-200",
    suspended: "bg-red-50 text-red-700 border-red-200",
    active:    "bg-gray-100 text-gray-700 border-gray-200",
    inactive:  "bg-gray-50 text-gray-400 border-gray-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 border text-xs font-medium rounded-sm ${styles[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;
