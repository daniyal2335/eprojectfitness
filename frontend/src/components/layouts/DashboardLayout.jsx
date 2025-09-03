import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({  exportCSV }) {
   const [user, setUser] = useState(null); 
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 lg:ml-64 min-h-screen bg-gray-100 p-4">
        <Navbar user={user} exportCSV={exportCSV} />
        <Outlet context={{ user, setUser }}/>
      </div>
    </div>
  );
}
