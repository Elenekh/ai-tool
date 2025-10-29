import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, BookOpen, SlidersHorizontal, TrendingUp, Clock, User, X } from "lucide-react";
import BlogCard from "../components/BlogCard";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => base44.entities.BlogPost.list('-created_date'),
  });

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

  const hasActiveFilters = categoryFilter !== "all" || searchQuery;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(31, 105, 73, 0.2) 0%, transparent 60%)'
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <BookOpen className="w-12 h-12 text-green-400" />
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Blog & Guides
            </h1>
          </div>
          <p className="text-xl text-neutral-400 mb-8">
            In-depth articles, tutorials, and insights from AI experts
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
            {[
              { value: posts.length, label: "Articles" },
              { value: new Set(posts.map(p => p.author)).size, label: "Authors" },
              { value: posts.reduce((sum, p) => sum + (p.views || 0), 0).toLocaleString(), label: "Views" },
              { value: "Weekly", label: "Updates" }
            ].map((stat, i) => (
              <div key={i} className="rounded-[18px] p-6 text-center" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-neutral-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="sticky top-36 z-40 py-6" style={{
        background: 'rgba(29, 30, 26, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="mb-5">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <Input
                placeholder="Search articles, authors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 h-12 rounded-[16px] border-0 text-white placeholder:text-neutral-500"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)'
                }}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 justify-center">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-44 h-10 rounded-[12px] border-0 text-white text-sm" style={{
                background: 'rgba(255, 255, 255, 0.05)'
              }}>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="rounded-[14px]" style={{
                background: 'rgba(29, 30, 26, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
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

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 h-10 rounded-[12px] border-0 text-white text-sm" style={{
                background: 'rgba(255, 255, 255, 0.05)'
              }}>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="rounded-[14px]" style={{
                background: 'rgba(29, 30, 26, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="author">Author (A-Z)</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                }}
                className="px-4 py-2 rounded-[12px] text-sm font-medium"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444'
                }}
              >
                Clear All
              </button>
            )}
          </div>

          {/* Results count */}
          <div className="text-center mt-5">
            <span className="text-sm text-neutral-500">
              <span className="font-semibold text-white">{filteredAndSortedPosts.length}</span> of {posts.length} articles
            </span>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-96 rounded-[24px] animate-pulse" style={{
                background: 'rgba(255, 255, 255, 0.03)'
              }} />
            ))}
          </div>
        ) : filteredAndSortedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
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
              No articles found
            </h3>
            <p className="text-neutral-400 mb-8">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}