import { FC, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const Button: FC<ButtonProps> = ({ variant = "primary", size = "md", fullWidth, className = "", children, ...props }) => {
  const base = "font-medium transition-colors rounded-sm";
  const variants = {
    primary:   "bg-black text-white hover:bg-gray-800",
    secondary: "bg-gray-700 text-white hover:bg-gray-600",
    outline:   "border border-gray-300 text-gray-700 hover:bg-gray-50",
    danger:    "bg-red-600 text-white hover:bg-red-700",
  };
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
