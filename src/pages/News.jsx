import React, { useState, useMemo } from "react";
import { useNews } from "@/hooks/useAPI";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Newspaper } from "lucide-react";
import NewsCard from "../components/NewsCard";
import { useLanguage } from "@/components/LanguageContext";

export default function News() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { language } = useLanguage();

  // Translations
  const translations = {
    title: { en: 'AI News & Updates', ka: 'AI სიახლეები და განახლებები' },
    subtitle: { en: 'Stay updated with the latest developments in the AI industry', ka: 'იყავით განახლებული AI ინდუსტრიის უახლესი განვითარებით' },
    searchPlaceholder: { en: 'Search news...', ka: 'მოძებნეთ სიახლეები...' },
    category: { en: 'Category', ka: 'კატეგორია' },
    allCategories: { en: 'All Categories', ka: 'ყველა კატეგორია' },
    productLaunch: { en: 'Product Launch', ka: 'პროდუქტის გამოშვება' },
    featureUpdate: { en: 'Feature Update', ka: 'ფუნქციის განახლება' },
    industryNews: { en: 'Industry News', ka: 'ინდუსტრიის სიახლეები' },
    companyAnnouncement: { en: 'Company Announcement', ka: 'კომპანიის განცხადება' },
    research: { en: 'Research', ka: 'კვლევა' },
    events: { en: 'Events', ka: 'ივენთები' },
    showing: { en: 'Showing', ka: 'ნაჩვენებია' },
    newsItem: { en: 'news item', ka: 'სიახლის ელემენტი' },
    newsItems: { en: 'news items', ka: 'სიახლის ელემენტი' },
    noNewsFound: { en: 'No news found', ka: 'სიახლეები არ მოიძებნა' },
    tryDifferent: { en: 'Try a different search term or category', ka: 'სცადეთ სხვა ძიების ტერმინი ან კატეგორია' },
  };

  const t = (key) => translations[key]?.[language] || translations[key]?.en || '';

  // Build API params
  const apiParams = useMemo(() => {
    const params = {
      ordering: '-created_at',
    };

    if (categoryFilter !== "all") {
      params.category = categoryFilter;
    }
    if (searchQuery) {
      params.search = searchQuery;
    }

    return params;
  }, [categoryFilter, searchQuery]);

  // Fetch news from API
  const { data, isLoading } = useNews(apiParams);

  // Normalize API response: support both array and paginated { results: [...] } responses
  const news = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (!data) return [];
    return data.results ?? [];
  }, [data]);

  // Client-side filtering
  const filteredNews = useMemo(() => {
    const q = (searchQuery || "").trim().toLowerCase();
    if (!q) return news;
    return news.filter(item => {
      const title = (item.title || "").toString().toLowerCase();
      const titleGe = (item.title_ge || "").toString().toLowerCase();
      const summary = (item.summary || "").toString().toLowerCase();
      const summaryGe = (item.summary_ge || "").toString().toLowerCase();
      return title.includes(q) || titleGe.includes(q) || summary.includes(q) || summaryGe.includes(q);
    });
  }, [news, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Newspaper className="w-12 h-12 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {t('title')}
            </h1>
          </div>
          <p className="text-xl text-indigo-100">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder={t('category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allCategories')}</SelectItem>
                <SelectItem value="Product Launch">{t('productLaunch')}</SelectItem>
                <SelectItem value="Feature Update">{t('featureUpdate')}</SelectItem>
                <SelectItem value="Industry News">{t('industryNews')}</SelectItem>
                <SelectItem value="Company Announcement">{t('companyAnnouncement')}</SelectItem>
                <SelectItem value="Research">{t('research')}</SelectItem>
                <SelectItem value="Events">{t('events')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredNews.length > 0 ? (
          <>
            <div className="mb-8">
              <p className="text-gray-600 dark:text-gray-400">
                {t('showing')} <span className="font-semibold text-gray-900 dark:text-white">{filteredNews.length}</span> {filteredNews.length === 1 ? t('newsItem') : t('newsItems')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('noNewsFound')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('tryDifferent')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}