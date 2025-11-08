import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Copy, Check, Image as ImageIcon, ArrowRight, Type, Edit3, FileText, Code, Sparkles, Video, Mic, Search, BarChart, Play, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const iconMap = {
  "text-to-text": Type,
  "text-to-image": ImageIcon,
  "text-to-video": Video,
  "text-to-audio": Mic,
  "image-to-image": ImageIcon,
  "image-to-video": Video,
  "image-to-text": Type,
  "audio-to-text": Type,
  "video-to-text": Type,
  "multi-modal": Sparkles,
};

const getIconForType = (type) => {
  const Icon = iconMap[type] || Sparkles;
  return <Icon className="w-4 h-4" />;
};

// Helper to detect if URL is a YouTube/Vimeo embed
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
const MediaPlayer = ({ videoUrl, audioUrl, imageUrl, label }) => {
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
        </div>
      </div>
    );
  }

  return null;
};

export default function UseCasesList({ toolName }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Get demos from the tool data passed via props or from the context
  // This will be populated from the API response
  const [demos, setDemos] = React.useState([]);

  // Get demos - they come from the parent component (AIToolDetail)
  React.useEffect(() => {
    // The parent component will pass demos as a prop
    // This is handled in AIToolDetail.jsx where it passes tool.demos
  }, []);

  // This component expects to receive demos as children or props
  // For now, we'll show a message if no demos are available
  if (!demos || demos.length === 0) {
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

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const copyPrompt = (index, prompt) => {
    navigator.clipboard.writeText(prompt);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getTypeBadgeColor = (type) => {
    const colors = {
      "text-to-text": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      "text-to-image": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      "text-to-video": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      "text-to-audio": "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
      "image-to-image": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      "image-to-video": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      "image-to-text": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      "audio-to-text": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      "video-to-text": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
      "multi-modal": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
    };
    return colors[type] || colors["text-to-text"];
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {toolName ? `${toolName} Use Cases & Examples` : 'Popular Use Cases'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Real-world examples showing what you can accomplish — click to expand and see detailed demos
        </p>
      </div>

      {/* Use Cases List */}
      <div className="space-y-4">
        {demos.map((demo, index) => {
          const hasMedia = demo.input_video || demo.output_video ||
            demo.input_audio || demo.output_audio ||
            demo.input_image || demo.output_image;

          return (
            <Card
              key={demo.id}
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
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {demo.title}
                        </h4>
                        {demo.demo_type && (
                          <Badge className={getTypeBadgeColor(demo.demo_type)}>
                            {getIconForType(demo.demo_type)}
                            <span className="ml-1">
                              {demo.demo_type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' → ')}
                            </span>
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {demo.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    {hasMedia && (
                      <>
                        {(demo.input_video || demo.output_video) && (
                          <Video className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        )}
                        {(demo.input_audio || demo.output_audio) && (
                          <Mic className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        )}
                        {(demo.input_image || demo.output_image) &&
                          !demo.input_video && !demo.output_video &&
                          !demo.input_audio && !demo.output_audio && (
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
                          {(demo.input_video || demo.output_video) && <Video className="w-4 h-4" />}
                          {(demo.input_audio || demo.output_audio) && <Mic className="w-4 h-4" />}
                          {(demo.input_image || demo.output_image) && !demo.input_video && !demo.output_video && !demo.input_audio && !demo.output_audio && <ImageIcon className="w-4 h-4" />}
                          Visual Example
                        </h5>
                        <div className="relative">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Input Media */}
                            <MediaPlayer
                              videoUrl={demo.input_video}
                              audioUrl={demo.input_audio}
                              imageUrl={demo.input_image}
                              label="Input"
                            />

                            {/* Arrow indicator */}
                            {((demo.input_video || demo.input_audio || demo.input_image) &&
                              (demo.output_video || demo.output_audio || demo.output_image)) && (
                              <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg animate-pulse">
                                  <ArrowRight className="w-6 h-6 text-white" />
                                </div>
                              </div>
                            )}

                            {/* Output Media */}
                            <MediaPlayer
                              videoUrl={demo.output_video}
                              audioUrl={demo.output_audio}
                              imageUrl={demo.output_image}
                              label="Output"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Prompt */}
                    {demo.input_prompt && (
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
                              copyPrompt(index, demo.input_prompt);
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
                            "{demo.input_prompt}"
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Result */}
                    {/* Note: The old 'result' field is now split into output_text, output_image, etc.
                        If you want to show text output, use demo.output_text */}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {demos.length === 0 && (
          <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
            <CardContent className="p-12 text-center">
              <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Cases Found
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No use case examples have been added yet for this tool.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}