"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Users,
  Star,
  BookOpen,
  Home,
  Earth,
} from "lucide-react";

// ✅ Use relative imports instead of "@"
import WelcomeSection from "../../../components/WelcomeSection";
import QuickStats from "../../../components/QuickStats";
import RecentNotes from "../../../components/RecentNotes";
import SideBar from "../../../components/SideBar";
import UserMenu from "../../../components/UserMenu"; // 👈 import UserMenu

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // fetch user
        const resUser = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notes`, {
         headers: { Authorization: `Bearer ${token}` },
           });

        const dataUser = await resUser.json();
        if (!resUser.ok || !dataUser.success) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        setUser(dataUser.data);

        // fetch notes
       const resNotes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataNotes = await resNotes.json();
        if (resNotes.ok && dataNotes.success) {
          setNotes(dataNotes.data || []);
        }
      } catch (err) {
        console.error(err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) return <p className="text-center mt-10 text-white">Loading...</p>;
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-900 p-6 border-r border-gray-800 hidden lg:flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-white">NoteShare+</span>
          </div>
          <nav className="space-y-2">
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 text-white bg-blue-600 rounded-lg"
            >
              <Home className="w-5 h-5" />
              Dashboard
            </a>
            <a
              onClick={() => router.push("/notes")}
              className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg"
            >
              <FileText className="w-5 h-5" />
              My Notes
            </a>
            <a
              onClick={() => router.push("/ai-tools")}
              className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg"
            >
              <Star className="w-5 h-5" />
              AI Tools
            </a>
            <a
              onClick={() => router.push("/public-notes")}
              className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg"
            >
              <Earth className="w-5 h-5" />
              Public Notes
            </a>
          </nav>
        </div>

        {/* ✅ Replace static footer with UserMenu */}
        <UserMenu user={user} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <WelcomeSection user={user} />
          <QuickStats notes={notes} />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <RecentNotes notes={notes} />
            </div>
            <div>
              <SideBar user={user} /> {/* ✅ pass user to SideBar */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
