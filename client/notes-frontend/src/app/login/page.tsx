"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token); // store JWT
        alert("✅ Login successful!");
        window.location.href = "/dashboard"; // redirect to dashboard
      } else {
        alert(data.message || "❌ Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ Could not connect to backend. Is it running?");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 via-blue-900 to-black">
      <div className="w-full max-w-md rounded-2xl bg-white/10 p-8 shadow-xl backdrop-blur-md border border-white/20">
        {/* Logo + Title */}
        <div className="text-center mb-6">
          <div className="mx-auto h-12 w-12 rounded-full bg-blue-500/80 flex items-center justify-center">
            <span className="text-white text-xl font-bold">N</span>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white">Welcome Back</h2>
          <p className="mt-1 text-sm text-gray-300">
            Please enter your details to log in.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/10 p-3 text-white placeholder-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/10 p-3 text-white placeholder-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200"
            required
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 transition flex items-center justify-center"
          >
            Log In →
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
}
