import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight, Eye } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "./LanguageContext";

export default function BlogCard({ post }) {
  const { language } = useLanguage();
  
  const title = post[`title_${language}`] || post.title || "Untitled";
  const excerpt = post[`excerpt_${language}`] || post.excerpt || "";
  const tags = post[`tags_${language}`] || post.tags || [];

  const categoryColors = {
    "AI Tools": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "Tutorials": "bg-green-500/10 text-green-400 border-green-500/20",
    "Reviews": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "Updates": "bg-orange-500/10 text-orange-400 border-orange-500/20",
    "Case Studies": "bg-pink-500/10 text-pink-400 border-pink-500/20",
    "Productivity": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    "Education": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    "Other": "bg-neutral-500/10 text-neutral-400 border-neutral-500/20"
  };

  const authorSlug = post.author.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="banza-card banza-glow overflow-hidden group h-full flex flex-col">
      {/* Featured Image */}
      {post.featured_image && (
        <Link to={`${createPageUrl("BlogPost")}?id=${post.id}`}>
          <div className="aspect-video overflow-hidden relative">
            <img
              src={post.featured_image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {/* Category Badge Overlay */}
            {post.category && (
              <div className="absolute top-4 left-4">
                <Badge className={`${categoryColors[post.category] || categoryColors.Other} border rounded-[12px] px-4 py-1.5 backdrop-blur-md`}>
                  {post.category}
                </Badge>
              </div>
            )}
          </div>
        </Link>
      )}

      <CardContent className="p-8 flex-1 flex flex-col">
        {/* Category (if no image) */}
        {!post.featured_image && post.category && (
          <div className="mb-4">
            <Badge className={`${categoryColors[post.category] || categoryColors.Other} border rounded-[12px] px-4 py-1.5`}>
              {post.category}
            </Badge>
          </div>
        )}

        {/* Title */}
        <Link to={`${createPageUrl("BlogPost")}?id=${post.id}`}>
          <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 leading-tight group-hover:text-orange-400 transition-colors duration-300">
            {title}
          </h3>
        </Link>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-neutral-400 mb-6 line-clamp-3 flex-1 text-sm leading-relaxed">
            {excerpt}
          </p>
        )}

        {/* Meta Info */}
        <div className="space-y-4 mt-auto">
          {/* Author and Date Row */}
          <div className="flex items-center justify-between text-sm">
            <Link 
              to={`${createPageUrl("AuthorPage")}?slug=${authorSlug}`}
              className="flex items-center gap-2 text-neutral-400 hover:text-orange-400 transition-colors duration-300"
            >
              {post.author_avatar ? (
                <img 
                  src={post.author_avatar} 
                  alt={post.author}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10"
                />
              ) : (
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, #E5542E 0%, #1F6949 100%)'
                }}>
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="font-medium">{post.author}</span>
            </Link>
            <div className="flex items-center gap-1.5 text-neutral-500">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs">{format(new Date(post.created_date), "MMM d, yyyy")}</span>
            </div>
          </div>

          {/* Read Time and Views */}
          <div className="flex items-center justify-between text-xs text-neutral-500">
            {post.read_time && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.read_time} min read</span>
              </div>
            )}
            {post.views !== undefined && (
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>{post.views.toLocaleString()} views</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  className="bg-white/5 text-neutral-400 border-white/10 border rounded-[8px] px-2.5 py-0.5 text-xs"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </div>
  );
}