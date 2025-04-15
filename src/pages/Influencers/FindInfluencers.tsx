
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import ChatModal from "@/components/ChatModal";
import { supabase } from "@/integrations/supabase/client";
import { SAMPLE_INFLUENCERS } from "./constants";
import InfluencerCard from "./components/InfluencerCard";
import InfluencerTable from "./components/InfluencerTable";
import FiltersSection from "./components/FiltersSection";
import { Influencer } from "./types";

export default function FindInfluencers() {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [category, setCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [chatInfluencer, setChatInfluencer] = useState<Influencer | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Filter influencers based on search, price range, and category
  const filteredInfluencers = SAMPLE_INFLUENCERS.filter((influencer) => {
    const matchesPrice = influencer.fee >= priceRange[0] && influencer.fee <= priceRange[1];
    const matchesCategory = category === "All Categories" || influencer.category === category;
    const matchesSearch = searchQuery === "" || 
      influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencer.handle.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesPrice && matchesCategory && matchesSearch;
  });

  const handleChatClick = (influencer: Influencer) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to chat with influencers",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setChatInfluencer(influencer);
    setIsChatModalOpen(true);
  };

  const handleInvite = async (influencer: Influencer) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to invite influencers",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      // Check if user has campaigns
      const { data: campaigns, error: campaignsError } = await supabase
        .from("campaigns")
        .select("id, name")
        .eq("brand_id", user.id);

      if (campaignsError) throw campaignsError;

      if (!campaigns || campaigns.length === 0) {
        toast({
          title: "No campaigns",
          description: "You need to create a campaign first",
          action: (
            <Button variant="outline" onClick={() => navigate("/campaigns/new")}>
              Create Campaign
            </Button>
          ),
        });
        return;
      }

      // For demo purposes, use the first campaign
      const campaignId = campaigns[0].id;

      // Check if influencer is already invited
      const { data: existing, error: checkError } = await supabase
        .from("campaign_influencers")
        .select("id")
        .eq("campaign_id", campaignId)
        .eq("influencer_id", influencer.id)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existing) {
        toast({
          title: "Already invited",
          description: "This influencer has already been invited to your campaign",
        });
        return;
      }

      // Invite influencer to campaign
      const { error: inviteError } = await supabase
        .from("campaign_influencers")
        .insert({
          campaign_id: campaignId,
          influencer_id: influencer.id,
          fee: influencer.fee,
        });

      if (inviteError) throw inviteError;

      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${influencer.name} for your campaign "${campaigns[0].name}"`,
      });

    } catch (error) {
      console.error("Error inviting influencer:", error);
      toast({
        title: "Error",
        description: "Failed to invite influencer. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Find Influencers</h1>
        <p className="text-muted-foreground">
          Discover and connect with influencers that match your brand's needs
        </p>
      </div>

      <FiltersSection
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        category={category}
        onCategoryChange={setCategory}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Found {filteredInfluencers.length} influencers
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("grid")}
          >
            Grid
          </Button>
          <Button
            variant={view === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("table")}
          >
            Table
          </Button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredInfluencers.map((influencer) => (
            <InfluencerCard
              key={influencer.id}
              influencer={influencer}
              onChatClick={handleChatClick}
              onInviteClick={handleInvite}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <InfluencerTable
              influencers={filteredInfluencers}
              onChatClick={handleChatClick}
              onInviteClick={handleInvite}
            />
          </CardContent>
        </Card>
      )}

      {chatInfluencer && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={() => {
            setIsChatModalOpen(false);
            setChatInfluencer(null);
          }}
          influencer={chatInfluencer}
        />
      )}
    </div>
  );
}
