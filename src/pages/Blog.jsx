import React, { useState, useMemo } from "react";
import { useBlogPosts } from "@/hooks/useAPI";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, SlidersHorizontal } from "lucide-react";
import BlogCard from "../components/BlogCard";
import { useLanguage } from "@/components/LanguageContext";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { language } = useLanguage();

  // Translations
  const translations = {
    title: language === 'ka' ? 'ბლოგი და სახელმძღვანელოები' : 'Blog & Guides',
    subtitle: language === 'ka' ? 'სიღრმის სტატიები, სახელმძღვანელოები და AI ექსპერტებისგან ინფორმაცია' : 'In-depth articles, tutorials, and insights from AI experts',
    publishedArticles: language === 'ka' ? 'გამოქვეყნებული სტატიები' : 'Published Articles',
    totalViews: language === 'ka' ? 'მთლიანი ნახვები' : 'Total Views',
    minReadTime: language === 'ka' ? 'წთ კითხვის დრო' : 'Min Read Time',
    authors: language === 'ka' ? 'ავტორი' : 'Authors',
    searchPlaceholder: language === 'ka' ? 'მოძებნეთ სტატიები, ავტორები ან AI თემები...' : 'Search articles, authors, or AI topics...',
    filterSort: language === 'ka' ? 'ფილტრი და დალაგება:' : 'Filter & Sort:',
    category: language === 'ka' ? 'კატეგორია' : 'Category',
    allCategories: language === 'ka' ? 'ყველა კატეგორია' : 'All Categories',
    sortBy: language === 'ka' ? 'დალაგება' : 'Sort By',
    newest: language === 'ka' ? 'ახალი პირველი' : 'Newest First',
    oldest: language === 'ka' ? 'ძველი პირველი' : 'Oldest First',
    popular: language === 'ka' ? 'ყველაზე პოპულარული' : 'Most Popular',
    author: language === 'ka' ? 'ავტორი (ა-ჰ)' : 'Author (A-Z)',
    showing: language === 'ka' ? 'ნაჩვენებია' : 'Showing',
    of: language === 'ka' ? '-დან' : 'of',
    articles: language === 'ka' ? 'სტატიები' : 'articles',
    activeFilters: language === 'ka' ? 'აქტიური ფილტრები:' : 'Active filters:',
    clear: language === 'ka' ? 'გასუფთავება' : 'Clear',
    clearAll: language === 'ka' ? 'ყველას გასუფთავება' : 'Clear All',
    noArticles: language === 'ka' ? 'სტატიები არ მოიძებნა' : 'No articles found',
    adjustSearch: language === 'ka' ? 'სცადეთ ძიების ან ფილტრების შეცვლა' : 'Try adjusting your search or filters',
    error: language === 'ka' ? 'სტატიების ჩამოტვირთვაში შეცდომა' : 'Error loading articles',
    tryAgain: language === 'ka' ? 'ხელახლა სცადეთ' : 'Try Again',
  };

  // Build API params
  const apiParams = useMemo(() => {
    const params = {
      ordering:
        sortBy === "oldest" ? "created_at" :
        sortBy === "popular" ? "-views" :
        sortBy === "author" ? "author" :
        "-created_at",
      published: "true",
    };

    if (categoryFilter !== "all") {
      params.category = categoryFilter;
    }

    if (searchQuery.trim()) {
      params.search = searchQuery;
    }

    return params;
  }, [categoryFilter, sortBy, searchQuery]);

  // Fetch blog posts
  const { data, isLoading, error } = useBlogPosts(apiParams);

  // Normalize API response
  const posts = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.results || [];
  }, [data]);

  // Client-side filtering
  const filteredAndSortedPosts = useMemo(() => {
    return posts.filter(post => {
      if (post.published === false) return false;

      const searchLower = searchQuery.toLowerCase().trim();
      if (searchLower) {
        const matchesSearch =
          (post.title || "").toLowerCase().includes(searchLower) ||
          (post.title_ge || "").toLowerCase().includes(searchLower) ||
          (post.excerpt || "").toLowerCase().includes(searchLower) ||
          (post.excerpt_ge || "").toLowerCase().includes(searchLower) ||
          (post.author || "").toLowerCase().includes(searchLower) ||
          (post.content || "").toLowerCase().includes(searchLower) ||
          (post.content_ge || "").toLowerCase().includes(searchLower) ||
          (post.tags && post.tags.some(tag => 
            (tag || "").toLowerCase().includes(searchLower)
          ));
        if (!matchesSearch) return false;
      }

      if (categoryFilter !== "all" && post.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [posts, searchQuery, categoryFilter]);

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setSortBy("newest");
  };

  const hasActiveFilters = categoryFilter !== "all" || searchQuery.trim() !== "";

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
              {translations.title}
            </h1>
          </div>
          <p className="text-xl text-indigo-100 mb-6">
            {translations.subtitle}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {posts.length}
              </div>
              <div className="text-sm text-indigo-100">{translations.publishedArticles}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {posts.reduce((sum, p) => sum + (p.views || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-indigo-100">{translations.totalViews}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {posts.reduce((sum, p) => sum + (p.read_time || 3), 0)}
              </div>
              <div className="text-sm text-indigo-100">{translations.minReadTime}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {new Set(posts.map(p => p.author)).size}
              </div>
              <div className="text-sm text-indigo-100">{translations.authors}</div>
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
                placeholder={translations.searchPlaceholder}
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
                  {translations.clear}
                </Button>
              )}
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium">{translations.filterSort}</span>
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder={translations.category} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{translations.allCategories}</SelectItem>
                <SelectItem value="AI Tools">AI Tools</SelectItem>
                <SelectItem value="Tutorials">{language === 'ka' ? 'სახელმძღვანელოები' : 'Tutorials'}</SelectItem>
                <SelectItem value="Reviews">{language === 'ka' ? 'მიმოხილვები' : 'Reviews'}</SelectItem>
                <SelectItem value="Updates">{language === 'ka' ? 'განახლებები' : 'Updates'}</SelectItem>
                <SelectItem value="Case Studies">{language === 'ka' ? 'შემთხვევების ანალიზი' : 'Case Studies'}</SelectItem>
                <SelectItem value="Productivity">{language === 'ka' ? 'პროდუქტიულობა' : 'Productivity'}</SelectItem>
                <SelectItem value="Education">{language === 'ka' ? 'განათლება' : 'Education'}</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By Filter */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder={translations.sortBy} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{translations.newest}</SelectItem>
                <SelectItem value="oldest">{translations.oldest}</SelectItem>
                <SelectItem value="popular">{translations.popular}</SelectItem>
                <SelectItem value="author">{translations.author}</SelectItem>
              </SelectContent>
            </Select>

            {/* Results Counter */}
            <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
              {translations.showing} <span className="font-semibold text-gray-900 dark:text-white">{filteredAndSortedPosts.length}</span> {translations.of} {posts.length} {translations.articles}
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 flex-wrap">
              <span className="text-sm text-gray-600 dark:text-gray-400">{translations.activeFilters}</span>
              
              {searchQuery && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="h-7"
                >
                  {translations.searchPlaceholder.split("...")[0]}: "{searchQuery}" ✕
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
                {translations.clearAll}
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
              <div
                key={i}
                className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-red-600 dark:text-red-400 mb-4">
              <p className="text-lg font-semibold">{translations.error}</p>
              <p className="text-sm mt-2">{error.message}</p>
            </div>
            <Button onClick={() => window.location.reload()} variant="outline">
              {translations.tryAgain}
            </Button>
          </div>
        ) : filteredAndSortedPosts.length > 0 ? (
          <div>
            <div className="mb-8">
              <p className="text-gray-600 dark:text-gray-400">
                {translations.showing} <span className="font-semibold text-gray-900 dark:text-white">{filteredAndSortedPosts.length}</span> {filteredAndSortedPosts.length === 1 ? translations.articles.slice(0, -1) : translations.articles}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedPosts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              {translations.noArticles}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {translations.adjustSearch}
            </p>
            <Button onClick={handleClearFilters} variant="outline">
              {translations.clearAll}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}