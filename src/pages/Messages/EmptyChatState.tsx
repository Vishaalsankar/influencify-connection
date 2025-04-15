
import React from "react";
import { MessageSquare } from "lucide-react";

export default function EmptyChatState() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <div className="bg-muted rounded-full p-6 mb-4">
        <MessageSquare className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-bold mb-2">Your messages</h2>
      <p className="text-muted-foreground max-w-md">
        Select a conversation from the sidebar or start a new conversation with an influencer from the "Find Influencers" page.
      </p>
    </div>
  );
}
