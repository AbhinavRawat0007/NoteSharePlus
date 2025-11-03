"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/UI"; // Removed unused Card imports
import { Input } from "../../components/ui/input";
import { BookOpen, LogOut, X, Save, User as UserIcon } from "lucide-react";

// Helper component for styled labels
// Helper component for styled labels
const Label = ({ htmlFor, children }: { htmlFor: string, children: string }) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-medium text-gray-400 mb-2"
  >
    {children}
  </label>
);
export default function ProfileSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    academicYear: "",
    major: "",
    bio: "",
    studyPreferences: [] as string[],
  });
  const [newPref, setNewPref] = useState("");

  // ✅ Fetch current user profile (No changes)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("❌ Failed to fetch user:", res.statusText);
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (data?.success && data?.data) {
          const u = data.data;
          setUser(u);
          setFormData({
            name: u.name || "",
            university: u.university || "",
            academicYear: u.academicYear || "",
            major: u.major || "",
            bio: u.bio || "",
            studyPreferences: Array.isArray(u.studyPreferences)
              ? u.studyPreferences
              : [],
          });
        } else {
          console.warn("⚠️ No valid user data received:", data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // ✅ Add preference (No changes)
  const addPreference = () => {
    if (!newPref.trim()) return;
    setFormData((prev) => ({
      ...prev,
      studyPreferences: [...prev.studyPreferences, newPref.trim()],
    }));
    setNewPref("");
  };

  // ✅ Remove preference (No changes)
  const removePreference = (pref: string) => {
    setFormData((prev) => ({
      ...prev,
      studyPreferences: prev.studyPreferences.filter((p) => p !== pref),
    }));
  };

  // ✅ Save all changes
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5001/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.data);
        alert("✅ Profile updated successfully!");
      } else {
        alert(data.message || "Failed to update profile ❌");
      }
    } catch (err) { // ✅ FIXED: Added curly braces here
      console.error("❌ Error updating profile:", err);
    } // ✅ FIXED: Added curly braces here
  };

  if (loading)
    return <p className="text-white text-center mt-10">Loading profile...</p>;

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar (No changes) */}
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
              className="block px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white cursor-pointer"
            >
              Dashboard
            </a>
            <a
              onClick={() => router.push("/notes")}
              className="block px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white cursor-pointer"
            >
              My Notes
            </a>
            <a
              onClick={() => router.push("/public-notes")}
              className="block px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white cursor-pointer"
            >
              Public Notes
            </a>
            <a
              onClick={() => router.push("/ai-tools")}
              className="block px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white cursor-pointer"
            >
              AI Tools
            </a>
            <a
              onClick={() => router.push("/profile")}
              className="block px-4 py-2 rounded-lg bg-blue-600 text-white cursor-pointer"
            >
              Profile
            </a>
          </nav>
        </div>

        {/* Footer user info (No changes) */}
        {user && (
          <div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-xs text-gray-400">Student</p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
              }}
              className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg w-full"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        )}
      </aside>

      {/* --- Main Content (RE-STYLED) --- */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          <p className="text-gray-400 mt-2">
            Manage your account information and preferences
          </p>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* --- Column 1: Profile Picture --- */}
            <div className="lg:col-span-1">
              <h2 className="text-lg font-semibold text-white">
                Profile Picture
              </h2>
              <div className="mt-4 p-6 bg-gray-900 rounded-lg border border-gray-800 flex flex-col items-center">
                <div className="w-40 h-40 rounded-full bg-gray-800 flex items-center justify-center text-6xl font-bold text-gray-500">
                  {user?.name?.charAt(0).toUpperCase() || <UserIcon size={80} />}
                </div>
              </div>
            </div>

            {/* --- Column 2: Personal Info & Preferences --- */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* --- Personal Info Form --- */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">
                  Personal Information
                </h2>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Aditya Bhatt"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="university">University</Label>
                    <Input
                      id="university"
                      placeholder="e.g., Harvard University"
                      value={formData.university}
                      onChange={(e) =>
                        setFormData({ ...formData, university: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="academicYear">Academic Year</Label>
                    <select
                      id="academicYear"
                      className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg" // Using your old select style
                      value={formData.academicYear}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          academicYear: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Year</option>
                      <option value="First Year">First Year</option>
                      <option value="Second Year">Second Year</option>
                      <option value="Third Year">Third Year</option>
                      <option value="Final Year">Final Year</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="major">Major/Field of Study</Label>
                  <Input
                    id="major"
                    placeholder="e.g., Computer Science"
                    value={formData.major}
                    onChange={(e) =>
                      setFormData({ ...formData, major: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    placeholder="Tell others about your academic interests and study focus..."
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-sm" // Using your old textarea style
                    rows={4}
                  />
                </div>
              </div>

              {/* --- Preferences Form --- */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">
                  Study Preferences
                </h2>
                <div>
                  <Label htmlFor="addPref">Add Study Preferences</Label>
                  <div className="flex gap-2">
                    <Input
                      id="addPref"
                      placeholder="e.g., Visual Learning, Group Study, Flashcards"
                      value={newPref}
                      onChange={(e) => setNewPref(e.target.value)}
                    />
                    <Button
                      onClick={addPreference}
                      className="bg-blue-600 hover:bg-blue-700 px-4"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Current Preferences</label>
                  {formData.studyPreferences.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.studyPreferences.map((pref, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1 bg-blue-700/40 border border-blue-500 px-3 py-1 rounded-full text-sm"
                        >
                          {pref}
                          <X
                            className="w-4 h-4 ml-1 cursor-pointer hover:text-red-400"
                            onClick={() => removePreference(pref)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                   <p className="text-gray-500 text-sm">
                      No study preferences added yet
                    </p>
                  )}
                </div>
              </div>

              {/* --- Save Button --- */}
              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-base font-semibold flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </Button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}