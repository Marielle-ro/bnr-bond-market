import { FC } from "react";
import { useAuth } from "../../context/AuthContext";

interface TopbarProps {
  title: string;
}

const Topbar: FC<TopbarProps> = ({ title }) => {
  const { user } = useAuth();

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="ml-80">
          <h1 className="text-2xl font-bold text-primary capitalize">
            {title}
          </h1>
          <p className="text-sm text-neutral mt-1">
            Manage your bond market operations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-medium text-dark">{(user as any)?.fullName || "Admin"}</p>
            <p className="text-xs text-neutral">{user?.role}</p>
          </div>
          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold">
            {(user as any)?.fullName?.charAt(0) || "A"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
