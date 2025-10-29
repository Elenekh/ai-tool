
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useSearchParams, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, ArrowLeft, ExternalLink, DollarSign, 
  Gauge, Users, Trophy, BookOpen, Lightbulb, 
  MessageSquare, Target, Zap
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import PromptBuilder from "../components/tool-detail/PromptBuilder";
import UseCasesList from "../components/tool-detail/UseCasesList";
import ReviewSection from "../components/tool-detail/ReviewSection";

export default function AIToolDetail() {
  const [searchParams] = useSearchParams();
  const toolId = searchParams.get('id');

  const { data: tool, isLoading } = useQuery({
    queryKey: ['tool', toolId],
    queryFn: async () => {
      const tools = await base44.entities.AITool.filter({ id: toolId });
      return tools[0];
    },
    enabled: !!toolId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading tool details...</p>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tool not found</h2>
          <Link to={createPageUrl("AITools")}>
            <Button variant="outline">Back to Tools</Button>
          </Link>
        </div>
      </div>
    );
  }

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

  const infoCards = [
    { icon: DollarSign, label: "Pricing", value: tool.pricing, color: "from-green-500 to-emerald-500" },
    { icon: Gauge, label: "Complexity", value: tool.difficulty, color: "from-orange-500 to-red-500" },
    { icon: Users, label: "Users", value: tool.users || "N/A", color: "from-blue-500 to-cyan-500" },
    { icon: Trophy, label: "Rating", value: `${tool.rating}/5`, color: "from-yellow-500 to-amber-500" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to={createPageUrl("AITools")}>
            <Button variant="ghost" className="mb-6 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tools
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row md:items-start gap-8">
            {/* Tool Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {tool.logo_url ? (
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 p-2 flex items-center justify-center">
                    <img 
                      src={tool.logo_url} 
                      alt={`${tool.name} logo`}
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
                    {tool.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {renderStars(tool.rating)}
                    </div>
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      {tool.rating?.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                {tool.description}
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
                  Try {tool.name}
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

        {/* Tabbed Content */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-xl">
          <CardContent className="p-0">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b border-gray-200 dark:border-gray-800 bg-transparent p-0 h-auto flex-wrap">
                <TabsTrigger 
                  value="overview" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-6 py-4"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="guide" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-6 py-4"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Usage Guide
                </TabsTrigger>
                <TabsTrigger 
                  value="cases" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-6 py-4"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Use Cases
                </TabsTrigger>
                <TabsTrigger 
                  value="prompts" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-6 py-4"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Prompt Builder
                </TabsTrigger>
                <TabsTrigger 
                  value="review" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-6 py-4"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Review
                </TabsTrigger>
              </TabsList>

              <div className="p-8">
                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-0">
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        About {tool.name}
                      </h2>
                      <div className="prose prose-lg dark:prose-invert max-w-none">
                        {tool.overview ? (
                          <ReactMarkdown>{tool.overview}</ReactMarkdown>
                        ) : (
                          <p className="text-gray-600 dark:text-gray-400">
                            {tool.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {tool.key_features && tool.key_features.length > 0 && (
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                          Key Features
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {tool.key_features.map((feature, index) => (
                            <Card key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800">
                              <CardContent className="p-4 flex items-start gap-3">
                                <span 
                                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold shadow-lg"
                                  style={{
                                    background: tool.brand_color || '#667eea'
                                  }}
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
                <TabsContent value="guide" className="mt-0">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      Step-by-Step Usage Guide for {tool.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Follow these steps to get started with {tool.name}
                    </p>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      {tool.usage_guide ? (
                        <ReactMarkdown>{tool.usage_guide}</ReactMarkdown>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">
                          Usage guide coming soon...
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Use Cases Tab */}
                <TabsContent value="cases" className="mt-0">
                  <UseCasesList 
                    useCases={tool.use_cases} 
                    toolName={tool.name}
                    brandColor={tool.brand_color}
                    filterCategories={tool.filter_categories}
                  />
                </TabsContent>

                {/* Prompt Builder Tab */}
                <TabsContent value="prompts" className="mt-0">
                  <PromptBuilder tool={tool} />
                </TabsContent>

                {/* Review Tab */}
                <TabsContent value="review" className="mt-0">
                  <ReviewSection tool={tool} />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Floating CTA Button */}
      {tool.website_url && (
        <div className="fixed bottom-8 right-8 z-50 hidden lg:block">
          <a href={tool.website_url} target="_blank" rel="noopener noreferrer">
            <Button 
              className="px-6 py-6 text-lg text-white shadow-2xl hover:shadow-3xl ripple rounded-full"
              style={{
                background: tool.brand_color 
                  ? `linear-gradient(135deg, ${tool.brand_color}, ${tool.brand_color}dd)` 
                  : 'linear-gradient(135deg, #667eea, #764ba2)'
              }}
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Try {tool.name}
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}
