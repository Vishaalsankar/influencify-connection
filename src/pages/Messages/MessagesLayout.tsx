
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface Conversation {
  id: string;
  brand_id: string;
  influencer_id: string;
  created_at: string;
  updated_at: string;
  profile?: {
    name: string;
    role: string;
  };
  latest_message?: {
    content: string;
    created_at: string;
  };
}

export default function MessagesLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    async function fetchConversations() {
      setLoading(true);
      try {
        const isInfluencer = user.role === "influencer";
        const idField = isInfluencer ? "influencer_id" : "brand_id";
        const otherField = isInfluencer ? "brand_id" : "influencer_id";

        // Get all conversations for the current user
        const { data, error } = await supabase
          .from("conversations")
          .select(`
            *,
            profiles:${otherField}(name, role)
          `)
          .eq(idField, user.id);

        if (error) throw error;

        if (data) {
          // For each conversation, get the latest message
          const conversationsWithLatestMessage = await Promise.all(
            data.map(async (conversation) => {
              const { data: messageData } = await supabase
                .from("messages")
                .select("content, created_at")
                .eq("conversation_id", conversation.id)
                .order("created_at", { ascending: false })
                .limit(1);

              return {
                ...conversation,
                latest_message: messageData?.[0] || null,
              };
            })
          );

          setConversations(conversationsWithLatestMessage);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchConversations();
  }, [user, navigate]);

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) => {
    const profileName = conversation.profile?.name || "";
    return profileName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            // Loading state
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 border-b flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => {
              const otherUser = conversation.profile;
              return (
                <Button
                  key={conversation.id}
                  variant="ghost"
                  className="w-full justify-start p-3 h-auto border-b rounded-none"
                  onClick={() => navigate(`/messages/${conversation.id}`)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage
                        src={`https://ui-avatars.com/api/?name=${otherUser?.name || "User"}&background=8B5CF6&color=fff`}
                      />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="font-medium truncate">{otherUser?.name || "Unknown User"}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {conversation.latest_message?.content || "No messages yet"}
                      </p>
                      {conversation.latest_message && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(conversation.latest_message.created_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </Button>
              );
            })
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              {searchQuery ? "No conversations match your search" : "No conversations yet"}
            </div>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}
