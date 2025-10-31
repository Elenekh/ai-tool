import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink, Tag } from "lucide-react";
import { format } from "date-fns";

export default function NewsCard({ news }) {
  const categoryColors = {
    "Product Launch": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    "Feature Update": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    "Industry News": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    "Company Announcement": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    "Research": "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
    "Events": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400"
  };

  return (
    <Card className="card-hover bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 overflow-hidden group">
      <CardContent className="p-6">
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-3">
          <Badge className={categoryColors[news.category]}>
            {news.category}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(news.created_date), "MMM d, yyyy")}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {news.title}
        </h3>

        {/* Summary */}
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {news.summary}
        </p>

        {/* Source & Tags */}
        <div className="flex items-center justify-between">
          {news.source && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Source: {news.source}
            </span>
          )}
          {news.external_url && (
            <a
              href={news.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:gap-2 transition-all"
            >
              Read More
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            {news.tags.map((tag, index) => (
              <div key={index} className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Tag className="w-3 h-3" />
                <span>{tag}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}