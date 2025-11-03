"use client";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";

export default function UserMenu({ user }: { user: any }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login"); // ✅ Redirect to login page
  };

  const goToProfile = () => {
    router.push("/profile"); // ✅ Change this if your profile page has a different route (e.g. /settings/profile)
  };

  const goToPreferences = () => {
    router.push("/preferences"); // ✅ Optional - link to preferences page if you plan to have one
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-800 rounded-lg transition-all duration-150">
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="hidden sm:block">
            <p className="text-white font-semibold">{user?.name || "Guest"}</p>
            <p className="text-xs text-gray-400">{user?.role || "Student"}</p>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-52 bg-gray-900 border border-gray-800 text-white rounded-xl shadow-lg"
      >
        <DropdownMenuItem
          onClick={goToProfile}
          className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-blue-400"
        >
          <User className="w-4 h-4 mr-2 text-blue-400" /> Profile Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-400 hover:bg-gray-800 focus:bg-gray-800 focus:text-red-500"
        >
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
