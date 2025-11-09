import React, { useState, useMemo } from "react";
import { useTools } from "@/hooks/useAPI";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToolCard from "../components/ToolCard";
import { useLanguage } from "@/components/LanguageContext";

export default function AITools() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [pricingFilter, setPricingFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { language } = useLanguage();

  // Translations
  const translations = {
    title: language === 'ka' ? 'AI ხელსაწყოების დირექტორია' : 'AI Tools Directory',
    subtitle: language === 'ka' ? 'აღმოაჩინეთ და შეადარეთ 200+ ხელოვნური ინტელექტის ხელსაწყოები' : 'Discover and compare 200+ cutting-edge AI tools',
    searchPlaceholder: language === 'ka' ? 'მოძებნეთ AI ხელსაწყოები...' : 'Search AI tools...',
    filterSort: language === 'ka' ? 'ფილტრი და დალაგება:' : 'Filter & Sort:',
    category: language === 'ka' ? 'კატეგორია' : 'Category',
    allCategories: language === 'ka' ? 'ყველა კატეგორია' : 'All Categories',
    pricing: language === 'ka' ? 'ფასი' : 'Pricing',
    allPricing: language === 'ka' ? 'ყველა ფასი' : 'All Pricing',
    difficulty: language === 'ka' ? 'სირთულე' : 'Difficulty',
    allLevels: language === 'ka' ? 'ყველა დონე' : 'All Levels',
    sortBy: language === 'ka' ? 'დალაგება' : 'Sort By',
    newest: language === 'ka' ? 'ახალი პირველი' : 'Newest First',
    oldest: language === 'ka' ? 'ძველი პირველი' : 'Oldest First',
    rating: language === 'ka' ? 'ყველაზე მაღალი რეიტინგი' : 'Highest Rated',
    activeFilters: language === 'ka' ? 'აქტიური ფილტრები:' : 'Active filters:',
    search: language === 'ka' ? 'ძებნა' : 'Search',
    clearAll: language === 'ka' ? 'ყველას გასუფთავება' : 'Clear All',
    showing: language === 'ka' ? 'ნაჩვენებია' : 'Showing',
    tools: language === 'ka' ? 'ხელსაწყო' : 'tools',
    noTools: language === 'ka' ? 'ხელსაწყოები არ მოიძებნა' : 'No tools found',
    adjustFilters: language === 'ka' ? 'სცადეთ ფილტრების ან ძიების შეცვლა' : 'Try adjusting your filters or search query',
    // Pricing options
    free: language === 'ka' ? 'უფასო' : 'Free',
    freemium: language === 'ka' ? 'ფრიმიუმი' : 'Freemium',
    paid: language === 'ka' ? 'ფასიანი' : 'Paid',
    enterprise: language === 'ka' ? 'საწარმო' : 'Enterprise',
    // Difficulty options
    beginner: language === 'ka' ? 'დამწყები' : 'Beginner',
    intermediate: language === 'ka' ? 'საშუალო' : 'Intermediate',
    advanced: language === 'ka' ? 'მოწინავე' : 'Advanced',
  };

  // Category translations
  const categoryTranslations = {
    'Writing': language === 'ka' ? 'წერა' : 'Writing',
    'Design': language === 'ka' ? 'დიზაინი' : 'Design',
    'Presentation': language === 'ka' ? 'პრეზენტაცია' : 'Presentation',
    'Productivity': language === 'ka' ? 'პროდუქტიულობა' : 'Productivity',
    'Image Generation': language === 'ka' ? 'სურათის გენერაცია' : 'Image Generation',
    'Video Editing': language === 'ka' ? 'ვიდეო მონტაჟი' : 'Video Editing',
    'Code Assistant': language === 'ka' ? 'კოდის ასისტენტი' : 'Code Assistant',
    'Voice & Audio': language === 'ka' ? 'ხმა და აუდიო' : 'Voice & Audio',
    'Research': language === 'ka' ? 'კვლევა' : 'Research',
    'Marketing': language === 'ka' ? 'მარკეტინგი' : 'Marketing',
    'Data Analysis': language === 'ka' ? 'მონაცემთა ანალიზი' : 'Data Analysis',
    'Education': language === 'ka' ? 'განათლება' : 'Education',
    'Business': language === 'ka' ? 'ბიზნესი' : 'Business',
    'Music & Audio': language === 'ka' ? 'მუსიკა და აუდიო' : 'Music & Audio',
    '3D & Animation': language === 'ka' ? '3D და ანიმაცია' : '3D & Animation',
    'Translation': language === 'ka' ? 'თარგმნა' : 'Translation',
    'Customer Service': language === 'ka' ? 'მომხმარებლის მომსახურება' : 'Customer Service',
    'Content Creation': language === 'ka' ? 'კონტენტის შექმნა' : 'Content Creation',
    'Other': language === 'ka' ? 'სხვა' : 'Other',
  };

  // Build query params for API
  const apiParams = useMemo(() => {
    const params = {
      ordering: sortBy === "newest" ? "-created_at" : 
                sortBy === "rating" ? "-rating" : 
                "name",
    };

    if (categoryFilter !== "all") {
      params.category = categoryFilter;
    }
    if (pricingFilter !== "all") {
      params.pricing = pricingFilter;
    }
    if (difficultyFilter !== "all") {
      params.difficulty = difficultyFilter;
    }
    if (searchQuery) {
      params.search = searchQuery;
    }

    return params;
  }, [categoryFilter, pricingFilter, difficultyFilter, sortBy, searchQuery]);

  // Fetch tools from API
  const { data: toolsData = [], isLoading } = useTools(apiParams);

  // Normalize tools data
  const allTools = useMemo(() => {
    if (!toolsData) return [];
    if (Array.isArray(toolsData)) return toolsData;
    if (toolsData.results && Array.isArray(toolsData.results)) return toolsData.results;
    return [];
  }, [toolsData]);

  // Client-side filtering
  const filteredTools = useMemo(() => {
    return allTools.filter(tool => {
      if (!tool || !tool.id) return false;
      
      const matchesSearch = 
        (tool.name && tool.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tool.name_ge && tool.name_ge.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tool.description && tool.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tool.description_ge && tool.description_ge.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesSearch;
    });
  }, [allTools, searchQuery]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setPricingFilter("all");
    setDifficultyFilter("all");
    setSortBy("newest");
  };

  const hasActiveFilters = 
    searchQuery || 
    categoryFilter !== "all" || 
    pricingFilter !== "all" || 
    difficultyFilter !== "all";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {translations.title}
          </h1>
          <p className="text-xl text-indigo-100">
            {translations.subtitle} ({allTools.length})
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="sticky top-16 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder={translations.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder={translations.category} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{translations.allCategories}</SelectItem>
                {Object.keys(categoryTranslations).map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {categoryTranslations[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Pricing Filter */}
            <Select value={pricingFilter} onValueChange={setPricingFilter}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder={translations.pricing} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{translations.allPricing}</SelectItem>
                <SelectItem value="Free">{translations.free}</SelectItem>
                <SelectItem value="Freemium">{translations.freemium}</SelectItem>
                <SelectItem value="Paid">{translations.paid}</SelectItem>
                <SelectItem value="Enterprise">{translations.enterprise}</SelectItem>
              </SelectContent>
            </Select>

            {/* Difficulty Filter */}
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder={translations.difficulty} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{translations.allLevels}</SelectItem>
                <SelectItem value="Beginner">{translations.beginner}</SelectItem>
                <SelectItem value="Intermediate">{translations.intermediate}</SelectItem>
                <SelectItem value="Advanced">{translations.advanced}</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder={translations.sortBy} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{translations.newest}</SelectItem>
                <SelectItem value="oldest">{translations.oldest}</SelectItem>
                <SelectItem value="rating">{translations.rating}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 flex-wrap">
              <span className="text-sm text-gray-600 dark:text-gray-400">{translations.activeFilters}</span>
              {searchQuery && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="h-7"
                >
                  {translations.search}: "{searchQuery}"
                  <span className="ml-1">×</span>
                </Button>
              )}
              {categoryFilter !== "all" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCategoryFilter("all")}
                  className="h-7"
                >
                  {categoryTranslations[categoryFilter]}
                  <span className="ml-1">×</span>
                </Button>
              )}
              {pricingFilter !== "all" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPricingFilter("all")}
                  className="h-7"
                >
                  {pricingFilter}
                  <span className="ml-1">×</span>
                </Button>
              )}
              {difficultyFilter !== "all" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setDifficultyFilter("all")}
                  className="h-7"
                >
                  {difficultyFilter}
                  <span className="ml-1">×</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-7 text-red-600 hover:text-red-700 ml-auto"
              >
                {translations.clearAll}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredTools.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-600 dark:text-gray-400">
                {translations.showing} <span className="font-semibold text-gray-900 dark:text-white">{filteredTools.length}</span> {translations.tools}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTools.filter(tool => tool && tool.id).map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Filter className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              {translations.noTools}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {translations.adjustFilters}
            </p>
            <Button onClick={handleClearFilters} variant="outline">
              {translations.clearAll}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}