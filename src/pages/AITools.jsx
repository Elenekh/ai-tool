import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";
import ToolCard from "../components/ToolCard";

export default function AITools() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [pricingFilter, setPricingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data: tools = [], isLoading } = useQuery({
    queryKey: ['tools'],
    queryFn: () => base44.entities.AITool.list('-created_date'),
  });

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || tool.category === categoryFilter;
    const matchesPricing = pricingFilter === "all" || tool.pricing === pricingFilter;
    
    return matchesSearch && matchesCategory && matchesPricing;
  });

  const sortedTools = [...filteredTools].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
      default:
        return new Date(b.created_date) - new Date(a.created_date);
    }
  });

  const hasActiveFilters = categoryFilter !== "all" || pricingFilter !== "all" || searchQuery;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          background: 'radial-gradient(circle at 50% 20%, rgba(229, 84, 46, 0.2) 0%, transparent 60%)'
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            AI Tools Directory
          </h1>
          <p className="text-xl text-neutral-400">
            Discover and compare {tools.length}+ cutting-edge AI tools
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="sticky top-20 z-40 py-6 transition-all duration-300" style={{
        background: 'rgba(29, 30, 26, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <Input
                placeholder="Search AI tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 pr-4 h-14 text-base rounded-[16px] border-0 text-white placeholder:text-neutral-500"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <X className="w-4 h-4 text-neutral-400" />
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 justify-center">
            <div className="flex items-center gap-2 text-neutral-500 text-sm">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters:</span>
            </div>

            {/* Category */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-44 h-11 rounded-[14px] border-0 text-white" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)'
              }}>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="rounded-[14px] border-0" style={{
                background: 'rgba(29, 30, 26, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Writing">Writing</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Presentation">Presentation</SelectItem>
                <SelectItem value="Productivity">Productivity</SelectItem>
                <SelectItem value="Image Generation">Image Generation</SelectItem>
                <SelectItem value="Video Editing">Video Editing</SelectItem>
                <SelectItem value="Code Assistant">Code Assistant</SelectItem>
                <SelectItem value="Voice & Audio">Voice & Audio</SelectItem>
                <SelectItem value="Research">Research</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Data Analysis">Data Analysis</SelectItem>
              </SelectContent>
            </Select>

            {/* Pricing */}
            <Select value={pricingFilter} onValueChange={setPricingFilter}>
              <SelectTrigger className="w-44 h-11 rounded-[14px] border-0 text-white" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)'
              }}>
                <SelectValue placeholder="Pricing" />
              </SelectTrigger>
              <SelectContent className="rounded-[14px] border-0" style={{
                background: 'rgba(29, 30, 26, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <SelectItem value="all">All Pricing</SelectItem>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Freemium">Freemium</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 h-11 rounded-[14px] border-0 text-white" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)'
              }}>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="rounded-[14px] border-0" style={{
                background: 'rgba(29, 30, 26, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                  setPricingFilter("all");
                }}
                className="px-4 py-2 rounded-[12px] text-sm font-medium transition-all duration-300"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}
              >
                Clear All
              </button>
            )}
          </div>

          {/* Results count */}
          <div className="text-center mt-6">
            <span className="text-sm text-neutral-500">
              Showing <span className="font-semibold text-white">{sortedTools.length}</span> of {tools.length} tools
            </span>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-96 rounded-[24px] animate-pulse" style={{
                background: 'rgba(255, 255, 255, 0.03)'
              }} />
            ))}
          </div>
        ) : sortedTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-[20px] flex items-center justify-center mx-auto mb-6" style={{
              background: 'rgba(255, 255, 255, 0.05)'
            }}>
              <Filter className="w-10 h-10 text-neutral-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No tools found
            </h3>
            <p className="text-neutral-400 mb-8">
              Try adjusting your filters or search query
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
                setPricingFilter("all");
              }}
              className="px-6 py-3 rounded-[14px] font-medium text-white"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}