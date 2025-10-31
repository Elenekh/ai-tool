import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight, Sparkles } from "lucide-react";

export default function ToolCard({ tool }) {
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  const pricingColors = {
    Free: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    Freemium: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    Paid: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    Enterprise: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
  };

  const difficultyColors = {
    Beginner: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    Intermediate: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    Advanced: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400"
  };

  return (
    <Card className="card-hover bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 overflow-hidden group">
      <CardContent className="p-6">
        {/* Header with Icon/Logo */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {tool.logo_url ? (
                <div className="w-10 h-10 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 p-1 flex items-center justify-center">
                  <img 
                    src={tool.logo_url} 
                    alt={`${tool.name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 theme-gradient rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {tool.name}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
              {tool.description}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1">
            {renderStars(tool.rating)}
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {tool.rating?.toFixed(1)}
          </span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={pricingColors[tool.pricing]}>
            {tool.pricing}
          </Badge>
          <Badge className={difficultyColors[tool.difficulty]}>
            {tool.difficulty}
          </Badge>
          <Badge variant="outline" className="border-gray-300 dark:border-gray-700">
            {tool.category}
          </Badge>
        </div>

        {/* Key Features */}
        {tool.key_features && tool.key_features.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Key Features:
            </p>
            <ul className="space-y-1">
              {tool.key_features.slice(0, 3).map((feature, index) => (
                <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                  <span className="text-indigo-500 mt-1">•</span>
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Link to={`${createPageUrl("AIToolDetail")}?id=${tool.id}`} className="w-full">
          <Button className="w-full theme-gradient hover:theme-gradient-hover text-white shadow-md group-hover:shadow-lg transition-all ripple">
            View Details
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}