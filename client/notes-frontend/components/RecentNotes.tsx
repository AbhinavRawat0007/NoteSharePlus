"use client";

import { Clock, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from "./UI"; // adjust imports based on your setup

export default function RecentNotes({ notes }: { notes: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Notes</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-400 hover:text-blue-300"
        >
          View All <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notes.length > 0 ? (
            notes.slice(0, 5).map((note) => (
              <div
                key={note._id}
                className="p-4 rounded-lg border border-gray-800 hover:border-blue-700 hover:bg-gray-800/50 transition-all duration-200"
              >
                {/* Title + Link */}
                {note.file ? (
                  <a
                    href={`http://localhost:5001/uploads/${note.file}`} // ✅ fixed path
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-white hover:underline line-clamp-1"
                  >
                    {note.title}
                  </a>
                ) : (
                  <h3 className="font-semibold text-white line-clamp-1">
                    {note.title}
                  </h3>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {note.isPublic && (
                    <Badge className="text-xs bg-green-900 text-green-300">
                      Public
                    </Badge>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No notes yet. Create your first one!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
