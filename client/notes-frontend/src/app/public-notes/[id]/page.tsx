// app/public-notes/[id]/page.js

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";

export default function PublicNoteDetailPage() {
  const router = useRouter();
  const { id } = useParams(); // Gets the [id] from the URL
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchNoteAndIncrementView = async () => {
      try {
        // This calls your existing backend route that increments
        // the view count and returns the note data.
        const res = await fetch(
          `http://localhost:5001/api/public-notes/${id}/view`,
          {
            method: "POST", // Use POST as defined in your publicNotesRoutes.js
          }
        );

        if (!res.ok) {
          throw new Error("Note not found or not public");
        }

        const data = await res.json();
        if (data.success) {
          setNote(data.data);
        } else {
          alert(data.message || "Failed to load note");
          router.push("/public-notes");
        }
      } catch (err) {
        console.error("❌ Failed to fetch note:", err);
        router.push("/public-notes");
      } finally {
        setLoading(false);
      }
    };

    fetchNoteAndIncrementView();
  }, [id, router]);

  if (loading) {
    return <p className="text-white text-center mt-20">Loading note...</p>;
  }

  if (!note) {
    return <p className="text-white text-center mt-20">Note not found.</p>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <main className="max-w-3xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.push("/public-notes")}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Public Notes
        </button>

        {/* Note Header */}
        <h1 className="text-4xl font-bold text-white">{note.title}</h1>

        {/* Author Info */}
        <div className="flex items-center gap-3 text-gray-400">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span>{note.createdBy?.name || "Anonymous"}</span>
          </div>
          <span>•</span>
          <span>{new Date(note.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Attachment Link */}
        {note.file && (
          <a
            href={`http://localhost:5001${note.file}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
          >
            📂 View Attachment
          </a>
        )}

        {/* Note Content */}
        <div className="prose prose-invert prose-lg max-w-none bg-gray-900 border border-gray-800 p-6 rounded-lg">
          {/* Use 'whitespace-pre-wrap' to respect newlines from the textarea */}
          <p style={{ whiteSpace: "pre-wrap" }}>{note.content}</p>
        </div>
      </main>
    </div>
  );
}