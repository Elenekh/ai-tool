import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Eye } from "lucide-react";
import { format } from "date-fns";

export default function BlogCard({ post }) {
  if (!post) return null;

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
        {post.featured_image && (
          <div className="relative h-56 w-full overflow-hidden">
            <img
              src={post.featured_image}
              alt={post.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
            {post.category && (
              <Badge
                className={`absolute top-3 left-3 ${categoryColors[post.category]}`}
              >
                {post.category}
              </Badge>
            )}
          </div>
        )}

        {/* Card Content */}
        <CardContent className="p-5 space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2">
            {post.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
            {post.excerpt || post.description || ""}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pt-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(post.created_at), "MMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{post.reading_time || "3"} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{post.views || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
