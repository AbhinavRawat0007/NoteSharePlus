"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
} from "../../../components/UI";
import {
  FileText,
  Clock,
  Eye,
  Plus,
  Pencil,
  Trash,
  BookOpen,
  Home,
  Users,
  Star,
  Earth,
  LogOut,
} from "lucide-react";

export default function MyNotesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ fetch user + notes
  const fetchNotes = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      // fetch user
      const resUser = await fetch("http://localhost:5001/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataUser = await resUser.json();
      if (resUser.ok && dataUser.success) {
        setUser(dataUser.data);
      } else {
        localStorage.removeItem("token");
        router.push("/login");
      }

      // fetch notes
      const res = await fetch("http://localhost:5001/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotes(data.data || []);
      }
    } catch (err) {
      console.error("❌ Failed to fetch notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [router]);

  // ✅ delete note
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5001/api/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotes((prev) => prev.filter((n) => n._id !== id));
      } else {
        alert(data.message || "Failed to delete note ❌");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10 text-white">Loading...</p>;

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
              onClick={() => router.push("/dashboard")}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer ${
                pathname === "/dashboard"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Home className="w-5 h-5" />
              Dashboard
            </a>
            <a
              onClick={() => router.push("/notes")}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer ${
                pathname?.startsWith("/notes")
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <FileText className="w-5 h-5" />
              My Notes
            </a>
            <a
              onClick={() => router.push("/ai-tools")}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer ${
                pathname === "/ai-tools"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
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

        {/* footer user info */}
        {user && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-white font-semibold">{user?.name}</p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
              }}
              className="flex items-center gap-3 px-4 py-2 w-full text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        )}
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* header */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">📒 My Notes</h1>
            <Button
              onClick={() => router.push("/notes/create")}
              className="px-6 py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 rounded-xl shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" /> New Note
            </Button>
          </div>

          {/* list */}
          {notes.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">
              You haven’t created any notes yet.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {notes.map((note) => (
                <Card
                  key={note._id}
                  className="hover:border-blue-700 hover:bg-gray-800/50 transition-all duration-200"
                >
                  <CardHeader className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-white">
                      <FileText className="w-5 h-5 text-blue-400" />
                      {note.title}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => router.push(`/notes/edit/${note._id}`)}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 text-xs"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(note._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-300 line-clamp-2 mb-3">
                      {note.content}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {new Date(note.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-3 h-3" /> {note.views || 0}
                      </div>
                    </div>

                    {/* ✅ Fixed attachment link */}
                    {note.file && (
                      <a
                        href={`http://localhost:5001${note.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 text-sm mt-3 inline-block hover:underline"
                      >
                        📂 View Attachment
                      </a>
                    )}

                    {note.isPublic ? (
                      <Badge className="bg-green-900 text-green-300 mt-3">
                        Public
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-700 text-gray-300 mt-3">
                        Private
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
