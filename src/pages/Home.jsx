import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
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
    queryFn: () => base44.entities.AITool.filter({ is_featured: true }, '-created_date', 6),
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
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          background: 'radial-gradient(circle at 30% 20%, rgba(229, 84, 46, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(31, 105, 73, 0.12) 0%, transparent 50%)'
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-[16px] mb-10 transition-all duration-300" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)'
            }}>
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-semibold text-neutral-300">
                Your AI Discovery Hub
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-[1.1]">
              <span className="text-white">
                {t(translations.heroTitle1)}
              </span>
              <br />
              <span style={{ 
                background: 'linear-gradient(135deg, #E5542E 0%, #1F6949 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {t(translations.heroTitle2)}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-neutral-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t(translations.heroSubtitle)}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={createPageUrl("AITools")}>
                <button className="px-8 py-4 rounded-[16px] font-semibold text-white text-lg flex items-center gap-2 transition-all duration-300" style={{
                  background: 'linear-gradient(135deg, #E5542E 0%, #d94d29 100%)',
                  boxShadow: '0 8px 24px rgba(229, 84, 46, 0.3)'
                }}>
                  <Zap className="w-5 h-5" />
                  {t(translations.exploreTools)}
                </button>
              </Link>
              <Link to={createPageUrl("Blog")}>
                <button className="px-8 py-4 rounded-[16px] font-semibold text-white text-lg flex items-center gap-2 transition-all duration-300" style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)'
                }}>
                  <BookOpen className="w-5 h-5" />
                  {t(translations.readGuides)}
                </button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-4xl mx-auto">
            {[
              { icon: Target, label: t(translations.Reviewed), value: "200+" },
              { icon: Users, label: t(translations.Readers), value: "50K+" },
              { icon: TrendingUp, label: t(translations.Updates), value: "100+" }
            ].map((stat, index) => (
              <div key={index} className="rounded-[20px] p-8 text-center transition-all duration-300 hover:scale-105" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}>
                <stat.icon className="w-8 h-8 text-orange-400 mx-auto mb-4" />
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-neutral-400 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      {featuredTools.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-3">
                Featured {t(translations.aiTools)}
              </h2>
              <p className="text-neutral-400">
                Hand-picked tools making waves in the AI community
              </p>
            </div>
            <Link to={createPageUrl("AITools")} className="hidden md:block">
              <button className="px-6 py-3 rounded-[14px] font-medium text-sm text-neutral-300 flex items-center gap-2 transition-all duration-300" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                {t(translations.viewAll)} {t(translations.aiTools)}
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Blog Posts */}
      {recentPosts.length > 0 && (
        <section className="py-24" style={{
          background: 'rgba(42, 38, 33, 0.3)'
        }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="w-8 h-8 text-orange-400" />
                  <h2 className="text-4xl font-bold text-white">
                    Latest {t(translations.articles)}
                  </h2>
                </div>
                <p className="text-neutral-400">
                  In-depth guides and insights from AI experts
                </p>
              </div>
              <Link to={createPageUrl("Blog")} className="hidden md:block">
                <button className="px-6 py-3 rounded-[14px] font-medium text-sm text-neutral-300 flex items-center gap-2" style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  {t(translations.viewAll)} Posts
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest News */}
      {recentNews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Newspaper className="w-8 h-8 text-orange-400" />
                <h2 className="text-4xl font-bold text-white">
                  Latest {t(translations.news)}
                </h2>
              </div>
              <p className="text-neutral-400">
                Stay updated with AI industry developments
              </p>
            </div>
            <Link to={createPageUrl("News")} className="hidden md:block">
              <button className="px-6 py-3 rounded-[14px] font-medium text-sm text-neutral-300 flex items-center gap-2" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                {t(translations.viewAll)} {t(translations.news)}
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentNews.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(229, 84, 46, 0.1) 0%, rgba(31, 105, 73, 0.08) 100%)'
        }}></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 rounded-[20px] flex items-center justify-center mx-auto mb-8" style={{
            background: 'linear-gradient(135deg, #E5542E 0%, #1F6949 100%)',
            boxShadow: '0 8px 32px rgba(229, 84, 46, 0.3)'
          }}>
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Explore the Future?
          </h2>
          <p className="text-xl text-neutral-400 mb-10 leading-relaxed">
            Join thousands of professionals discovering and mastering the latest AI tools
          </p>
          <Link to={createPageUrl("AITools")}>
            <button className="px-10 py-5 rounded-[16px] font-bold text-white text-lg transition-all duration-300 inline-flex items-center gap-3" style={{
              background: 'linear-gradient(135deg, #E5542E 0%, #d94d29 100%)',
              boxShadow: '0 8px 32px rgba(229, 84, 46, 0.4)'
            }}>
              {t(translations.startExploring)}
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}