
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Edit,
  FileText,
  Heart,
  MessageSquare,
  Pencil,
  Plus,
  Trash,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
    description: "A campaign to promote our new summer fashion collection featuring lightweight fabrics and vibrant colors perfect for the season.",
    goals: "Increase brand awareness, drive traffic to our website, and boost sales for our summer collection.",
    requirements: "Create engaging content showcasing our summer collection items in real-life settings. Highlight the comfort, style, and versatility of the clothing.",
    influencers: [
      { 
        id: "1", 
        name: "Priya Sharma", 
        handle: "@priyasharma",
        category: "Fashion",
        followers: 125000,
        engagement: 4.8,
        fee: 45000,
        status: "completed",
        image: "https://ui-avatars.com/api/?name=Priya+Sharma&background=8B5CF6&color=fff",
        content: [
          { 
            type: "post", 
            platform: "Instagram", 
            status: "published", 
            date: "2023-05-20", 
            engagement: 5.2, 
            likes: 12500, 
            comments: 780, 
            description: "Summer vibes with @FashionTrends new collection! 🌞👗 #SummerStyle #FashionTrends #ad" 
          },
          { 
            type: "story", 
            platform: "Instagram", 
            status: "published", 
            date: "2023-05-21", 
            engagement: 3.8, 
            views: 95000, 
            description: "Behind the scenes look at the FashionTrends photoshoot" 
          }
        ]
      },
      { 
        id: "3", 
        name: "Neha Kapoor", 
        handle: "@nehabeauty",
        category: "Beauty",
        followers: 98000,
        engagement: 5.7,
        fee: 38000,
        status: "in-progress",
        image: "https://ui-avatars.com/api/?name=Neha+Kapoor&background=8B5CF6&color=fff",
        content: [
          { 
            type: "post", 
            platform: "Instagram", 
            status: "draft", 
            date: "2023-05-28", 
            description: "Draft for collection showcase post" 
          }
        ]
      },
      { 
        id: "5", 
        name: "Ananya Desai", 
        handle: "@foodieananya",
        category: "Food",
        followers: 88000,
        engagement: 7.2,
        fee: 35000,
        status: "pending",
        image: "https://ui-avatars.com/api/?name=Ananya+Desai&background=8B5CF6&color=fff",
        content: []
      },
    ],
    timeline: {
      brief: "2023-05-01",
      influencerSelection: "2023-05-10",
      contentCreation: "2023-05-15",
      publishing: "2023-05-20",
      reporting: "2023-06-20",
    },
    metrics: {
      engagement: 4.8,
      reach: 580000,
      impressions: 820000,
      clicks: 28500,
      conversions: 3200,
      roi: 2.3,
      ctr: 3.5,
      sentiment: 0.85,
    },
    dailyData: [
      { date: "2023-05-20", engagement: 4.2, reach: 125000, sentiment: 0.82 },
      { date: "2023-05-21", engagement: 4.5, reach: 130000, sentiment: 0.84 },
      { date: "2023-05-22", engagement: 4.3, reach: 128000, sentiment: 0.83 },
      { date: "2023-05-23", engagement: 5.1, reach: 150000, sentiment: 0.87 },
      { date: "2023-05-24", engagement: 4.9, reach: 145000, sentiment: 0.86 },
      { date: "2023-05-25", engagement: 5.2, reach: 152000, sentiment: 0.88 },
    ],
    sentimentData: [
      { name: "Positive", value: 68 },
      { name: "Neutral", value: 24 },
      { name: "Negative", value: 8 },
    ],
    categorySplit: [
      { name: "Instagram Posts", value: 45 },
      { name: "Instagram Stories", value: 30 },
      { name: "TikTok Videos", value: 15 },
      { name: "YouTube", value: 10 },
    ],
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

// Format large numbers
const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

// Get status color class
const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "planning":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-gray-100 text-gray-800";
    case "published":
      return "bg-green-100 text-green-800";
    case "draft":
      return "bg-yellow-100 text-yellow-800";
    case "in-progress":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Sentiment gauge component
function SentimentGauge({ value }: { value: number }) {
  // Value should be between 0 and 1
  const percentage = Math.round(value * 100);
  let color = "";
  
  if (percentage < 40) {
    color = "bg-red-500";
  } else if (percentage < 70) {
    color = "bg-yellow-500";
  } else {
    color = "bg-green-500";
  }

  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Negative</span>
        <span className="text-sm text-muted-foreground">Positive</span>
      </div>
      <div className="h-3 w-full rounded-full bg-gray-200">
        <div 
          className={`h-3 rounded-full ${color}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="mt-1 text-center">
        <span className="text-lg font-bold">{percentage}%</span>
      </div>
    </div>
  );
}

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [campaign] = useState(() => SAMPLE_CAMPAIGNS.find(c => c.id === id) || SAMPLE_CAMPAIGNS[0]);

  // Calculate progress
  const completedCount = campaign.influencers.filter(inf => inf.status === "completed").length;
  const progress = (completedCount / campaign.influencers.length) * 100;

  const COLORS = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'];

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4">
        <Button variant="ghost" asChild className="mb-2">
          <Link to="/campaigns">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Link>
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{campaign.name}</h1>
              <Badge className={getStatusColor(campaign.status)}>
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {campaign.brand} • {campaign.category} • Budget: {formatInr(campaign.budget)}
            </p>
          </div>
          {user?.role === "brand" && (
            <div className="flex gap-2">
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Influencers
              </Button>
            </div>
          )}
          {user?.role === "influencer" && (
            <div className="flex gap-2">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Submit Content
              </Button>
              <Button>
                <MessageSquare className="mr-2 h-4 w-4" />
                Message Brand
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
              </span>
            </div>
            <div className="mt-2">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1">
              <div className="text-sm">
                {campaign.influencers.length} Influencers
                <span className="text-muted-foreground ml-2">
                  ({completedCount} active)
                </span>
              </div>
            </div>
            <div className="mt-2 flex -space-x-2">
              {campaign.influencers.map((inf) => (
                <Avatar key={inf.id} className="border-2 border-background w-8 h-8">
                  <AvatarImage src={inf.image} alt={inf.name} />
                  <AvatarFallback>{inf.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
              ))}
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground bg-background text-xs text-muted-foreground">
                +
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Engagement</span>
              <span className="text-lg font-bold">{campaign.metrics.engagement}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">ROI</span>
              <span className="text-lg font-bold">{campaign.metrics.roi}x</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Reach</span>
              <span className="text-lg font-bold">{formatNumber(campaign.metrics.reach)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">CTR</span>
              <span className="text-lg font-bold">{campaign.metrics.ctr}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="influencers">Influencers</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Description</h3>
                  <p className="text-sm text-muted-foreground">{campaign.description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Goals</h3>
                  <p className="text-sm text-muted-foreground">{campaign.goals}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Requirements</h3>
                  <p className="text-sm text-muted-foreground">{campaign.requirements}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Timeline</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Brief Creation:</span>
                      <span>{formatDate(campaign.timeline.brief)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Influencer Selection:</span>
                      <span>{formatDate(campaign.timeline.influencerSelection)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Content Creation:</span>
                      <span>{formatDate(campaign.timeline.contentCreation)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Publishing:</span>
                      <span>{formatDate(campaign.timeline.publishing)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reporting:</span>
                      <span>{formatDate(campaign.timeline.reporting)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Total Reach</div>
                      <div className="text-2xl font-bold">{formatNumber(campaign.metrics.reach)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Impressions</div>
                      <div className="text-2xl font-bold">{formatNumber(campaign.metrics.impressions)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Clicks</div>
                      <div className="text-2xl font-bold">{formatNumber(campaign.metrics.clicks)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Conversions</div>
                      <div className="text-2xl font-bold">{formatNumber(campaign.metrics.conversions)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Audience Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <SentimentGauge value={campaign.metrics.sentiment} />
                  <div className="mt-4">
                    <ResponsiveContainer width="100%" height={150}>
                      <PieChart>
                        <Pie
                          data={campaign.sentimentData}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={60}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {campaign.sentimentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#4ade80', '#a3a3a3', '#f87171'][index]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trend</CardTitle>
              <CardDescription>Daily engagement and reach metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={campaign.dailyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="engagement"
                      name="Engagement (%)"
                      stroke="#8B5CF6"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="reach"
                      name="Reach"
                      stroke="#10b981"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="influencers" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Campaign Influencers</CardTitle>
                <CardDescription>
                  {campaign.influencers.length} influencers in this campaign
                </CardDescription>
              </div>
              {user?.role === "brand" && (
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Influencer
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {campaign.influencers.map((influencer) => (
                  <div key={influencer.id} className="border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={influencer.image} alt={influencer.name} />
                          <AvatarFallback>{influencer.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{influencer.name}</h3>
                            <Badge className={getStatusColor(influencer.status)}>
                              {influencer.status.charAt(0).toUpperCase() + influencer.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{influencer.handle}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
                            <div>
                              <span className="font-medium">{formatNumber(influencer.followers)}</span>{" "}
                              <span className="text-muted-foreground">followers</span>
                            </div>
                            <div>
                              <span className="font-medium">{influencer.engagement}%</span>{" "}
                              <span className="text-muted-foreground">engagement</span>
                            </div>
                            <div>
                              <span className="font-medium">{formatInr(influencer.fee)}</span>{" "}
                              <span className="text-muted-foreground">fee</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {user?.role === "brand" && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      )}
                    </div>

                    {influencer.content.length > 0 && (
                      <div className="mt-4 ml-16">
                        <h4 className="text-sm font-medium mb-2">Content</h4>
                        <div className="space-y-2">
                          {influencer.content.map((content, idx) => (
                            <div key={idx} className="rounded-lg border p-3">
                              <div className="flex justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{content.platform}</Badge>
                                  <Badge variant="outline">
                                    {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                                  </Badge>
                                  <Badge className={getStatusColor(content.status)}>
                                    {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {content.date ? formatDate(content.date) : "No date set"}
                                </div>
                              </div>
                              <p className="mt-2 text-sm">{content.description}</p>
                              {content.status === "published" && (
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                                  {content.engagement && (
                                    <div>
                                      <span className="font-medium">{content.engagement}%</span>{" "}
                                      <span className="text-muted-foreground">engagement</span>
                                    </div>
                                  )}
                                  {content.likes && (
                                    <div>
                                      <span className="font-medium">{formatNumber(content.likes)}</span>{" "}
                                      <span className="text-muted-foreground">likes</span>
                                    </div>
                                  )}
                                  {content.comments && (
                                    <div>
                                      <span className="font-medium">{formatNumber(content.comments)}</span>{" "}
                                      <span className="text-muted-foreground">comments</span>
                                    </div>
                                  )}
                                  {content.views && (
                                    <div>
                                      <span className="font-medium">{formatNumber(content.views)}</span>{" "}
                                      <span className="text-muted-foreground">views</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Calendar</CardTitle>
              <CardDescription>
                Published and upcoming content for this campaign
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Influencer</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaign.influencers.flatMap((influencer) =>
                    influencer.content.map((content, idx) => (
                      <TableRow key={`${influencer.id}-${idx}`}>
                        <TableCell>
                          {content.date ? formatDate(content.date) : "Not scheduled"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={influencer.image} alt={influencer.name} />
                              <AvatarFallback>{influencer.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span>{influencer.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{content.platform}</TableCell>
                        <TableCell>{content.type}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(content.status)}>
                            {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {content.status === "published" && content.engagement && (
                            <div className="text-sm">
                              {content.engagement}% engagement
                              {content.likes && (
                                <span className="text-muted-foreground ml-2">
                                  {formatNumber(content.likes)} likes
                                </span>
                              )}
                            </div>
                          )}
                          {content.status !== "published" && (
                            <span className="text-sm text-muted-foreground">Not published yet</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {user?.role === "brand" && (
                              <Button size="sm" variant="ghost">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                            {user?.role === "influencer" && content.status === "draft" && (
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {user?.role === "influencer" && (
            <Card>
              <CardHeader>
                <CardTitle>Content Guidelines</CardTitle>
                <CardDescription>
                  Requirements and specifications for this campaign
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Campaign Brief</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground mb-4">{campaign.description}</p>
                      <p className="text-sm text-muted-foreground">{campaign.requirements}</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Content Requirements</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Create at least 1 post and 2 stories for Instagram</li>
                        <li>• Ensure brand logo is visible in the content</li>
                        <li>• Use hashtags #SummerStyle #FashionTrends #ad</li>
                        <li>• Tag @FashionTrends in all posts</li>
                        <li>• Include a link to the collection in your bio</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Submission Process</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>1. Create your content based on the guidelines</li>
                        <li>2. Submit drafts for approval via the platform</li>
                        <li>3. Wait for brand approval (typically 48 hours)</li>
                        <li>4. Publish content on approved date</li>
                        <li>5. Mark as complete in the platform</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(campaign.metrics.reach)}</div>
                <p className="text-xs text-muted-foreground">
                  Total audience reached across all platforms
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaign.metrics.engagement}%</div>
                <p className="text-xs text-muted-foreground">
                  Average engagement across all content
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaign.metrics.ctr}%</div>
                <p className="text-xs text-muted-foreground">
                  Percentage of views that result in clicks
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">ROI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaign.metrics.roi}x</div>
                <p className="text-xs text-muted-foreground">
                  Return on investment ratio
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Trend</CardTitle>
                <CardDescription>Daily engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={campaign.dailyData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="engagement"
                        name="Engagement Rate (%)"
                        stroke="#8B5CF6"
                        fill="#C4B5FD"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Distribution</CardTitle>
                <CardDescription>Platform and content type breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={campaign.categorySplit}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {campaign.categorySplit.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Audience Sentiment Analysis</CardTitle>
              <CardDescription>AI-powered sentiment analysis of audience reactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <SentimentGauge value={campaign.metrics.sentiment} />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium mb-2">Sentiment Breakdown</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>Positive</span>
                        <span>{campaign.sentimentData[0].value}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div 
                          className="h-2 rounded-full bg-green-500" 
                          style={{ width: `${campaign.sentimentData[0].value}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>Neutral</span>
                        <span>{campaign.sentimentData[1].value}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div 
                          className="h-2 rounded-full bg-gray-500" 
                          style={{ width: `${campaign.sentimentData[1].value}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>Negative</span>
                        <span>{campaign.sentimentData[2].value}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div 
                          className="h-2 rounded-full bg-red-500" 
                          style={{ width: `${campaign.sentimentData[2].value}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Common Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-brand-100 text-brand-800 hover:bg-brand-200">
                      Stylish
                    </Badge>
                    <Badge className="bg-brand-100 text-brand-800 hover:bg-brand-200">
                      High Quality
                    </Badge>
                    <Badge className="bg-brand-100 text-brand-800 hover:bg-brand-200">
                      Comfortable
                    </Badge>
                    <Badge className="bg-brand-100 text-brand-800 hover:bg-brand-200">
                      Trendy
                    </Badge>
                    <Badge className="bg-brand-100 text-brand-800 hover:bg-brand-200">
                      Summer Vibes
                    </Badge>
                    <Badge className="bg-brand-100 text-brand-800 hover:bg-brand-200">
                      Fashion
                    </Badge>
                    <Badge className="bg-brand-100 text-brand-800 hover:bg-brand-200">
                      Beautiful
                    </Badge>
                    <Badge className="bg-brand-100 text-brand-800 hover:bg-brand-200">
                      Love
                    </Badge>
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                      Pricing
                    </Badge>
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                      Shipping Time
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
