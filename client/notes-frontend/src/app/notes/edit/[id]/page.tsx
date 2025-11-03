"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../../../components/UI";

export default function EditNotePage() {
  const router = useRouter();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchNote = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`http://localhost:5001/api/notes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setTitle(data.data.title);
          setContent(data.data.content);
        } else {
          alert(data.message || "Failed to fetch note ❌");
          router.push("/notes");
        }
      } catch (err) {
        console.error("❌ Error fetching note:", err);
        router.push("/notes");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchNote();
  }, [id, router]);

  // ✅ Handle save
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    
    // ✅ FIX: Use FormData to match the backend's 'upload.single("file")'
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    // Note: You are not sending 'isPublic' or 'tags' here. 
    // Your backend will keep the old values, which is fine.
    // If you add a file input, you would append it here:
    // if (file) formData.append("file", file);

    try {
      const res = await fetch(`http://localhost:5001/api/notes/${id}`, {
        method: "PUT",
        headers: {
          // ❌ DO NOT set 'Content-Type' when using FormData.
          // The browser sets it automatically with the correct 'boundary'.
          Authorization: `Bearer ${token}`,
        },
        body: formData, // ✅ FIX: Send FormData
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // alert("✅ Note updated successfully"); // Consider removing alerts
        router.push("/notes"); // ✅ FIX: Redirect to the correct page
      } else {
        alert(data.message || "Failed to update note ❌");
      }
    } catch (err) {
      console.error("❌ Error updating note:", err);
    }
  };

  if (loading) return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">✏️ Edit Note</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 text-lg"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              className="w-full h-40 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 text-lg"
            />
            <div className="flex justify-between gap-4">
              <Button
                onClick={() => router.push("/notes")}
                className="flex-1 py-3 text-lg bg-gray-600 hover:bg-gray-700 text-white rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
