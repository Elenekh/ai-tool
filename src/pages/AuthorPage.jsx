import React, { useState, useMemo } from "react";
import { useAuthor, useBlogPosts } from "@/hooks/useAPI";
import { useSearchParams, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MapPin, ExternalLink, Linkedin, Instagram, Github, Twitter, Globe, BookOpen, Eye, FileText, CheckCircle } from "lucide-react";
import BlogCard from "../components/BlogCard";

export default function AuthorPage() {
  const [searchParams] = useSearchParams();
  const authorSlug = searchParams.get('slug');
  const [sortBy, setSortBy] = useState("newest");

  // Fetch author data
  const { data: author, isLoading: authorLoading, error: authorError } = useAuthor(authorSlug);

  // Fetch all blog posts
  const { data: allPosts = [], isLoading: postsLoading } = useBlogPosts({
    ordering: '-created_at',
  });

  // Filter posts by author
  const authorPosts = useMemo(() => {
    if (!author) return [];
    
    let filtered = allPosts.filter(post => post.author === author.name);
    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'newest':
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });
    
    return filtered;
  }, [allPosts, author, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!authorPosts.length) return { totalPosts: 0, totalViews: 0, avgReadTime: 0 };
    
    const totalViews = authorPosts.reduce((sum, post) => sum + (post.views || 0), 0);
    const avgReadTime = Math.round(
      authorPosts.reduce((sum, post) => sum + (post.read_time || 0), 0) / authorPosts.length
    );
    
    return {
      totalPosts: authorPosts.length,
      totalViews,
      avgReadTime
    };
  }, [authorPosts]);

  if (authorLoading || postsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading author profile...</p>
        </div>
      </div>
    );
  }

  if (authorError || !author) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Author not found</h2>
          <Link to={createPageUrl("Blog")}>
            <Button variant="outline">Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const socialLinks = [
    { icon: Linkedin, url: author.linkedin_url, label: "LinkedIn", color: "hover:text-blue-600" },
    { icon: Twitter, url: author.twitter_url, label: "Twitter", color: "hover:text-sky-500" },
    { icon: Instagram, url: author.instagram_url, label: "Instagram", color: "hover:text-pink-600" },
    { icon: Github, url: author.github_url, label: "GitHub", color: "hover:text-gray-900 dark:hover:text-white" },
    { icon: Globe, url: author.personal_website, label: "Website", color: "hover:text-indigo-600" }
  ].filter(link => link.url);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Cover Image / Header Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50 dark:to-gray-950"></div>
        
        {/* Breadcrumbs */}
        <div className="absolute top-8 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={createPageUrl("Blog")}>
            <Button variant="ghost" className="text-white hover:bg-white/20 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Author Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {author.name}
            </h1>
            {author.is_verified && (
              <CheckCircle className="w-8 h-8 text-blue-500 fill-current" />
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Author Profile Card */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-2xl mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                {author.profile_image ? (
                  <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl border-4 border-white dark:border-gray-800">
                    <img
                      src={author.profile_image}
                      alt={author.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-xl border-4 border-white dark:border-gray-800">
                    <span className="text-5xl font-bold text-white">
                      {author.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                {/* Bio */}
                {author.bio && (
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {author.bio}
                  </p>
                )}

                {/* Location */}
                {author.location && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{author.location}</span>
                  </div>
                )}

                {/* Social Links */}
                {socialLinks.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    {socialLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 ${link.color} transition-all hover:scale-110`}
                        title={link.label}
                      >
                        <link.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl">
                    <div className="flex items-center justify-center mb-2">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalPosts}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Articles
                    </div>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl">
                    <div className="flex items-center justify-center mb-2">
                      <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalViews.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total Views
                    </div>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl">
                    <div className="flex items-center justify-center mb-2">
                      <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.avgReadTime}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Avg. Read Time
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Articles Section */}
        <div className="pb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Articles by {author.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {stats.totalPosts} article{stats.totalPosts !== 1 ? 's' : ''} published
              </p>
            </div>

            {/* Sort Dropdown */}
            {authorPosts.length > 1 && (
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Articles Grid */}
          {authorPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {authorPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <Card className="bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700">
              <CardContent className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No articles yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  This author hasn't published any articles yet. Check back soon!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}