
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Copy, Check, Image as ImageIcon, ArrowRight, Type, Edit3, FileText, Code, Sparkles, Video, Mic, Search, BarChart, Play, Volume2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";

const iconMap = {
  "text-to-image": Type,
  "image-to-image": ImageIcon,
  "edit": Edit3,
  "generate": Sparkles,
  "rewrite": FileText,
  "code": Code,
  "text-to-video": Video,
  "video-to-video": Video,
  "image-to-video": Video,
  "text-to-speech": Mic,
  "voice-clone": Mic,
  "research": Search,
  "analyze": BarChart,
  "transcribe": Mic,
  "translate": FileText,
  "summarize": FileText,
  "brainstorm": Sparkles,
  "compare": BarChart,
  "improve": Edit3,
  "complete": Code,
  "refactor": Code,
  "synthesize": BarChart,
  "verify": Check,
  "explain": FileText,
  "extract": BarChart,
  "expand": FileText,
  "simplify": FileText,
  "convert": Edit3,
  "customize": Edit3,
  "sync": Video,
  "ai-generate": Sparkles,
  "redesign": Edit3,
  "review": Search,
  "production": Video,
  "search": Search
};

const getIconForType = (type) => {
  const Icon = iconMap[type] || Sparkles;
  return <Icon className="w-4 h-4" />;
};

// Helper function to detect if URL is a YouTube/Vimeo embed
const getEmbedUrl = (url) => {
  if (!url) return null;
  
  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('youtu.be') 
      ? url.split('/').pop().split('?')[0]
      : new URLSearchParams(url.split('?')[1]).get('v');
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // Vimeo
  if (url.includes('vimeo.com')) {
    const videoId = url.split('/').pop();
    return `https://player.vimeo.com/video/${videoId}`;
  }
  
  // Direct video file
  return url;
};

// Media Player Component
const MediaPlayer = ({ videoUrl, audioUrl, imageUrl, label, brandColor }) => {
  const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : null;
  const isEmbed = embedUrl && embedUrl !== videoUrl;

  if (videoUrl) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 ${label === 'Input' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'} rounded-lg flex items-center justify-center`}>
            <Video className={`w-4 h-4 ${label === 'Input' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`} />
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {label}
          </span>
        </div>
        <div className={`group relative rounded-xl overflow-hidden border-2 ${label === 'Input' ? 'border-blue-200 dark:border-blue-800' : 'border-green-200 dark:border-green-800'} shadow-lg hover:shadow-2xl transition-shadow duration-300`}>
          {isEmbed ? (
            <iframe
              src={embedUrl}
              className="w-full aspect-video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`${label} video`}
            />
          ) : (
            <video
              controls
              className="w-full h-auto"
              preload="metadata"
              title={`${label} video`}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          <div className={`absolute inset-0 bg-gradient-to-t ${label === 'Input' ? 'from-blue-900/50' : 'from-green-900/50'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
        </div>
      </div>
    );
  }

  if (audioUrl) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 ${label === 'Input' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'} rounded-lg flex items-center justify-center`}>
            <Mic className={`w-4 h-4 ${label === 'Input' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`} />
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {label}
          </span>
        </div>
        <div className={`rounded-xl border-2 ${label === 'Input' ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20' : 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20'} p-6 shadow-lg`}>
          <audio
            controls
            className="w-full"
            preload="metadata"
            title={`${label} audio`}
          >
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        </div>
      </div>
    );
  }

  if (imageUrl) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 ${label === 'Input' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'} rounded-lg flex items-center justify-center`}>
            <ImageIcon className={`w-4 h-4 ${label === 'Input' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`} />
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {label}
          </span>
        </div>
        <div className={`group relative rounded-xl overflow-hidden border-2 ${label === 'Input' ? 'border-blue-200 dark:border-blue-800' : 'border-green-200 dark:border-green-800'} shadow-lg hover:shadow-2xl transition-shadow duration-300`}>
          <img
            src={imageUrl}
            alt={`${label} preview`}
            className="w-full h-auto"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${label === 'Input' ? 'from-blue-900/50' : 'from-green-900/50'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        </div>
      </div>
    );
  }

  return null;
};

export default function UseCasesList({ useCases, toolName, brandColor, filterCategories }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [selectedType, setSelectedType] = useState("all");

  // Handle if useCases is a string (old format) or not an array
  if (!useCases) {
    return (
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Use Cases
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Use case examples coming soon...
        </p>
      </div>
    );
  }

  // If useCases is a string (old markdown format), display it as markdown
  if (typeof useCases === 'string') {
    return (
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Use Cases
        </h3>
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{useCases}</ReactMarkdown>
        </div>
      </div>
    );
  }

  // If useCases is not an array, show error message
  if (!Array.isArray(useCases) || useCases.length === 0) {
    return (
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Use Cases
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Use case examples coming soon...
        </p>
      </div>
    );
  }

  // Use custom filter categories if provided, otherwise detect from use cases
  let filters = [];
  if (filterCategories && Array.isArray(filterCategories) && filterCategories.length > 0) {
    filters = filterCategories;
  } else {
    // Auto-detect unique types from use cases
    const uniqueTypes = [...new Set(useCases.map(uc => uc.type).filter(Boolean))];
    filters = uniqueTypes.map(type => ({
      name: type,
      label: type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' → '),
      color: 'blue'
    }));
  }

  // Filter use cases by type
  const filteredUseCases = selectedType === "all" 
    ? useCases 
    : useCases.filter(uc => uc.type === selectedType);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const copyPrompt = (index, prompt) => {
    navigator.clipboard.writeText(prompt);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getFilterColor = (color) => {
    const colorMap = {
      blue: "bg-blue-600 hover:bg-blue-700",
      purple: "bg-purple-600 hover:bg-purple-700",
      green: "bg-green-600 hover:bg-green-700",
      orange: "bg-orange-600 hover:bg-orange-700",
      pink: "bg-pink-600 hover:bg-pink-700",
      indigo: "bg-indigo-600 hover:bg-indigo-700",
      red: "bg-red-600 hover:bg-red-700",
      cyan: "bg-cyan-600 hover:bg-cyan-700",
      yellow: "bg-yellow-600 hover:bg-yellow-700"
    };
    return colorMap[color] || colorMap.blue;
  };

  const getTypeBadgeColor = (type) => {
    // Map types to colors
    if (type?.includes('image')) return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
    if (type?.includes('video')) return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    if (type?.includes('text') || type?.includes('generate')) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    if (type?.includes('edit') || type?.includes('improve')) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    if (type?.includes('code')) return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
    if (type?.includes('speech') || type?.includes('voice')) return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400";
    if (type?.includes('research') || type?.includes('analyze')) return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400";
    return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {toolName ? `${toolName} Use Cases` : 'Popular Use Cases'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Common ways people use this tool in their workflows — click to see detailed examples
        </p>
      </div>

      {/* Dynamic Filter Buttons */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <Button
            variant={selectedType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("all")}
            className={selectedType === "all" ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700" : ""}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            All Cases
          </Button>
          {filters.map((filter) => (
            <Button
              key={filter.name}
              variant={selectedType === filter.name ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(filter.name)}
              className={selectedType === filter.name ? `${getFilterColor(filter.color)} text-white` : ""}
            >
              {getIconForType(filter.name)}
              <span className="ml-2">{filter.label}</span>
            </Button>
          ))}
        </div>
      )}

      {/* Use Cases List */}
      <div className="space-y-4">
        {filteredUseCases.map((useCase, index) => {
          const hasMedia = useCase.input_video_url || useCase.output_video_url || 
                          useCase.input_audio_url || useCase.output_audio_url ||
                          useCase.input_image_url || useCase.output_image_url;
          
          return (
            <Card
              key={index}
              className="overflow-hidden border-gray-200 dark:border-gray-800 card-hover cursor-pointer"
              onClick={() => toggleExpand(index)}
            >
              <CardContent className="p-0">
                {/* Header */}
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-shrink-0">
                      {expandedIndex === index ? (
                        <ChevronDown className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {useCase.title}
                        </h4>
                        {useCase.type && (
                          <Badge className={getTypeBadgeColor(useCase.type)}>
                            {getIconForType(useCase.type)}
                            <span className="ml-1">
                              {filters.find(f => f.name === useCase.type)?.label || useCase.type}
                            </span>
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {useCase.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    {hasMedia && (
                      <>
                        {(useCase.input_video_url || useCase.output_video_url) && (
                          <Video className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        )}
                        {(useCase.input_audio_url || useCase.output_audio_url) && (
                          <Mic className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        )}
                        {/* Only show ImageIcon if no video/audio is present */}
                        {(useCase.input_image_url || useCase.output_image_url) && 
                         !useCase.input_video_url && !useCase.output_video_url && 
                         !useCase.input_audio_url && !useCase.output_audio_url && (
                          <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        )}
                      </>
                    )}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                      Case {index + 1}
                    </span>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedIndex === index && (
                  <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                    {/* Media Display */}
                    {hasMedia && (
                      <div className="mb-6">
                        <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4 flex items-center gap-2">
                          {(useCase.input_video_url || useCase.output_video_url) && <Video className="w-4 h-4" />}
                          {(useCase.input_audio_url || useCase.output_audio_url) && <Mic className="w-4 h-4" />}
                          {(useCase.input_image_url || useCase.output_image_url) && !useCase.input_video_url && !useCase.output_video_url && !useCase.input_audio_url && !useCase.output_audio_url && <ImageIcon className="w-4 h-4" />}
                          Visual Example
                        </h5>
                        <div className="relative">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Input Media */}
                            <MediaPlayer
                              videoUrl={useCase.input_video_url}
                              audioUrl={useCase.input_audio_url}
                              imageUrl={useCase.input_image_url}
                              label="Input"
                              brandColor={brandColor}
                            />

                            {/* Arrow indicator */}
                            {((useCase.input_video_url || useCase.input_audio_url || useCase.input_image_url) && 
                             (useCase.output_video_url || useCase.output_audio_url || useCase.output_image_url)) && (
                              <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                                <div 
                                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg animate-pulse"
                                  style={{
                                    background: brandColor 
                                      ? `linear-gradient(135deg, ${brandColor}, ${brandColor}dd)` 
                                      : 'linear-gradient(135deg, #667eea, #764ba2)'
                                  }}
                                >
                                  <ArrowRight className="w-6 h-6 text-white" />
                                </div>
                              </div>
                            )}

                            {/* Output Media */}
                            <MediaPlayer
                              videoUrl={useCase.output_video_url}
                              audioUrl={useCase.output_audio_url}
                              imageUrl={useCase.output_image_url}
                              label="Output"
                              brandColor={brandColor}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Prompt */}
                    {useCase.prompt && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                            Prompt Example
                          </h5>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyPrompt(index, useCase.prompt);
                            }}
                            className="h-8"
                          >
                            {copiedIndex === index ? (
                              <>
                                <Check className="w-3 h-3 mr-1" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
                          <p className="text-gray-800 dark:text-gray-200 font-mono text-sm leading-relaxed">
                            "{useCase.prompt}"
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Result */}
                    {useCase.result && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
                          Expected Result
                        </h5>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {useCase.result}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {filteredUseCases.length === 0 && (
          <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
            <CardContent className="p-12 text-center">
              <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Cases Found
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try selecting a different filter to see more examples
              </p>
              <Button onClick={() => setSelectedType("all")} variant="outline">
                Show All Cases
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
