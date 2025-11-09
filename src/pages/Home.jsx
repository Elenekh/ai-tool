import React, { useMemo } from "react";
import { 
  useTools, 
  useBlogPosts, 
  useNews 
} from "@/hooks/useAPI";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, BookOpen, Newspaper, ArrowRight, Zap, Target, Users } from "lucide-react";
import ToolCard from "../components/ToolCard";
import BlogCard from "../components/BlogCard";
import NewsCard from "../components/NewsCard";
import { useLanguage } from "@/components/LanguageContext";
import { getLocalizedField } from "@/lib/localization";

export default function Home() {
  const { language } = useLanguage();
  
  // Fetch featured tools
  const { data: toolsData = [], isLoading: toolsLoading } = useTools({
    ordering: '-created_at',
  });
  
  // Helper function to safely extract array from data
  const extractArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.results && Array.isArray(data.results)) return data.results;
    return [];
  };

  // Normalize tools data
  const allTools = useMemo(() => extractArray(toolsData), [toolsData]);
  const featuredTools = allTools.slice(0, 3);

  // Fetch recent blog posts
  const { data: postsData = [], isLoading: postsLoading } = useBlogPosts({
    ordering: '-created_at',
  });

  // Normalize blog posts data
  const recentPosts = useMemo(() => extractArray(postsData), [postsData]);

  // Fetch recent news
  const { data: newsData = [], isLoading: newsLoading } = useNews({
    ordering: '-created_at',
  });

  // Normalize news data
  const recentNews = useMemo(() => extractArray(newsData), [newsData]);

  // Translations
  const translations = {
    heroTitle1: language === 'ka' ? 'აღმოაჩინეთ და დაეუფლეთ' : 'Discover & Master',
    heroTitle2: language === 'ka' ? 'ხვალინდელ AI ხელსაწყოებს' : 'AI Tools of Tomorrow',
    heroSubtitle: language === 'ka' 
      ? 'ყოვლისმომცველი მიმოხილვები, სახელმძღვანელოები და უახლესი განახლებები ყველაზე ძლიერი AI ხელსაწყოების შესახებ, რომლებიც აყალიბებენ ჩვენს მომავალს.'
      : 'Comprehensive reviews, step-by-step guides, and the latest updates on the most powerful AI tools shaping our future.',
    exploreTools: language === 'ka' ? 'გამოიკვლიეთ ხელსაწყოები' : 'Explore AI Tools',
    readGuides: language === 'ka' ? 'წაიკითხეთ სახელმძღვანელოები' : 'Read Guides',
    toolsReviewed: language === 'ka' ? 'მიმოხილული ხელსაწყოები' : 'AI Tools Reviewed',
    articles: language === 'ka' ? 'სტატიები' : 'Articles Published',
    updates: language === 'ka' ? 'ყოველთვიური განახლება' : 'Monthly Updates',
    featuredTools: language === 'ka' ? 'პოპულარული AI ხელსაწყოები' : 'Featured AI Tools',
    featuredDesc: language === 'ka' 
      ? 'შერჩეული ხელსაწყოები, რომლებიც არიან ღირებული AI სფეროში'
      : 'Hand-picked tools that are making waves in the AI community',
    viewAllTools: language === 'ka' ? 'ყველა ხელსაწყოს ნახვა' : 'View All AI Tools',
    latestArticles: language === 'ka' ? 'უახლესი სტატიები' : 'Latest Articles',
    articlesDesc: language === 'ka' 
      ? 'AI ექსპერტებისგან სიღრმისეული სახელმძღვანელოები და ინფორმაცია'
      : 'In-depth guides and insights from AI experts',
    viewAllPosts: language === 'ka' ? 'ყველა სტატიის ნახვა' : 'View All Posts',
    latestNews: language === 'ka' ? 'სიახლეები' : 'Latest AI News',
    newsDesc: language === 'ka' 
      ? 'იყავით განახლებული AI ინდუსტრიის განვითარებებით'
      : 'Stay updated with the AI industry\'s hottest developments',
    viewAllNews: language === 'ka' ? 'ყველა სიახლის ნახვა' : 'View All News',
    ready: language === 'ka' ? 'მზად ხართ შეიცნოთ მომავალი?' : 'Ready to Explore the Future?',
    readyDesc: language === 'ka' 
      ? 'დაუკავშირდით პროფესიონალებს, რითიც აღმოაჩენთ და დაეუფლებით უახლეს AI ხელსაწყოებს'
      : 'Join thousands of professionals discovering and mastering the latest AI tools',
    startExploring: language === 'ka' ? 'დაიწყეთ გამოკვლევა ახლავე' : 'Start Exploring Now',
  };

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
                {language === 'ka' ? 'თქვენი AI აღმოჩენის Hub' : 'Your AI Discovery Hub'}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {translations.heroTitle1}
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                {translations.heroTitle2}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              {translations.heroSubtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={createPageUrl("AITools")}>
                <Button className="px-8 py-6 text-lg theme-gradient hover:theme-gradient-hover text-white shadow-xl hover:shadow-2xl transition-all ripple">
                  <Zap className="w-5 h-5 mr-2" />
                  {translations.exploreTools}
                </Button>
              </Link>
              <Link to={createPageUrl("Blog")}>
                <Button variant="outline" className="px-8 py-6 text-lg border-2 hover:bg-gray-50 dark:hover:bg-gray-900">
                  <BookOpen className="w-5 h-5 mr-2" />
                  {translations.readGuides}
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
            {/* AI Tools Reviewed - Dynamic */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 text-center">
              <Target className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {toolsLoading ? '...' : allTools.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {translations.toolsReviewed}
              </div>
            </div>

            {/* Articles Published - Dynamic */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 text-center">
              <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {postsLoading ? '...' : recentPosts.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {translations.articles}
              </div>
            </div>

            {/* Monthly Updates - Static */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 text-center">
              <TrendingUp className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                100+
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {translations.updates}
              </div>
            </div>

            {/* Readers - Commented out for future use
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 text-center">
              <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                50K+
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Active Readers
              </div>
            </div>
            */}
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      {!toolsLoading && featuredTools.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {translations.featuredTools}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {translations.featuredDesc}
              </p>
            </div>
            <Link to={createPageUrl("AITools")}>
              <Button variant="outline" className="hidden md:flex items-center gap-2">
                {translations.viewAllTools}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTools.filter(tool => tool && tool.id).map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          <div className="mt-8 md:hidden text-center">
            <Link to={createPageUrl("AITools")}>
              <Button variant="outline" className="w-full sm:w-auto">
                {translations.viewAllTools}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Latest Blog Posts Section */}
      {!postsLoading && recentPosts.length > 0 && (
        <section className="bg-white dark:bg-gray-900 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                    {translations.latestArticles}
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {translations.articlesDesc}
                </p>
              </div>
              <Link to={createPageUrl("Blog")}>
                <Button variant="outline" className="hidden md:flex items-center gap-2">
                  {translations.viewAllPosts}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.slice(0, 3).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            <div className="mt-8 md:hidden text-center">
              <Link to={createPageUrl("Blog")}>
                <Button variant="outline" className="w-full sm:w-auto">
                  {translations.viewAllPosts}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest News Section */}
      {!newsLoading && recentNews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Newspaper className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                  {translations.latestNews}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {translations.newsDesc}
              </p>
            </div>
            <Link to={createPageUrl("News")}>
              <Button variant="outline" className="hidden md:flex items-center gap-2">
                {translations.viewAllNews}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentNews.slice(0, 3).map((newsItem) => (
              <NewsCard key={newsItem.id} news={newsItem} />
            ))}
          </div>

          <div className="mt-8 md:hidden text-center">
            <Link to={createPageUrl("News")}>
              <Button variant="outline" className="w-full sm:w-auto">
                {translations.viewAllNews}
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
            {translations.ready}
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            {translations.readyDesc}
          </p>
          <Link to={createPageUrl("AITools")}>
            <Button className="px-8 py-6 text-lg bg-white text-indigo-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all ripple">
              {translations.startExploring}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}