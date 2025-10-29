import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Newspaper, X } from "lucide-react";
import NewsCard from "../components/NewsCard";

export default function News() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: news = [], isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      try {
        const response = await fetch("/api/news");
        if (!response.ok) throw new Error("Failed to fetch news");
        return response.json();
      } catch (error) {
        console.error("Error fetching news:", error);
        return [];
      }
    },
  });

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(229, 84, 46, 0.2) 0%, transparent 60%)'
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Newspaper className="w-12 h-12 text-orange-400" />
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              AI News & Updates
            </h1>
          </div>
          <p className="text-xl text-neutral-400">
            Stay updated with the latest developments in the AI industry
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-20 z-40 py-6" style={{
        background: 'rgba(29, 30, 26, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <Input
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 h-12 rounded-[16px] border-0 text-white placeholder:text-neutral-500"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <X className="w-4 h-4 text-neutral-400" />
                </button>
              )}
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-12 rounded-[16px] border-0 text-white" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)'
              }}>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="rounded-[14px]" style={{
                background: 'rgba(29, 30, 26, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Product Launch">Product Launch</SelectItem>
                <SelectItem value="Feature Update">Feature Update</SelectItem>
                <SelectItem value="Industry News">Industry News</SelectItem>
                <SelectItem value="Company Announcement">Company Announcement</SelectItem>
                <SelectItem value="Research">Research</SelectItem>
                <SelectItem value="Events">Events</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-center mt-5">
            <span className="text-sm text-neutral-500">
              <span className="font-semibold text-white">{filteredNews.length}</span> news items
            </span>
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-80 rounded-[24px] animate-pulse" style={{
                background: 'rgba(255, 255, 255, 0.03)'
              }} />
            ))}
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-[20px] flex items-center justify-center mx-auto mb-6" style={{
              background: 'rgba(255, 255, 255, 0.05)'
            }}>
              <Search className="w-10 h-10 text-neutral-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No news found
            </h3>
            <p className="text-neutral-400">
              Try a different search term or category
            </p>
          </div>
        )}
      </div>
    </div>
  );
}