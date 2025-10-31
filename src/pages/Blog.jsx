import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, SlidersHorizontal, TrendingUp, Clock, User } from "lucide-react";
import BlogCard from "../components/BlogCard";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => base44.entities.BlogPost.list('-created_date'),
  });

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts.filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = categoryFilter === "all" || post.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_date) - new Date(b.created_date);
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'newest':
        default:
          return new Date(b.created_date) - new Date(a.created_date);
      }
    });

    return filtered;
  }, [posts, searchQuery, categoryFilter, sortBy]);

  // Get unique authors for quick filtering
  const authors = useMemo(() => {
    const uniqueAuthors = [...new Set(posts.map(p => p.author))];
    return uniqueAuthors.sort();
  }, [posts]);

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
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{posts.length}</div>
              <div className="text-sm text-indigo-100">Articles</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{authors.length}</div>
              <div className="text-sm text-indigo-100">Authors</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{posts.reduce((sum, p) => sum + (p.views || 0), 0).toLocaleString()}</div>
              <div className="text-sm text-indigo-100">Total Views</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">Weekly</div>
              <div className="text-sm text-indigo-100">New Posts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters - Sticky */}
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
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Filters and Sorting */}
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

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Newest First
                  </div>
                </SelectItem>
                <SelectItem value="oldest">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Oldest First
                  </div>
                </SelectItem>
                <SelectItem value="popular">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Most Popular
                  </div>
                </SelectItem>
                <SelectItem value="author">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Author (A-Z)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Results count */}
            <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredAndSortedPosts.length}</span> of {posts.length} articles
            </div>
          </div>

          {/* Active Filters */}
          {(categoryFilter !== "all" || searchQuery) && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                }}
                className="h-7 text-red-600 hover:text-red-700"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredAndSortedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or filters
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}