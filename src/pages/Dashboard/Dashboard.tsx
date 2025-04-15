
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, DollarSign, TrendingUp, Users } from "lucide-react";

// Placeholder component for the dashboard stats
function DashboardStat({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend: "up" | "down" | "neutral";
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend === "up" && (
          <div className="mt-1 flex items-center text-xs text-green-500">
            <TrendingUp className="mr-1 h-3 w-3" />
            <span>+12.5% from last month</span>
          </div>
        )}
        {trend === "down" && (
          <div className="mt-1 flex items-center text-xs text-red-500">
            <TrendingUp className="mr-1 h-3 w-3 rotate-180 transform" />
            <span>-3.2% from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Brand-specific dashboard content
function BrandDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStat
          title="Campaign Reach"
          value="1.2M"
          description="Total audience reached"
          icon={Users}
          trend="up"
        />
        <DashboardStat
          title="Engagement Rate"
          value="5.8%"
          description="Avg. across all campaigns"
          icon={TrendingUp}
          trend="up"
        />
        <DashboardStat
          title="ROI"
          value="248%"
          description="Return on investment"
          icon={TrendingUp}
          trend="up"
        />
        <DashboardStat
          title="CAC"
          value="₹320"
          description="Customer acquisition cost"
          icon={DollarSign}
          trend="down"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
            <CardDescription>Your currently running campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Summer Collection Launch", "Festive Season Promotion", "New Product Teaser"].map((campaign, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{campaign}</p>
                    <p className="text-xs text-muted-foreground">
                      {i === 0 ? "Ends in 5 days" : i === 1 ? "Ends in 2 weeks" : "Starts in 3 days"}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p>{i === 0 ? "8/10" : i === 1 ? "3/15" : "0/5"} Influencers</p>
                    <p className="text-xs text-muted-foreground">
                      {i === 0 ? "80%" : i === 1 ? "20%" : "0%"} Complete
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Performing Influencers</CardTitle>
            <CardDescription>Based on engagement and conversions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Priya Sharma", category: "Fashion", engagement: "8.2%", fee: "₹45,000" },
                { name: "Arjun Mehta", category: "Tech", engagement: "7.5%", fee: "₹62,000" },
                { name: "Neha Kapoor", category: "Beauty", engagement: "6.9%", fee: "₹38,000" },
              ].map((influencer, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {influencer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{influencer.name}</p>
                      <p className="text-xs text-muted-foreground">{influencer.category}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p>{influencer.engagement} Engagement</p>
                    <p className="text-xs text-muted-foreground">{influencer.fee} Fee</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Influencer-specific dashboard content
function InfluencerDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStat
          title="Active Campaigns"
          value="3"
          description="Campaigns you're part of"
          icon={BarChart}
          trend="neutral"
        />
        <DashboardStat
          title="Total Earnings"
          value="₹1,25,000"
          description="From all campaigns"
          icon={DollarSign}
          trend="up"
        />
        <DashboardStat
          title="Avg. Engagement"
          value="6.2%"
          description="Across all posts"
          icon={TrendingUp}
          trend="up"
        />
        <DashboardStat
          title="Campaign Invites"
          value="5"
          description="Pending review"
          icon={Users}
          trend="neutral"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Campaign Progress</CardTitle>
            <CardDescription>Your active campaign tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { campaign: "Summer Collection", status: "Content Submitted", brand: "FashionTrends" },
                { campaign: "Festival Lookbook", status: "Draft Ready", brand: "GlamStyle" },
                { campaign: "Tech Review", status: "Pending Approval", brand: "GadgetWorld" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{item.campaign}</p>
                    <p className="text-xs text-muted-foreground">With {item.brand}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs ${
                      item.status === "Content Submitted" 
                        ? "bg-green-100 text-green-700" 
                        : item.status === "Draft Ready"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Earnings Breakdown</CardTitle>
            <CardDescription>Your recent payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { campaign: "Summer Collection", amount: "₹45,000", date: "July 15, 2023" },
                { campaign: "Diwali Special", amount: "₹38,000", date: "Oct 5, 2023" },
                { campaign: "Tech Unboxing", amount: "₹42,000", date: "Dec 10, 2023" },
              ].map((payment, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{payment.campaign}</p>
                    <p className="text-xs text-muted-foreground">Paid on {payment.date}</p>
                  </div>
                  <div className="text-right font-medium">{payment.amount}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Admin-specific dashboard content
function AdminDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStat
          title="Active Users"
          value="2,342"
          description="Total platform users"
          icon={Users}
          trend="up"
        />
        <DashboardStat
          title="Active Campaigns"
          value="128"
          description="Across all brands"
          icon={BarChart}
          trend="up"
        />
        <DashboardStat
          title="Transaction Volume"
          value="₹82.5L"
          description="Total campaign value"
          icon={DollarSign}
          trend="up"
        />
        <DashboardStat
          title="Flagged Accounts"
          value="15"
          description="Potential fraud cases"
          icon={TrendingUp}
          trend="down"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Platform Activity</CardTitle>
            <CardDescription>User actions in last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "New Registrations", count: 32, trend: "+15%" },
                { action: "Campaigns Created", count: 14, trend: "+5%" },
                { action: "Content Submissions", count: 87, trend: "+22%" },
                { action: "Chat Messages", count: 453, trend: "+18%" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <p className="font-medium">{activity.action}</p>
                  <div className="text-right">
                    <p className="font-medium">{activity.count}</p>
                    <p className="text-xs text-green-500">{activity.trend}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Fraud Detection</CardTitle>
            <CardDescription>Recent flagged accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: "influencer483", reason: "Sudden follower spike", risk: "High" },
                { user: "glamour_trends", reason: "Engagement anomaly", risk: "Medium" },
                { user: "tech_reviewer99", reason: "Multiple account links", risk: "Medium" },
              ].map((fraud, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{fraud.user}</p>
                    <p className="text-xs text-muted-foreground">{fraud.reason}</p>
                  </div>
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs ${
                    fraud.risk === "High" 
                      ? "bg-red-100 text-red-700" 
                      : fraud.risk === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {fraud.risk} Risk
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  if (!user) {
    return null; // Handle not logged in state
  }

  let dashboardContent;
  
  switch (user.role) {
    case "brand":
      dashboardContent = <BrandDashboard />;
      break;
    case "influencer":
      dashboardContent = <InfluencerDashboard />;
      break;
    case "admin":
      dashboardContent = <AdminDashboard />;
      break;
    default:
      dashboardContent = <div>Unknown user role</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your {user.role === "brand" ? "campaigns" : user.role === "influencer" ? "collaborations" : "platform"} today.
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {user.role === "brand" && (
            <>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="influencers">Influencers</TabsTrigger>
            </>
          )}
          {user.role === "influencer" && (
            <>
              <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
            </>
          )}
          {user.role === "admin" && (
            <>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="fraud">Fraud Detection</TabsTrigger>
            </>
          )}
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {dashboardContent}
        </TabsContent>
        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Management</CardTitle>
              <CardDescription>View and manage all your active and past campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Campaign content will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="influencers">
          <Card>
            <CardHeader>
              <CardTitle>Influencer Discovery</CardTitle>
              <CardDescription>Find and connect with the perfect influencers for your brand</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Influencer discovery features will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="opportunities">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Opportunities</CardTitle>
              <CardDescription>Explore available campaigns that match your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Campaign opportunities will be listed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="earnings">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Management</CardTitle>
              <CardDescription>Track your earnings and payment history</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Earnings analytics will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage all platform users</CardDescription>
            </CardHeader>
            <CardContent>
              <p>User management tools will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="fraud">
          <Card>
            <CardHeader>
              <CardTitle>Fraud Detection System</CardTitle>
              <CardDescription>Advanced AI tools to detect suspicious activity</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Fraud detection tools will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
