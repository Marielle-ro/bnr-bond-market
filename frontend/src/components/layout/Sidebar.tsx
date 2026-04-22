import { FC } from "react";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  currentPage: string;
}

const Sidebar: FC<SidebarProps> = ({ currentPage }) => {
  const { logout } = useAuth();

  const navItems = [
    { label: "Overview", value: "overview" },
    { label: "Brokers", value: "brokers" },
    { label: "Investors", value: "investors" },
    { label: "Bonds", value: "bonds" },
    { label: "Settings", value: "settings" },
  ];

  return (
    <div className="w-80 bg-primary text-white fixed h-screen overflow-y-auto shadow-lg">
      {/* Logo Section */}
      <div className="p-6 border-b border-secondary border-opacity-20">
        <h1 className="text-2xl font-bold text-secondary">BNR</h1>
        <p className="text-sm text-gray-300 mt-1">Bond Market</p>
      </div>

      {/* Navigation */}
      <nav className="pt-6">
        {navItems.map((item) => (
          <button
            key={item.value}
            className={`w-full text-left px-6 py-3 flex items-center gap-3 transition-all duration-200 ${
              currentPage === item.value
                ? "bg-secondary bg-opacity-20 text-secondary border-l-4 border-secondary"
                : "text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-5"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-full p-6 border-t border-secondary border-opacity-20">
        <button
          onClick={logout}
          className="w-full px-4 py-2 bg-secondary bg-opacity-20 text-secondary rounded-lg font-medium hover:bg-opacity-30 transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
