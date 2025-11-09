// components/BlogCard.jsx - Updated with Georgian support and images

import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Eye } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/components/LanguageContext";
import { getLocalizedField } from "@/lib/localization";

export default function BlogCard({ post }) {
  if (!post) return null;

  const { language } = useLanguage();

  // Get localized content
  const title = getLocalizedField(post, 'title', language);
  const excerpt = getLocalizedField(post, 'excerpt', language);
  const readTime = post.read_time || 5;
  const views = post.views || 0;

  // Category colors
  const categoryColors = {
    "AI Tools": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    "Tutorials": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    "Reviews": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    "Updates": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    "Case Studies": "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
    "Productivity": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
    "Education": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
    "Research": "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
  };

  // Get featured image - prioritize featured_image, fallback to first blog image
  const featuredImage = post.featured_image || 
    (post.images && post.images.length > 0 ? post.images[0].image : null);

  // Format date based on language
  const formattedDate = post.created_at ? 
    format(new Date(post.created_at), language === 'ka' ? 'dd MMM yyyy' : 'MMM dd, yyyy') :
    'Unknown date';

  return (
    <Link
      to={{
        pathname: createPageUrl("BlogPost"),
        search: `?id=${post.id}`,
      }}
      state={{ postId: post.id }}
      className="block group"
    >
      <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        {/* Featured Image */}
        {featuredImage && (
          <div className="relative h-56 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
            <img
              src={featuredImage}
              alt={title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {/* Category Badge */}
            {post.category && (
              <div className="absolute top-3 left-3">
                <Badge
                  className={categoryColors[post.category] || "bg-gray-100 text-gray-800"}
                >
                  {post.category}
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Card Content */}
        <CardContent className="p-5 space-y-4">
          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2 transition-colors">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
            {excerpt || "No excerpt available"}
          </p>

          {/* Meta Info - Date, Read Time, Views */}
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 pt-2 flex-wrap">
            {/* Date */}
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>

            {/* Read Time */}
            {readTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{readTime} {language === 'ka' ? 'წთ' : 'min'}</span>
              </div>
            )}

            {/* Views */}
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{views.toLocaleString()}</span>
            </div>
          </div>

          {/* Author - Optional */}
          {post.author && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                By <span className="font-medium text-gray-900 dark:text-white">{post.author}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}