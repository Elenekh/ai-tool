import React, { useState, useMemo } from "react";
import { useBlogPosts } from "@/hooks/useAPI";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, SlidersHorizontal, TrendingUp, Clock, User } from "lucide-react";
import BlogCard from "../components/BlogCard";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Build API params with proper filtering
  const apiParams = useMemo(() => {
    const params = {
      ordering:
        sortBy === "oldest" ? "created_at" :
        sortBy === "popular" ? "-views" :
        sortBy === "author" ? "author" :
        "-created_at",
      published: "true",  // ✅ ONLY SHOW PUBLISHED POSTS - Filter on backend
    };

    // Apply category filter if selected
    if (categoryFilter !== "all") {
      params.category = categoryFilter;
    }

    // Apply search filter if entered
    if (searchQuery.trim()) {
      params.search = searchQuery;
    }

    console.log("API Params:", params); // Debug: check what's being sent

    return params;
  }, [categoryFilter, sortBy, searchQuery]);

  // Fetch blog posts from API with filters
  const { data, isLoading, error } = useBlogPosts(apiParams);

  // Normalize API response (handle both array and paginated responses)
  const posts = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.results || [];
  }, [data]);

  // Client-side filtering for additional safety
  const filteredAndSortedPosts = useMemo(() => {
    return posts.filter(post => {
      // Double-check published status (defensive programming)
      if (post.published === false) return false;

      // Search across multiple fields
      const searchLower = searchQuery.toLowerCase().trim();
      if (searchLower) {
        const matchesSearch =
          (post.title || "").toLowerCase().includes(searchLower) ||
          (post.excerpt || "").toLowerCase().includes(searchLower) ||
          (post.author || "").toLowerCase().includes(searchLower) ||
          (post.content || "").toLowerCase().includes(searchLower) ||
          (post.tags && post.tags.some(tag => 
            (tag || "").toLowerCase().includes(searchLower)
          ));
        if (!matchesSearch) return false;
      }

      // Category filter (though API should handle this)
      if (categoryFilter !== "all" && post.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [posts, searchQuery, categoryFilter]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setSortBy("newest");
  };

  const hasActiveFilters = categoryFilter !== "all" || searchQuery.trim() !== "";

  // Error handling
  if (error) {
    console.error("Error fetching blog posts:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <BookOpen className="w-12 h-12 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Blog & Guides
            </h1>
          </div>
          <p className="text-xl text-indigo-100 mb-6">
            In-depth articles, tutorials, and insights from AI experts
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {posts.length}
              </div>
              <div className="text-sm text-indigo-100">Published Articles</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {posts.reduce((sum, p) => sum + (p.views || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-indigo-100">Total Views</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {posts.reduce((sum, p) => sum + (p.read_time || 3), 0)}
              </div>
              <div className="text-sm text-indigo-100">Min Read Time</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {new Set(posts.map(p => p.author)).size}
              </div>
              <div className="text-sm text-indigo-100">Authors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters - Sticky */}
      <div className="sticky top-16 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search articles, authors, or AI topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-12 text-base bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium">Filter & Sort:</span>
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="AI Tools">AI Tools</SelectItem>
                <SelectItem value="Tutorials">Tutorials</SelectItem>
                <SelectItem value="Reviews">Reviews</SelectItem>
                <SelectItem value="Updates">Updates</SelectItem>
                <SelectItem value="Case Studies">Case Studies</SelectItem>
                <SelectItem value="Productivity">Productivity</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By Filter */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="author">Author (A-Z)</SelectItem>
              </SelectContent>
            </Select>

            {/* Results Counter */}
            <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredAndSortedPosts.length}</span> of {posts.length} articles
            </div>
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
                  Search: "{searchQuery}" ✕
                </Button>
              )}
              
              {categoryFilter !== "all" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCategoryFilter("all")}
                  className="h-7"
                >
                  {categoryFilter} ✕
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

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          // Loading State
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <div
                key={i}
                className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          // Error State
          <div className="text-center py-20">
            <div className="text-red-600 dark:text-red-400 mb-4">
              <p className="text-lg font-semibold">Error loading articles</p>
              <p className="text-sm mt-2">{error.message}</p>
            </div>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        ) : filteredAndSortedPosts.length > 0 ? (
          // Success State with Posts
          <div>
            <div className="mb-8">
              <p className="text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredAndSortedPosts.length}</span> article{filteredAndSortedPosts.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedPosts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        ) : (
          // Empty State
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or filters
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