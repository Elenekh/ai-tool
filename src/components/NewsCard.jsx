import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink, Tag } from "lucide-react";
import { format } from "date-fns";

export default function NewsCard({ news }) {
  const categoryColors = {
    "Product Launch": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "Feature Update": "bg-green-500/10 text-green-400 border-green-500/20",
    "Industry News": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "Company Announcement": "bg-orange-500/10 text-orange-400 border-orange-500/20",
    "Research": "bg-pink-500/10 text-pink-400 border-pink-500/20",
    "Events": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
  };

  return (
    <div className="banza-card banza-glow overflow-hidden group">
      <CardContent className="p-8">
        {/* Category Badge & Date */}
        <div className="flex items-center justify-between mb-4">
          <Badge className={`${categoryColors[news.category]} border rounded-[12px] px-4 py-1.5`}>
            {news.category}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>{format(new Date(news.created_date), "MMM d, yyyy")}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 leading-tight group-hover:text-orange-400 transition-colors duration-300">
          {news.title}
        </h3>

        {/* Summary */}
        <p className="text-neutral-400 mb-6 line-clamp-3 text-sm leading-relaxed">
          {news.summary}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4" style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          {news.source && (
            <span className="text-xs text-neutral-500">
              {news.source}
            </span>
          )}
          {news.external_url && (
            <a
              href={news.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 transition-all duration-300 font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              Read More
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {news.tags.slice(0, 3).map((tag, index) => (
              <div key={index} className="flex items-center gap-1 text-xs text-neutral-500 px-2.5 py-1 rounded-[8px]" style={{
                background: 'rgba(255, 255, 255, 0.03)'
              }}>
                <Tag className="w-3 h-3" />
                <span>{tag}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </div>
  );
}