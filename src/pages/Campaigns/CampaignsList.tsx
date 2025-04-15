
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  BarChart3,
  Calendar,
  Clock,
  Copy,
  Edit,
  Filter,
  PlusCircle,
  Search,
  Settings,
  Trash,
  UserCheck,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";

// Sample campaign data
const SAMPLE_CAMPAIGNS = [
  {
    id: "1",
    name: "Summer Collection Launch",
    brand: "FashionTrends",
    category: "Fashion",
    status: "active",
    budget: 250000,
    startDate: "2023-05-15",
    endDate: "2023-06-15",
    influencers: [
      { id: "1", name: "Priya Sharma", status: "completed" },
      { id: "3", name: "Neha Kapoor", status: "in-progress" },
      { id: "5", name: "Ananya Desai", status: "pending" },
    ],
    metrics: {
      engagement: 4.8,
      reach: 580000,
      roi: 2.3,
      sentiment: 0.85,
    },
  },
  {
    id: "2",
    name: "Diwali Festive Campaign",
    brand: "GlamStyle",
    category: "Fashion",
    status: "planning",
    budget: 320000,
    startDate: "2023-10-01",
    endDate: "2023-10-25",
    influencers: [
      { id: "1", name: "Priya Sharma", status: "pending" },
      { id: "7", name: "Meera Rajput", status: "pending" },
    ],
    metrics: {
      engagement: 0,
      reach: 0,
      roi: 0,
      sentiment: 0,
    },
  },
  {
    id: "3",
    name: "Tech Unboxing Series",
    brand: "GadgetWorld",
    category: "Tech",
    status: "active",
    budget: 185000,
    startDate: "2023-07-01",
    endDate: "2023-08-15",
    influencers: [
      { id: "2", name: "Arjun Mehta", status: "completed" },
      { id: "8", name: "Aditya Kumar", status: "in-progress" },
    ],
    metrics: {
      engagement: 3.9,
      reach: 420000,
      roi: 1.8,
      sentiment: 0.72,
    },
  },
  {
    id: "4",
    name: "Fitness Challenge",
    brand: "ActiveLife",
    category: "Fitness",
    status: "completed",
    budget: 150000,
    startDate: "2023-03-01",
    endDate: "2023-04-15",
    influencers: [
      { id: "4", name: "Vikram Singh", status: "completed" },
    ],
    metrics: {
      engagement: 6.2,
      reach: 320000,
      roi: 2.7,
      sentiment: 0.91,
    },
  },
  {
    id: "5",
    name: "Food Festival Coverage",
    brand: "TastyTreats",
    category: "Food",
    status: "completed",
    budget: 120000,
    startDate: "2023-02-10",
    endDate: "2023-02-25",
    influencers: [
      { id: "5", name: "Ananya Desai", status: "completed" },
    ],
    metrics: {
      engagement: 5.8,
      reach: 210000,
      roi: 2.1,
      sentiment: 0.88,
    },
  },
  {
    id: "6",
    name: "Travel Destination Series",
    brand: "WanderlustJourneys",
    category: "Travel",
    status: "active",
    budget: 270000,
    startDate: "2023-06-01",
    endDate: "2023-08-31",
    influencers: [
      { id: "6", name: "Rahul Verma", status: "in-progress" },
    ],
    metrics: {
      engagement: 4.3,
      reach: 380000,
      roi: 1.5,
      sentiment: 0.79,
    },
  },
];

// Format date to DD/MM/YYYY
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN');
};

// Format number with commas for Indian currency
const formatInr = (amount: number) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

// Calculate status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "planning":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Campaign card component
function CampaignCard({ campaign }: { campaign: typeof SAMPLE_CAMPAIGNS[0] }) {
  // Calculate progress
  const completedCount = campaign.influencers.filter(inf => inf.status === "completed").length;
  const progress = (completedCount / campaign.influencers.length) * 100;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{campaign.name}</CardTitle>
            <CardDescription>{campaign.brand}</CardDescription>
          </div>
          <Badge className={getStatusColor(campaign.status)}>
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="mb-4 flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
            <span>
              {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
            </span>
          </div>
          <div className="text-primary font-medium">{formatInr(campaign.budget)}</div>
        </div>

        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="mb-2">
          <p className="text-sm font-medium mb-1">Influencers ({campaign.influencers.length})</p>
          <div className="flex -space-x-2">
            {campaign.influencers.map((inf, idx) => (
              <div
                key={inf.id}
                className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted"
                title={inf.name}
              >
                {inf.name.substring(0, 1)}
                {inf.status === "completed" && (
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></div>
                )}
                {inf.status === "in-progress" && (
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-yellow-500 border-2 border-background"></div>
                )}
                {inf.status === "pending" && (
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-gray-300 border-2 border-background"></div>
                )}
              </div>
            ))}
            {campaign.influencers.length < 4 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground bg-background text-xs text-muted-foreground">
                +
              </div>
            )}
          </div>
        </div>

        {campaign.status !== "planning" && (
          <div className="grid grid-cols-2 gap-2 mt-4 text-center text-sm">
            <div className="rounded-md bg-muted p-2">
              <p className="font-semibold">{campaign.metrics.engagement}%</p>
              <p className="text-xs text-muted-foreground">Engagement</p>
            </div>
            <div className="rounded-md bg-muted p-2">
              <p className="font-semibold">{campaign.metrics.roi}x</p>
              <p className="text-xs text-muted-foreground">ROI</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link to={`/campaigns/${campaign.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function CampaignsList() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [view, setView] = useState<"grid" | "table">("grid");

  // Filter campaigns
  const filteredCampaigns = SAMPLE_CAMPAIGNS.filter((campaign) => {
    const matchesSearch = 
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || campaign.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage and track all your influencer marketing campaigns
          </p>
        </div>
        {user?.role === "brand" && (
          <Button asChild>
            <Link to="/campaigns/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Campaign
            </Link>
          </Button>
        )}
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <Filter className="mr-2 h-4 w-4" />
                Status
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                Category
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Fashion">Fashion</SelectItem>
                <SelectItem value="Tech">Tech</SelectItem>
                <SelectItem value="Beauty">Beauty</SelectItem>
                <SelectItem value="Fitness">Fitness</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={view === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("grid")}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "table" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("table")}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Campaigns</TabsTrigger>
            {user?.role === "brand" && (
              <TabsTrigger value="my">My Campaigns</TabsTrigger>
            )}
            {user?.role === "influencer" && (
              <>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="invites">Invites</TabsTrigger>
              </>
            )}
          </TabsList>
          <TabsContent value="all" className="mt-4">
            {view === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campaign</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Influencers</TableHead>
                        <TableHead className="text-right">Budget</TableHead>
                        <TableHead className="text-right">Timeline</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCampaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{campaign.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {campaign.brand}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{campaign.category}</TableCell>
                          <TableCell>
                            <div className="flex -space-x-2">
                              {campaign.influencers.slice(0, 3).map((inf) => (
                                <div
                                  key={inf.id}
                                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted"
                                  title={inf.name}
                                >
                                  {inf.name.substring(0, 1)}
                                </div>
                              ))}
                              {campaign.influencers.length > 3 && (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground">
                                  +{campaign.influencers.length - 3}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {formatInr(campaign.budget)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="text-xs">
                              {formatDate(campaign.startDate)}
                            </div>
                            <div className="text-xs">
                              {formatDate(campaign.endDate)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button size="sm" variant="ghost" asChild>
                                <Link to={`/campaigns/${campaign.id}`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              {user?.role === "brand" && (
                                <Button size="sm" variant="ghost">
                                  <Trash className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="my" className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCampaigns
                .filter((c) => c.brand === "FashionTrends")
                .map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="active" className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCampaigns
                .filter((c) => c.status === "active")
                .map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="invites" className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCampaigns
                .filter((c) => 
                  c.influencers.some(inf => inf.status === "pending" && inf.name === "Ananya Desai")
                )
                .map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
