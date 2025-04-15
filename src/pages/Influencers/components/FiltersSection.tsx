
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { formatInr } from "../utils/formatters";
import { CATEGORIES } from "../constants";

interface FiltersSectionProps {
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
}

export default function FiltersSection({
  priceRange,
  onPriceRangeChange,
  category,
  onCategoryChange,
  searchQuery,
  onSearchQueryChange,
}: FiltersSectionProps) {
  return (
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
              onValueChange={onPriceRangeChange}
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
          <Select value={category} onValueChange={onCategoryChange}>
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
              onChange={(e) => onSearchQueryChange(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
