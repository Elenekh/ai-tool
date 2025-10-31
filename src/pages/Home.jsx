import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, BookOpen, Newspaper, ArrowRight, Zap, Target, Users } from "lucide-react";
import ToolCard from "../components/ToolCard";
import BlogCard from "../components/BlogCard";
import NewsCard from "../components/NewsCard";
import { useLanguage } from "@/components/LanguageContext";
import { translations } from "@/components/translations";

export default function Home() {
  const { t } = useLanguage();
  
  const { data: featuredTools = [] } = useQuery({
    queryKey: ['featuredTools'],
    queryFn: () => base44.entities.AITool.filter({ is_featured: true }, '-created_date', 3),
  });

  const { data: recentPosts = [] } = useQuery({
    queryKey: ['recentPosts'],
    queryFn: () => base44.entities.BlogPost.list('-created_date', 3),
  });

  const { data: recentNews = [] } = useQuery({
    queryKey: ['recentNews'],
    queryFn: () => base44.entities.NewsItem.list('-created_date', 3),
  });

  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50 dark:to-gray-950"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-900 shadow-lg mb-8 border border-indigo-100 dark:border-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Your AI Discovery Hub
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t(translations.heroTitle1)}
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                {t(translations.heroTitle2)}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              {t(translations.heroSubtitle)}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={createPageUrl("AITools")}>
                <Button className="px-8 py-6 text-lg theme-gradient hover:theme-gradient-hover text-white shadow-xl hover:shadow-2xl transition-all ripple">
                  <Zap className="w-5 h-5 mr-2" />
                  {t(translations.exploreTools)}
                </Button>
              </Link>
              <Link to={createPageUrl("Blog")}>
                <Button variant="outline" className="px-8 py-6 text-lg border-2 hover:bg-gray-50 dark:hover:bg-gray-900">
                  <BookOpen className="w-5 h-5 mr-2" />
                  {t(translations.readGuides)}
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
            {[
              { icon: Target, label: t(translations.Reviewed), value: "200+" },
              { icon: Users, label: t(translations.Readers), value: "50K+" },
              { icon: TrendingUp, label: t(translations.Updates), value: "100+" }
            ].map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 text-center">
                <stat.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      {featuredTools.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Featured {t(translations.aiTools)}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Hand-picked tools that are making waves in the AI community
              </p>
            </div>
            <Link to={createPageUrl("AITools")}>
              <Button variant="outline" className="hidden md:flex items-center gap-2">
                {t(translations.viewAll)} {t(translations.aiTools)}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          <div className="mt-8 md:hidden text-center">
            <Link to={createPageUrl("AITools")}>
              <Button variant="outline" className="w-full sm:w-auto">
                {t(translations.viewAll)} {t(translations.aiTools)}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Latest Blog Posts Section */}
      {recentPosts.length > 0 && (
        <section className="bg-white dark:bg-gray-900 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                    Latest {t(translations.articles)}
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  In-depth guides and insights from AI experts
                </p>
              </div>
              <Link to={createPageUrl("Blog")}>
                <Button variant="outline" className="hidden md:flex items-center gap-2">
                  {t(translations.viewAll)} Posts
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            <div className="mt-8 md:hidden text-center">
              <Link to={createPageUrl("Blog")}>
                <Button variant="outline" className="w-full sm:w-auto">
                  {t(translations.viewAll)} Posts
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest News Section */}
      {recentNews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Newspaper className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Latest {t(translations.news)}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Stay updated with the AI industry's hottest developments
              </p>
            </div>
            <Link to={createPageUrl("News")}>
              <Button variant="outline" className="hidden md:flex items-center gap-2">
                {t(translations.viewAll)} {t(translations.news)}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentNews.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>

          <div className="mt-8 md:hidden text-center">
            <Link to={createPageUrl("News")}>
              <Button variant="outline" className="w-full sm:w-auto">
                {t(translations.viewAll)} {t(translations.news)}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Explore the Future?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of professionals discovering and mastering the latest AI tools
          </p>
          <Link to={createPageUrl("AITools")}>
            <Button className="px-8 py-6 text-lg bg-white text-indigo-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all ripple">
              {t(translations.startExploring)}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}