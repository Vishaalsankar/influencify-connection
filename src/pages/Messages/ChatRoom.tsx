
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, User, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  conversation_id: string;
  is_read: boolean;
}

interface ChatProfile {
  id: string;
  name: string;
  role: string;
}

export default function ChatRoom() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherProfile, setOtherProfile] = useState<ChatProfile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!conversationId) {
      return;
    }

    async function fetchConversation() {
      try {
        const isInfluencer = user.role === "influencer";
        const otherField = isInfluencer ? "brand_id" : "influencer_id";

        // Get conversation details
        const { data: conversationData, error: conversationError } = await supabase
          .from("conversations")
          .select(`
            *,
            profiles:${otherField}(id, name, role)
          `)
          .eq("id", conversationId)
          .single();

        if (conversationError) throw conversationError;
        
        if (conversationData && conversationData.profiles) {
          // Fix: Check if profiles contains the expected properties before assigning
          const profileData = conversationData.profiles;
          // Only set otherProfile if the data has the required fields
          if (
            typeof profileData === 'object' && 
            'id' in profileData && 
            'name' in profileData && 
            'role' in profileData
          ) {
            setOtherProfile(profileData as ChatProfile);
          } else {
            console.error("Invalid profile data format:", profileData);
          }
        }

        // Get messages
        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true });

        if (messagesError) throw messagesError;
        
        if (messagesData) {
          setMessages(messagesData);
        }

        // Mark messages as read
        if (messagesData && messagesData.length > 0) {
          const unreadMessages = messagesData.filter(
            (msg) => !msg.is_read && msg.sender_id !== user.id
          );
          
          if (unreadMessages.length > 0) {
            await supabase
              .from("messages")
              .update({ is_read: true })
              .in("id", unreadMessages.map((msg) => msg.id));
          }
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
        toast({
          title: "Error",
          description: "Could not load the conversation",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchConversation();

    // Subscribe to new messages
    const channel = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((current) => [...current, newMsg]);
          
          // Mark message as read if it's not from the current user
          if (newMsg.sender_id !== user.id) {
            supabase
              .from("messages")
              .update({ is_read: true })
              .eq("id", newMsg.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !conversationId) return;

    setSending(true);
    try {
      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        content: newMessage.trim(),
        sender_id: user.id,
      });

      if (error) throw error;
      
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Could not send your message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {};
  messages.forEach((message) => {
    const date = formatDate(message.created_at);
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  return (
    <>
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between">
        {loading ? (
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-40" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${otherProfile?.name || "User"}&background=8B5CF6&color=fff`}
              />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-bold text-lg">{otherProfile?.name || "Unknown User"}</h2>
              <p className="text-sm text-muted-foreground capitalize">
                {otherProfile?.role || ""}
              </p>
            </div>
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive" 
              onClick={() => {
                // For a real app, you might want to archive the conversation instead
                navigate("/messages");
              }}
            >
              Delete Conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
            >
              <div className={`max-w-[80%] flex gap-2 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className={`h-20 w-60 rounded-md`} />
                  <Skeleton className="h-3 w-16 mt-1" />
                </div>
              </div>
            </div>
          ))
        ) : Object.keys(groupedMessages).length > 0 ? (
          // Actual messages grouped by date
          Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="space-y-4">
              <div className="text-center">
                <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                  {date}
                </span>
              </div>
              
              {dateMessages.map((message) => {
                const isCurrentUser = message.sender_id === user?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[80%] flex gap-2 ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                      {!isCurrentUser && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`https://ui-avatars.com/api/?name=${otherProfile?.name || "User"}&background=8B5CF6&color=fff`}
                          />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div
                          className={`p-3 rounded-lg ${
                            isCurrentUser
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {message.content}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 text-right">
                          {formatTime(message.created_at)}
                        </p>
                      </div>
                      {isCurrentUser && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">
              No messages yet. Start the conversation!
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending}
          />
          <Button type="submit" disabled={!newMessage.trim() || sending}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </>
  );
}
