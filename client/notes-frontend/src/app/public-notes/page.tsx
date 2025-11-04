"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/UI";
import { Input } from "@/components/ui/input";
// ✅ 1. Import ArrowLeft
import { FileText, Search, Eye, ArrowLeft } from "lucide-react";

export default function PublicNotesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public-notes?q=${search}`);

      const data = await res.json();
      if (res.ok && data.success) {
        setNotes(data.data);
      }
    } catch (err) {
      console.error("❌ Failed to fetch public notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [search]);

  if (loading)
    return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="flex min-h-screen bg-black">
      <main className="flex-1 p-6 max-w-6xl mx-auto space-y-6">
        {/* ✅ 2. Add the back button */}
        <button
          onClick={() => router.push("/notes")}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to My Notes
        </button>

        <h1 className="text-3xl font-bold text-white">🌍 Public Notes</h1>
        <p className="text-gray-400">Browse and learn from shared notes.</p>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search public notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700 text-white"
          />
        </div>

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <p className="text-gray-500 mt-6">No public notes found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {notes.map((note) => (
              <Card
                key={note._id}
                className="bg-gray-900 border-gray-800 hover:border-blue-600 cursor-pointer"
                onClick={() => router.push(`/public-notes/${note._id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <FileText className="w-5 h-5 text-blue-400" /> {note.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 line-clamp-2">{note.content}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <Eye className="w-4 h-4" /> {note.views} views
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
