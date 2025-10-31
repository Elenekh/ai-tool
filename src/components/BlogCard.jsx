import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight, Eye } from "lucide-react";
import { format } from "date-fns";

export default function BlogCard({ post }) {
  const categoryColors = {
    "AI Tools": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    "Tutorials": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    "Reviews": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    "Updates": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    "Case Studies": "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
    "Productivity": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
    "Education": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
    "Other": "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  };

  // Generate slug from author name (simple version)
  const authorSlug = post.author.toLowerCase().replace(/\s+/g, '-');

  return (
    <Card className="card-hover bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 overflow-hidden group h-full flex flex-col">
      {/* Featured Image */}
      {post.featured_image && (
        <Link to={`${createPageUrl("BlogPost")}?id=${post.id}`}>
          <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Category Badge Overlay */}
            {post.category && (
              <div className="absolute top-3 left-3">
                <Badge className={`${categoryColors[post.category] || categoryColors.Other} shadow-lg`}>
                  {post.category}
                </Badge>
              </div>
            )}
          </div>
        </Link>
      )}

      <CardContent className="p-6 flex-1 flex flex-col">
        {/* Category (if no image) */}
        {!post.featured_image && post.category && (
          <div className="mb-3">
            <Badge className={categoryColors[post.category] || categoryColors.Other}>
              {post.category}
            </Badge>
          </div>
        )}

        {/* Title */}
        <Link to={`${createPageUrl("BlogPost")}?id=${post.id}`}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-1">
            {post.excerpt}
          </p>
        )}

        {/* Meta Info */}
        <div className="space-y-3 mt-auto">
          {/* Author and Date Row */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <Link 
              to={`${createPageUrl("AuthorPage")}?slug=${authorSlug}`}
              className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {post.author_avatar ? (
                <img 
                  src={post.author_avatar} 
                  alt={post.author}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
              )}
              <span className="font-medium">{post.author}</span>
            </Link>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(post.created_date), "MMM d, yyyy")}</span>
            </div>
          </div>

          {/* Read Time and Views Row */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
            {post.read_time && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.read_time} min read</span>
              </div>
            )}
            {post.views !== undefined && (
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.views.toLocaleString()} views</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Read More Link */}
          <Link
            to={`${createPageUrl("BlogPost")}?id=${post.id}`}
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:gap-3 transition-all text-sm pt-2"
          >
            Read Article
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}