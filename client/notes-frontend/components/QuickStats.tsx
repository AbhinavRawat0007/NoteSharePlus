"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "./UI";
import { FileText, Eye, Users, TrendingUp } from "lucide-react";

export default function QuickStats({ notes }: { notes: any[] }) {
  const totalNotes = notes.length;
  const totalViews = notes.reduce((acc, n) => acc + (n.views || 0), 0);
  const thisWeekNotes = notes.filter((n) => {
    const created = new Date(n.createdAt);
    const now = new Date();
    const diff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;

  const statCards = [
    { title: "My Notes", value: totalNotes, icon: FileText, change: `+${thisWeekNotes} this week` },
    { title: "Total Views", value: totalViews, icon: Eye, change: "Across all notes" },
    { title: "This Week", value: thisWeekNotes, icon: TrendingUp, change: "Notes created" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
