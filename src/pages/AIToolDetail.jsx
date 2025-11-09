import React, { useState, useEffect } from "react";
import { useTool } from "@/hooks/useAPI";
import { useSearchParams, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, ArrowLeft, ExternalLink, DollarSign, 
  Gauge, Users, Trophy, BookOpen, Lightbulb, 
  Target, Zap, AlertCircle, Play
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import ReviewSection from "../components/tool-detail/ReviewSection";
import SmartDemoSection from "../components/tool-detail/SmartDemoSection";
import { useLanguage } from "@/components/LanguageContext";
import { getLocalizedField } from "@/lib/localization";
import { translations } from "@/components/translations";

export default function AIToolDetail() {
  const [searchParams] = useSearchParams();
  const toolId = searchParams.get('id');
  const [hasViewed, setHasViewed] = useState(false);
  const { language } = useLanguage();
  const t = (key) => translations[key]?.[language] || translations[key]?.['en'] || '';

  const { data: tool, isLoading, error } = useTool(toolId);

  useEffect(() => {
    if (tool && !hasViewed) {
      setHasViewed(true);
      console.log("=== TOOL DATA ===");
      console.log("Tool object:", tool);
      console.log("Usage Steps:", tool.usage_steps);
      console.log("Demos:", tool.demos);
      console.log("Key Features:", tool.key_features);
    }
  }, [tool, hasViewed]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('noToolsFound')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error?.message || t('adjustFilters')}
          </p>
          <Link to={createPageUrl("AITools")}>
            <Button variant="outline">{t('backToBlog')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Helper functions
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  const getKeyFeatures = () => {
    if (!tool.key_features) return [];
    if (Array.isArray(tool.key_features)) {
      return tool.key_features
        .map(kf => getLocalizedField(kf, 'feature', language) || kf)
        .filter(f => f && String(f).trim().length > 0);
    }
    return [];
  };

  const getUsageSteps = () => {
    if (!tool.usage_steps) return [];
    if (Array.isArray(tool.usage_steps)) {
      return tool.usage_steps
        .map(us => getLocalizedField(us, 'step', language) || us)
        .filter(s => s && String(s).trim().length > 0);
    }
    return [];
  };

  const getDemos = () => {
    if (!tool.demos) return [];
    if (Array.isArray(tool.demos)) {
      return tool.demos.filter(d => d && d.title);
    }
    return [];
  };

  const getFirstDemo = () => {
    const demos = getDemos();
    if (demos.length === 0) return null;
    const firstDemo = demos[0];
    return {
      type: firstDemo.demo_type || 'other',
      prompt: firstDemo.input_prompt,
      result_text: firstDemo.output_text,
      result_image: firstDemo.output_image,
      result_video_url: firstDemo.output_video,
      result_audio_url: firstDemo.output_audio,
    };
  };

  const getAllDemosAsUseCases = () => {
    const demos = getDemos();
    return demos.map(demo => ({
      title: getLocalizedField(demo, 'title', language),
      description: getLocalizedField(demo, 'description', language),
      type: demo.demo_type,
      prompt: demo.input_prompt,
      result: demo.output_text,
      input_image_url: demo.input_image,
      output_image_url: demo.output_image,
      input_video_url: demo.input_video,
      output_video_url: demo.output_video,
      input_audio_url: demo.input_audio,
      output_audio_url: demo.output_audio,
    }));
  };

  const toolName = getLocalizedField(tool, 'name', language);
  const toolDescription = getLocalizedField(tool, 'description', language);
  const keyFeatures = getKeyFeatures();
  const usageSteps = getUsageSteps();
  const demos = getDemos();
  const firstDemo = getFirstDemo();
  const demosAsUseCases = getAllDemosAsUseCases();

  const infoCards = [
    { icon: DollarSign, label: t('pricing'), value: tool.pricing, color: "from-green-500 to-emerald-500" },
    { icon: Gauge, label: t('Complexity'), value: tool.difficulty, color: "from-orange-500 to-red-500" },
    { icon: Users, label: t('Users'), value: tool.users || "N/A", color: "from-blue-500 to-cyan-500" },
    { icon: Trophy, label: t('rating'), value: `${tool.rating?.toFixed(1) || 0}/5`, color: "from-yellow-500 to-amber-500" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to={createPageUrl("AITools")}>
            <Button variant="ghost" className="mb-6 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backTo')} {t('aiTools')}
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {tool.logo_url ? (
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 p-2 flex items-center justify-center">
                    <img 
                      src={tool.logo_url} 
                      alt={`${toolName} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      background: tool.brand_color 
                        ? `linear-gradient(135deg, ${tool.brand_color}, ${tool.brand_color}dd)` 
                        : 'linear-gradient(135deg, #667eea, #764ba2)'
                    }}
                  >
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                )}
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {toolName}
                  </h1>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {renderStars(tool.rating || 0)}
                    </div>
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      {tool.rating?.toFixed(1) || 0}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                {toolDescription}
              </p>
              <Badge className="text-base px-4 py-1">
                {tool.category}
              </Badge>
            </div>

            {/* CTA Button */}
            {tool.website_url && (
              <a href={tool.website_url} target="_blank" rel="noopener noreferrer">
                <Button 
                  className="px-8 py-6 text-lg text-white shadow-lg ripple"
                  style={{
                    background: tool.brand_color 
                      ? `linear-gradient(135deg, ${tool.brand_color}, ${tool.brand_color}dd)` 
                      : 'linear-gradient(135deg, #667eea, #764ba2)'
                  }}
                >
                  {t('tryTool')} {toolName}
                  <ExternalLink className="w-5 h-5 ml-2" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {infoCards.map((card, index) => (
            <Card key={index} className="card-hover bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {card.label}
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {card.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Live Demo */}
        {firstDemo && (
          <div className="mb-8">
            <SmartDemoSection tool={firstDemo} />
          </div>
        )}

        {/* Tabbed Content */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-xl">
          <CardContent className="p-0">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b border-gray-200 dark:border-gray-800 bg-transparent p-0 h-auto flex-wrap">
                <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-6 py-4">
                  <BookOpen className="w-4 h-4 mr-2" />
                  {t('overview')}
                </TabsTrigger>

                {usageSteps.length > 0 && (
                  <TabsTrigger value="guide" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-6 py-4">
                    <Target className="w-4 h-4 mr-2" />
                    {t('usageGuide')}
                  </TabsTrigger>
                )}

                {demosAsUseCases.length > 0 && (
                  <TabsTrigger value="usecases" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-6 py-4">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    {t('useCases')} ({demosAsUseCases.length})
                  </TabsTrigger>
                )}

                <TabsTrigger value="review" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-6 py-4">
                  <Star className="w-4 h-4 mr-2" />
                  {t('review')}
                </TabsTrigger>
              </TabsList>

              <div className="p-8">
                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-0">
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {language === 'ka' ? 'შესახებ' : 'About'} {toolName}
                      </h2>
                      <div className="prose prose-lg dark:prose-invert max-w-none">
                        {tool.overview ? (
                          <ReactMarkdown>{getLocalizedField(tool, 'overview', language)}</ReactMarkdown>
                        ) : (
                          <p className="text-gray-600 dark:text-gray-400">
                            {toolDescription}
                          </p>
                        )}
                      </div>
                    </div>

                    {keyFeatures.length > 0 && (
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                          {t('keyFeatures')}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {keyFeatures.map((feature, index) => (
                            <Card key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800">
                              <CardContent className="p-4 flex items-start gap-3">
                                <span 
                                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold shadow-lg" 
                                  style={{ background: tool.brand_color || '#667eea' }}
                                >
                                  {index + 1}
                                </span>
                                <span className="text-gray-800 dark:text-gray-200 flex-1 pt-1">
                                  {feature}
                                </span>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Usage Guide Tab */}
                {usageSteps.length > 0 && (
                  <TabsContent value="guide" className="mt-0">
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                          {t('usageGuide')} {toolName}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                          {language === 'ka' ? 'დაიცავით ეს ნაბიჯები' : 'Follow these steps'} {toolName}
                        </p>
                      </div>

                      <div className="space-y-4">
                        {usageSteps.map((step, idx) => (
                          <div key={idx} className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                              {idx + 1}
                            </div>
                            <div className="flex-1 pt-1">
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {step}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                )}

                {/* Use Cases Tab */}
                {demosAsUseCases.length > 0 && (
                  <TabsContent value="usecases" className="mt-0">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          {t('useCases')}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                          {language === 'ka' ? 'ბეჭდი რეალური მაგალითები, თუ როგორ შეიძლება გამოყენებულ იქნეს' : 'Real-world examples of how'} {toolName}
                        </p>
                      </div>

                      <div className="space-y-6">
                        {demosAsUseCases.map((useCase, idx) => (
                          <Card key={idx} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 overflow-hidden">
                            <CardContent className="p-6 space-y-4">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                  {idx + 1}
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {useCase.title}
                                  </h3>
                                  {useCase.type && (
                                    <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                                      {language === 'ka' ? 'ტიპი:' : 'Type:'} {useCase.type}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {useCase.description && (
                                <p className="text-gray-700 dark:text-gray-300">
                                  {useCase.description}
                                </p>
                              )}

                              {(useCase.prompt || useCase.result) && (
                                <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-3">
                                  {useCase.prompt && (
                                    <div>
                                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        📝 {language === 'ka' ? 'შეყვანა' : 'Prompt'}
                                      </p>
                                      <p className="text-gray-600 dark:text-gray-400 italic">
                                        "{useCase.prompt}"
                                      </p>
                                    </div>
                                  )}

                                  {useCase.result && (
                                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        ✨ {language === 'ka' ? 'შედეგი' : 'Result'}
                                      </p>
                                      <p className="text-gray-600 dark:text-gray-400">
                                        {useCase.result}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                )}

                {/* Review Tab */}
                <TabsContent value="review" className="mt-0">
                  <ReviewSection tool={tool} />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Floating CTA */}
      {tool.website_url && (
        <div className="fixed bottom-8 right-8 z-50 hidden lg:block">
          <a href={tool.website_url} target="_blank" rel="noopener noreferrer">
            <Button 
              className="px-6 py-6 text-lg text-white shadow-2xl hover:scale-105 transition-transform duration-200"
              style={{
                background: tool.brand_color 
                  ? `linear-gradient(135deg, ${tool.brand_color}, ${tool.brand_color}dd)` 
                  : 'linear-gradient(135deg, #667eea, #764ba2)'
              }}
            >
              {t('tryTool')} {toolName}
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}