
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Star, BarChart, CheckCircle2, Users, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-brand-50 via-white to-brand-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-800">
                  Connect Your Brand With The Perfect Influencers
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  PromoPULSE helps brands discover, manage, and analyze influencer marketing campaigns - all in one platform.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 min-[400px]:items-center">
                <Button asChild size="lg">
                  <Link to="/signup">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/login">
                    Sign In
                  </Link>
                </Button>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex space-x-1">
                  <Star className="h-4 w-4 fill-brand-400 text-brand-400" />
                  <Star className="h-4 w-4 fill-brand-400 text-brand-400" />
                  <Star className="h-4 w-4 fill-brand-400 text-brand-400" />
                  <Star className="h-4 w-4 fill-brand-400 text-brand-400" />
                  <Star className="h-4 w-4 fill-brand-400 text-brand-400" />
                </div>
                <div className="text-gray-500">
                  Trusted by 500+ brands in India
                </div>
              </div>
            </div>
            <div className="relative lg:ml-auto">
              <div className="relative overflow-hidden rounded-xl border bg-background p-2 shadow-xl">
                <div className="overflow-hidden rounded-lg border shadow-sm">
                  <img
                    alt="Platform preview"
                    className="w-full object-cover"
                    height="500"
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&dpr=2&q=80"
                    width="500"
                  />
                </div>
              </div>
              <div className="absolute bottom-[-5%] left-[-10%] h-24 w-72 rounded-xl bg-gradient-to-r from-brand-600 to-brand-400 p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                  <span className="text-md font-semibold text-white">AI-Powered Matching</span>
                </div>
                <p className="mt-1 text-xs text-white/90">
                  Find the perfect influencers for your brand using our advanced AI matching algorithm
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-brand-100 px-3 py-1 text-sm text-brand-600">
                Key Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Everything You Need For Influencer Marketing
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                All the tools and features you need to discover, manage, and analyze your influencer marketing campaigns.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-brand-100">
                <Users className="h-6 w-6 text-brand-700" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Influencer Discovery</h3>
                <p className="text-gray-500">
                  Find the perfect influencers for your brand with our advanced filters, price slider, and AI-powered recommendations.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-brand-100">
                <Zap className="h-6 w-6 text-brand-700" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Campaign Management</h3>
                <p className="text-gray-500">
                  Create, manage and track campaigns from brief to reporting with real-time updates on content progress.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-brand-100">
                <BarChart className="h-6 w-6 text-brand-700" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Analytics & Insights</h3>
                <p className="text-gray-500">
                  Measure ROI, engagement, and sentiment with powerful analytics dashboards and AI-driven insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-brand-100 px-3 py-1 text-sm text-brand-600">
                How It Works
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Simple Powerful Process
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform streamlines your influencer marketing workflow from discovery to reporting.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 md:gap-12">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white">
                1
              </div>
              <h3 className="text-xl font-bold">Discover</h3>
              <p className="text-sm text-gray-500">
                Find influencers that match your brand values, budget, and target audience.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white">
                2
              </div>
              <h3 className="text-xl font-bold">Collaborate</h3>
              <p className="text-sm text-gray-500">
                Chat with influencers, create campaigns, and manage content approval from one place.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white">
                3
              </div>
              <h3 className="text-xl font-bold">Analyze</h3>
              <p className="text-sm text-gray-500">
                Track performance, measure ROI, and gather insights to optimize future campaigns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-brand-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Transform Your Influencer Marketing?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join hundreds of brands that have elevated their influencer campaigns with PromoPULSE.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100" asChild>
                <Link to="/signup">
                  Get Started Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-brand-700" asChild>
                <Link to="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 md:py-12 bg-gray-900 text-gray-300">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-white p-1">
                  <div className="h-6 w-6 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold">
                    P
                  </div>
                </div>
                <span className="text-xl font-bold text-white">PromoPULSE</span>
              </div>
              <p className="max-w-[220px] text-sm text-gray-400">
                Connecting brands with influential voices for powerful collaborations.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                Platform
              </h4>
              <div className="grid gap-2 text-sm">
                <Link to="/" className="hover:underline">
                  Overview
                </Link>
                <Link to="/" className="hover:underline">
                  Features
                </Link>
                <Link to="/" className="hover:underline">
                  For Brands
                </Link>
                <Link to="/" className="hover:underline">
                  For Influencers
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                Company
              </h4>
              <div className="grid gap-2 text-sm">
                <Link to="/" className="hover:underline">
                  About Us
                </Link>
                <Link to="/" className="hover:underline">
                  Careers
                </Link>
                <Link to="/" className="hover:underline">
                  Blog
                </Link>
                <Link to="/" className="hover:underline">
                  Contact
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                Legal
              </h4>
              <div className="grid gap-2 text-sm">
                <Link to="/" className="hover:underline">
                  Terms of Service
                </Link>
                <Link to="/" className="hover:underline">
                  Privacy Policy
                </Link>
                <Link to="/" className="hover:underline">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-8 border-t border-gray-800 pt-8 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-400">
              © 2025 PromoPULSE. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link to="/" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </Link>
              <Link to="/" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </Link>
              <Link to="/" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
