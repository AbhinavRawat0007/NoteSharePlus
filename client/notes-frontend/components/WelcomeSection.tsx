"use client";

import { useEffect, useState } from "react";
import { Card, Badge } from "./UI";
import { BookOpen } from "lucide-react";

export default function WelcomeSection({ user }: { user: any }) {
  const [greeting, setGreeting] = useState("");

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    if (hour < 22) return "Good evening";
    return "Late Night Study Nice";
  };

  useEffect(() => {
    // set initial greeting
    setGreeting(getGreeting());

    // update greeting every minute
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white border-none shadow-2xl overflow-hidden relative">
      <div className="p-8 relative">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {greeting}, {user?.name?.split(" ")[0] || "Student"}!
        </h1>
        <p className="text-blue-100 text-lg mb-4 max-w-2xl">
          Ready to share knowledge and collaborate with your classmates today?
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-white/20 text-white border-white/30">
            <BookOpen className="w-3 h-3 mr-1" />
            {user?.email}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
