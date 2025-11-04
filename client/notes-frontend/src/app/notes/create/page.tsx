"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Upload, ArrowLeft } from "lucide-react";

export default function CreateNotePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("isPublic", String(isPublic));
      formData.append("tags", JSON.stringify(tags));
      if (file) formData.append("file", file);

      const res = await fetch(${process.env.NEXT_PUBLIC_API_URL}/api/notes, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/notes"); // ✅ Redirect to My Notes after saving
      } else {
        alert(data.message || "Failed to create note");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-black py-10 px-4">
      <div className="max-w-4xl mx-auto bg-gray-900 rounded-2xl shadow-xl p-8 space-y-8 border border-gray-800">
        
        {/* ✅ Back Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Create New Note</h1>
            <p className="text-gray-400">
              Capture your thoughts and lecture insights
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Note Details */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">
              Note Details
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Note Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
                required
              />
            </div>
          </section>

          {/* Note Content */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">
              Note Content
            </h2>
            <textarea
              placeholder="Write your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
              rows={6}
              required
            />
          </section>

          {/* Attachments & Organization */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">
              Attachments & Organization
            </h2>
            <div className="space-y-4">
              {/* Tags */}
              <div>
                <input
                  type="text"
                  placeholder="Add a tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-700 text-white rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* File Upload */}
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition">
                <Upload className="w-6 h-6 text-gray-400 mb-2" />
                <p className="text-gray-400">
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </section>

          {/* Public Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-300">
              Make note public to classmates
            </span>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
          >
            {loading ? "Saving..." : "Save Note"}
          </button>
        </form>
      </div>
    </div>
  );
}
