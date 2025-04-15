
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  influencer: {
    id: string;
    name: string;
    handle: string;
  };
}

export default function ChatModal({ isOpen, onClose, influencer }: ChatModalProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;

    setSending(true);
    try {
      // First check if there's already a conversation between these users
      const { data: existingConversation, error: checkError } = await supabase
        .from("conversations")
        .select("id")
        .eq("brand_id", user.role === "brand" ? user.id : influencer.id)
        .eq("influencer_id", user.role === "influencer" ? user.id : influencer.id)
        .maybeSingle();

      if (checkError) throw checkError;

      let conversationId;

      if (existingConversation) {
        // Use existing conversation
        conversationId = existingConversation.id;
      } else {
        // Create new conversation
        const { data: newConversation, error: createError } = await supabase
          .from("conversations")
          .insert({
            brand_id: user.role === "brand" ? user.id : influencer.id,
            influencer_id: user.role === "influencer" ? user.id : influencer.id,
          })
          .select()
          .single();

        if (createError) throw createError;
        
        conversationId = newConversation.id;
      }

      // Now send the message
      const { error: messageError } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        content: message.trim(),
        sender_id: user.id,
      });

      if (messageError) throw messageError;

      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });

      // Navigate to the conversation
      onClose();
      navigate(`/messages/${conversationId}`);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Message {influencer.name}</DialogTitle>
          <DialogDescription>
            Send a message to start a conversation with {influencer.handle}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            disabled={!message.trim() || sending} 
            onClick={handleSendMessage}
          >
            {sending ? "Sending..." : "Send message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
