import React, { useState, useMemo } from "react";
import { useTools } from "@/hooks/useAPI";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToolCard from "../components/ToolCard";

export default function AITools() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [pricingFilter, setPricingFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Build query params for API
  const apiParams = useMemo(() => {
    const params = {
      ordering: sortBy === "newest" ? "-created_at" : 
                sortBy === "rating" ? "-rating" : 
                "name",
    };

    if (categoryFilter !== "all") {
      params.category = categoryFilter;
    }
    if (pricingFilter !== "all") {
      params.pricing = pricingFilter;
    }
    if (difficultyFilter !== "all") {
      params.difficulty = difficultyFilter;
    }
    if (searchQuery) {
      params.search = searchQuery;
    }

    return params;
  }, [categoryFilter, pricingFilter, difficultyFilter, sortBy, searchQuery]);

  // Fetch tools from API
  const { data: toolsData = [], isLoading } = useTools(apiParams);

  // Normalize tools data - handle both array and paginated response
  const tools = useMemo(() => {
    if (!toolsData) return [];
    if (Array.isArray(toolsData)) return toolsData;
    if (toolsData.results && Array.isArray(toolsData.results)) return toolsData.results;
    return [];
  }, [toolsData]);

  // Client-side filtering (since API doesn't support full-text search on all fields)
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      if (!tool || !tool.id) return false; // Safety check
      
      const matchesSearch = 
        (tool.name && tool.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tool.description && tool.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesSearch;
    });
  }, [tools, searchQuery]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setPricingFilter("all");
    setDifficultyFilter("all");
    setSortBy("newest");
  };

  const hasActiveFilters = 
    searchQuery || 
    categoryFilter !== "all" || 
    pricingFilter !== "all" || 
    difficultyFilter !== "all";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI Tools Directory
          </h1>
          <p className="text-xl text-indigo-100">
            Discover and compare {tools.length}+ cutting-edge AI tools
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="sticky top-16 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search AI tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
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
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            {/* Pricing Filter */}
            <Select value={pricingFilter} onValueChange={setPricingFilter}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Pricing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pricing</SelectItem>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Freemium">Freemium</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>

            {/* Difficulty Filter */}
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 flex-wrap">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
              {searchQuery && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="h-7"
                >
                  Search: "{searchQuery}"
                  <span className="ml-1">×</span>
                </Button>
              )}
              {categoryFilter !== "all" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCategoryFilter("all")}
                  className="h-7"
                >
                  {categoryFilter}
                  <span className="ml-1">×</span>
                </Button>
              )}
              {pricingFilter !== "all" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPricingFilter("all")}
                  className="h-7"
                >
                  {pricingFilter}
                  <span className="ml-1">×</span>
                </Button>
              )}
              {difficultyFilter !== "all" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setDifficultyFilter("all")}
                  className="h-7"
                >
                  {difficultyFilter}
                  <span className="ml-1">×</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-7 text-red-600 hover:text-red-700 ml-auto"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredTools.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredTools.length}</span> tool{filteredTools.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTools.filter(tool => tool && tool.id).map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Filter className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No tools found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your filters or search query
            </p>
            <Button onClick={handleClearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}