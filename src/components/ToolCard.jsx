import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export default function ToolCard({ tool }) {
  const { language } = useLanguage();
  
  const name = tool[`name_${language}`] || tool.name || "Untitled";
  const description = tool[`description_${language}`] || tool.description || "";
  const keyFeatures = tool[`key_features_${language}`] || tool.key_features || [];

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-neutral-600'
        }`}
      />
    ));
  };

  const pricingColors = {
    Free: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Freemium: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Paid: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Enterprise: "bg-orange-500/10 text-orange-400 border-orange-500/20"
  };

  return (
    <Link to={`${createPageUrl("AIToolDetail")}?id=${tool.id}`} className="block h-full">
      <div className="banza-card banza-glow h-full overflow-hidden group cursor-pointer">
        <CardContent className="p-8 flex flex-col h-full">
          {/* Header with Logo */}
          <div className="flex items-start gap-4 mb-6">
            {tool.logo_url ? (
              <div className="w-16 h-16 rounded-[18px] overflow-hidden flex items-center justify-center p-2 flex-shrink-0 transition-all duration-300" style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
              }}>
                <img 
                  src={tool.logo_url} 
                  alt={`${name} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div 
                className="w-16 h-16 rounded-[18px] flex items-center justify-center flex-shrink-0"
                style={{
                  background: tool.brand_color 
                    ? `linear-gradient(135deg, ${tool.brand_color} 0%, ${tool.brand_color}dd 100%)` 
                    : 'linear-gradient(135deg, #E5542E 0%, #d94d29 100%)',
                  boxShadow: `0 4px 16px ${tool.brand_color ? tool.brand_color : '#E5542E'}40`
                }}
              >
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-orange-400 transition-colors duration-300">
                {name}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {renderStars(tool.rating)}
                </div>
                <span className="text-sm font-semibold text-neutral-300">
                  {tool.rating?.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-neutral-400 text-sm mb-6 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge className={`${pricingColors[tool.pricing]} border rounded-[10px] px-3 py-1`}>
              {tool.pricing}
            </Badge>
            <Badge className="bg-neutral-500/10 text-neutral-300 border-neutral-500/20 border rounded-[10px] px-3 py-1">
              {tool.difficulty}
            </Badge>
          </div>

          {/* Key Features */}
          {keyFeatures && keyFeatures.length > 0 && (
            <div className="space-y-2 mb-6 flex-1">
              {keyFeatures.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-neutral-400">
                  <span className="text-orange-400 mt-0.5 flex-shrink-0">•</span>
                  <span className="line-clamp-1">{feature}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action Button */}
          <button className="w-full py-3 px-6 rounded-[16px] font-semibold text-white text-sm transition-all duration-300 flex items-center justify-center gap-2 mt-auto" style={{
            background: 'linear-gradient(135deg, #E5542E 0%, #d94d29 100%)',
            boxShadow: '0 4px 16px rgba(229, 84, 46, 0.25)'
          }}>
            View Details
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </CardContent>
      </div>
    </Link>
  );
}