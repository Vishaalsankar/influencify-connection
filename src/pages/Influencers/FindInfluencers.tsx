
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, MessageSquare, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import ChatModal from "@/components/ChatModal";
import { supabase } from "@/integrations/supabase/client";

// Sample data for influencers
const SAMPLE_INFLUENCERS = [
  {
    id: "1",
    name: "Priya Sharma",
    handle: "@priyasharma",
    category: "Fashion",
    followers: 125000,
    engagement: 4.8,
    fee: 45000,
    image: "https://ui-avatars.com/api/?name=Priya+Sharma&background=8B5CF6&color=fff",
  },
  {
    id: "2",
    name: "Arjun Mehta",
    handle: "@techarjun",
    category: "Tech",
    followers: 230000,
    engagement: 3.2,
    fee: 62000,
    image: "https://ui-avatars.com/api/?name=Arjun+Mehta&background=8B5CF6&color=fff",
  },
  {
    id: "3",
    name: "Neha Kapoor",
    handle: "@nehabeauty",
    category: "Beauty",
    followers: 98000,
    engagement: 5.7,
    fee: 38000,
    image: "https://ui-avatars.com/api/?name=Neha+Kapoor&background=8B5CF6&color=fff",
  },
  {
    id: "4",
    name: "Vikram Singh",
    handle: "@fitvikram",
    category: "Fitness",
    followers: 175000,
    engagement: 6.1,
    fee: 52000,
    image: "https://ui-avatars.com/api/?name=Vikram+Singh&background=8B5CF6&color=fff",
  },
  {
    id: "5",
    name: "Ananya Desai",
    handle: "@foodieananya",
    category: "Food",
    followers: 88000,
    engagement: 7.2,
    fee: 35000,
    image: "https://ui-avatars.com/api/?name=Ananya+Desai&background=8B5CF6&color=fff",
  },
  {
    id: "6",
    name: "Rahul Verma",
    handle: "@travelwithrahul",
    category: "Travel",
    followers: 320000,
    engagement: 4.5,
    fee: 78000,
    image: "https://ui-avatars.com/api/?name=Rahul+Verma&background=8B5CF6&color=fff",
  },
  {
    id: "7",
    name: "Meera Rajput",
    handle: "@luxurymeera",
    category: "Luxury",
    followers: 110000,
    engagement: 3.8,
    fee: 95000,
    image: "https://ui-avatars.com/api/?name=Meera+Rajput&background=8B5CF6&color=fff",
  },
  {
    id: "8",
    name: "Aditya Kumar",
    handle: "@gamingadi",
    category: "Gaming",
    followers: 420000,
    engagement: 8.3,
    fee: 85000,
    image: "https://ui-avatars.com/api/?name=Aditya+Kumar&background=8B5CF6&color=fff",
  },
];

const CATEGORIES = [
  "All Categories",
  "Fashion",
  "Tech",
  "Beauty",
  "Fitness",
  "Food",
  "Travel",
  "Luxury",
  "Gaming",
];

export default function FindInfluencers() {
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [category, setCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [chatInfluencer, setChatInfluencer] = useState<any | null>(null);
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

  // Format number with commas for Indian currency
  const formatInr = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Format followers count
  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handleChatClick = (influencer: any) => {
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

  const handleInvite = async (influencer: any) => {
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

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Filter by Price</CardTitle>
            <CardDescription>
              Adjust the range to find influencers within your budget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <Slider
                value={priceRange}
                min={1000}
                max={100000}
                step={1000}
                onValueChange={setPriceRange}
                className="my-4"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <div>{formatInr(priceRange[0])}</div>
              <div>{formatInr(priceRange[1])}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Filter by Category</CardTitle>
            <CardDescription>
              Select a specific niche or content category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Search by Name</CardTitle>
            <CardDescription>
              Find a specific influencer by name or handle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search influencers..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

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
                    onClick={() => handleChatClick(influencer)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat
                  </Button>
                  <Button 
                    className="flex-1" 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleInvite(influencer)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Invite
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
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
                {filteredInfluencers.map((influencer) => (
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
                        <Button size="sm" variant="ghost" onClick={() => handleChatClick(influencer)}>
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleInvite(influencer)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Chat Modal */}
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
