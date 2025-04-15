
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Plus } from "lucide-react";
import { formatInr, formatFollowers } from "../utils/formatters";
import { Influencer } from "../types";

interface InfluencerCardProps {
  influencer: Influencer;
  onChatClick: (influencer: Influencer) => void;
  onInviteClick: (influencer: Influencer) => void;
}

export default function InfluencerCard({ 
  influencer, 
  onChatClick, 
  onInviteClick 
}: InfluencerCardProps) {
  return (
    <Card key={influencer.id} className="overflow-hidden">
      <div className="relative h-40 bg-gradient-to-r from-brand-100 to-brand-200">
        <Avatar className="absolute bottom-0 left-4 -mb-10 h-20 w-20 border-4 border-background">
          <AvatarImage src={influencer.image} alt={influencer.name} />
          <AvatarFallback className="text-lg">
            {influencer.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <CardContent className="pt-12">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="font-semibold">{influencer.name}</h3>
          <Badge variant="outline">{influencer.category}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{influencer.handle}</p>

        <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
          <div className="rounded-md bg-muted p-2">
            <p className="font-semibold">{formatFollowers(influencer.followers)}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div className="rounded-md bg-muted p-2">
            <p className="font-semibold">{influencer.engagement}%</p>
            <p className="text-xs text-muted-foreground">Engagement</p>
          </div>
          <div className="rounded-md bg-muted p-2">
            <p className="font-semibold">{formatInr(influencer.fee)}</p>
            <p className="text-xs text-muted-foreground">Fee</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            className="flex-1" 
            size="sm"
            onClick={() => onChatClick(influencer)}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat
          </Button>
          <Button 
            className="flex-1" 
            variant="outline" 
            size="sm"
            onClick={() => onInviteClick(influencer)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Invite
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
