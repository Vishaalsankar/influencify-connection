
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus } from "lucide-react";
import { formatInr, formatFollowers } from "../utils/formatters";
import { Influencer } from "../types";

interface InfluencerTableProps {
  influencers: Influencer[];
  onChatClick: (influencer: Influencer) => void;
  onInviteClick: (influencer: Influencer) => void;
}

export default function InfluencerTable({ 
  influencers, 
  onChatClick, 
  onInviteClick 
}: InfluencerTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Influencer</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Followers</TableHead>
          <TableHead className="text-right">Engagement</TableHead>
          <TableHead className="text-right">Fee (INR)</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {influencers.map((influencer) => (
          <TableRow key={influencer.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={influencer.image} alt={influencer.name} />
                  <AvatarFallback>
                    {influencer.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{influencer.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {influencer.handle}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{influencer.category}</Badge>
            </TableCell>
            <TableCell className="text-right">
              {formatFollowers(influencer.followers)}
            </TableCell>
            <TableCell className="text-right">{influencer.engagement}%</TableCell>
            <TableCell className="text-right">{formatInr(influencer.fee)}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={() => onChatClick(influencer)}>
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onInviteClick(influencer)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
