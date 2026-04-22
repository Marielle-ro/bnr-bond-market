import { FC, ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface AdminLayoutProps {
  children: ReactNode;
  currentPage: string;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children, currentPage }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} />
      <div className="flex flex-col flex-1">
        <Topbar title={currentPage} />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
