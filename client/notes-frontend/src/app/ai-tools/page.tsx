"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation"; // ✅ added usePathname
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from "../../../components/UI";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import {
  FileText,
  BookOpen,
  Home,
  Users,
  Star,
  Earth,
  LogOut,
} from "lucide-react";

export default function AIToolsPage() {
  const router = useRouter();
  const pathname = usePathname(); // ✅ get active path

  const [user, setUser] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [selectedNote, setSelectedNote] = useState<string>("");
  const [summaryType, setSummaryType] = useState("Brief");

  const [activeTab, setActiveTab] = useState("summarize");
  const [result, setResult] = useState("");

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // ✅ Fetch user & notes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const resUser = await fetch("http://localhost:5001/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataUser = await resUser.json();
        if (resUser.ok && dataUser.success) {
          setUser(dataUser.data);
        } else {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        const resNotes = await fetch("http://localhost:5001/api/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataNotes = await resNotes.json();
        if (resNotes.ok && dataNotes.success) {
          setNotes(dataNotes.data || []);
        }
      } catch (err) {
        console.error("❌ Failed to fetch AI Tools data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // ✅ Generic AI call
  const callAI = async (endpoint: string, body: any) => {
    setGenerating(true);
    setResult("");

    try {
      const token = localStorage.getItem("token");
      const note = notes.find((n) => n._id === selectedNote);

      const res = await fetch(`http://localhost:5001/api/ai/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: note?.content || "",
          ...body,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data.result);
      } else {
        setResult(data.message || "❌ Failed to process request");
      }
    } catch (err) {
      console.error("AI Call Error:", err);
      setResult("⚠️ Something went wrong.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <p className="text-center text-white mt-10">Loading...</p>;

  return (
    <div className="flex min-h-screen bg-black">
      {/* --- Sidebar --- */}
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
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Star className="w-10 h-10 text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold text-white">AI Tools</h1>
            <p className="text-gray-400 mt-2">
              Supercharge your notes with AI-powered tools: summarization,
              paraphrasing, questions, study guides, and key point extraction.
            </p>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(val) => {
              setActiveTab(val);
              setResult("");
            }}
            className="w-full"
          >
            <TabsList className="grid grid-cols-5 bg-gray-800 rounded-lg p-1">
              <TabsTrigger value="summarize">Summarize</TabsTrigger>
              <TabsTrigger value="paraphrase">Paraphrase</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="study">Study Guide</TabsTrigger>
              <TabsTrigger value="extract">Extract</TabsTrigger>
            </TabsList>

            {/* Summarize */}
            <TabsContent value="summarize" className="mt-6">
              <Card className="bg-gray-900 text-white border-gray-800">
                <CardHeader><CardTitle>AI Summarizer</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <select
                    className="w-full p-3 bg-black border border-gray-700 rounded-lg"
                    value={selectedNote}
                    onChange={(e) => setSelectedNote(e.target.value)}
                  >
                    <option value="">Choose a note</option>
                    {notes.map((note) => (
                      <option key={note._id} value={note._id}>{note.title}</option>
                    ))}
                  </select>
                  <select
                    className="w-full p-3 bg-black border border-gray-700 rounded-lg"
                    value={summaryType}
                    onChange={(e) => setSummaryType(e.target.value)}
                  >
                    <option value="Brief">Brief</option>
                    <option value="Detailed">Detailed</option>
                  </select>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={!selectedNote || generating}
                    onClick={() => callAI("summarize", { type: summaryType })}
                  >
                    {generating ? "Generating..." : "Generate Summary"}
                  </Button>
                  {result && (
                    <div className="bg-gray-800 p-4 rounded-lg whitespace-pre-wrap">{result}</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Paraphrase */}
            <TabsContent value="paraphrase" className="mt-6">
              <Card className="bg-gray-900 text-white border-gray-800">
                <CardHeader><CardTitle>AI Paraphraser</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <select
                    className="w-full p-3 bg-black border border-gray-700 rounded-lg"
                    value={selectedNote}
                    onChange={(e) => setSelectedNote(e.target.value)}
                  >
                    <option value="">Choose a note</option>
                    {notes.map((note) => (
                      <option key={note._id} value={note._id}>{note.title}</option>
                    ))}
                  </select>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={!selectedNote || generating}
                    onClick={() => callAI("paraphrase", {})}
                  >
                    {generating ? "Generating..." : "Paraphrase Note"}
                  </Button>
                  {result && (
                    <div className="bg-gray-800 p-4 rounded-lg whitespace-pre-wrap">{result}</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Questions */}
            <TabsContent value="questions" className="mt-6">
              <Card className="bg-gray-900 text-white border-gray-800">
                <CardHeader><CardTitle>Generate Questions</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <select
                    className="w-full p-3 bg-black border border-gray-700 rounded-lg"
                    value={selectedNote}
                    onChange={(e) => setSelectedNote(e.target.value)}
                  >
                    <option value="">Choose a note</option>
                    {notes.map((note) => (
                      <option key={note._id} value={note._id}>{note.title}</option>
                    ))}
                  </select>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={!selectedNote || generating}
                    onClick={() => callAI("questions", {})}
                  >
                    {generating ? "Generating..." : "Generate Questions"}
                  </Button>
                  {result && (
                    <div className="bg-gray-800 p-4 rounded-lg whitespace-pre-wrap">{result}</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Study */}
            <TabsContent value="study" className="mt-6">
              <Card className="bg-gray-900 text-white border-gray-800">
                <CardHeader><CardTitle>Study Guide</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <select
                    className="w-full p-3 bg-black border border-gray-700 rounded-lg"
                    value={selectedNote}
                    onChange={(e) => setSelectedNote(e.target.value)}
                  >
                    <option value="">Choose a note</option>
                    {notes.map((note) => (
                      <option key={note._id} value={note._id}>{note.title}</option>
                    ))}
                  </select>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={!selectedNote || generating}
                    onClick={() => callAI("study", {})}
                  >
                    {generating ? "Generating..." : "Generate Study Guide"}
                  </Button>
                  {result && (
                    <div className="bg-gray-800 p-4 rounded-lg whitespace-pre-wrap">{result}</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Extract */}
            <TabsContent value="extract" className="mt-6">
              <Card className="bg-gray-900 text-white border-gray-800">
                <CardHeader><CardTitle>Extract Key Points</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <select
                    className="w-full p-3 bg-black border border-gray-700 rounded-lg"
                    value={selectedNote}
                    onChange={(e) => setSelectedNote(e.target.value)}
                  >
                    <option value="">Choose a note</option>
                    {notes.map((note) => (
                      <option key={note._id} value={note._id}>{note.title}</option>
                    ))}
                  </select>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={!selectedNote || generating}
                    onClick={() => callAI("extract", {})}
                  >
                    {generating ? "Generating..." : "Extract Key Points"}
                  </Button>
                  {result && (
                    <div className="bg-gray-800 p-4 rounded-lg whitespace-pre-wrap">{result}</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
