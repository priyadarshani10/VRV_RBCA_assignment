"use client";
import React, { useState } from "react";
import { Settings, LogOut, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const path = usePathname();
  const router = useRouter();
  return (
    <nav className={`${path.includes('dashboard') ? 'bg-indigo-500' : 'bg-slate-900'} text-white shadow-gray-300 shadow-md px-4 py-2 flex justify-between items-center`}>
      <div className="text-xl font-semibold hover:cursor-pointer" onClick={() => router.push("/")}>
        <span>Wiz Academy</span>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none"
        >
          <User className="w-5 h-5 text-white" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-300 rounded-md shadow-lg z-10">
            <ul className="py-1 text-gray-700">
              <li>
                <a
                  href="/settings"
                  className="flex items-center px-4 py-2 hover:bg-gray-400 text-black"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </a>
              </li>
              <li>
                <a
                  href="/"
                  onClick={() => alert("Logging out...")}
                  className="flex items-center w-full px-4 py-2 hover:bg-gray-400 text-black"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
