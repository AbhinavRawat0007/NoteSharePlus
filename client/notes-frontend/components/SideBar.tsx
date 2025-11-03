"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle, Button } from "./UI";
import { Plus, Users, Star } from "lucide-react";
import UserMenu from "./UserMenu";

export default function SideBar({ user }: { user: { name: string; role?: string } }) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Replace old static user section with UserMenu */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={() => router.push("/notes/create")}
            className="w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Note
          </Button>
          <Button
            onClick={() => router.push("/ai-tools")}
            variant="outline"
            className="w-full justify-start border-purple-800 text-purple-300 hover:bg-purple-900/50"
          >
            <Star className="w-4 h-4 mr-2" />
            Try AI Tools
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
