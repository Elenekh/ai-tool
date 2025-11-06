// ============================================
// SMART DEMO COMPONENT - Detects AI Type
// ============================================
// This component automatically detects the tool type
// and displays only relevant demo fields

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Zap, ImageIcon, Play, Volume2, Type, 
  ArrowRight, Video as VideoIcon
} from "lucide-react";

/**
 * Detects the type of AI tool and returns relevant display info
 */
const getToolTypeConfig = (toolType) => {
  const configs = {
    'text-to-text': {
      name: 'Text to Text',
      icon: Type,
      displayFields: ['prompt', 'result_text'],
      inputLabel: 'Input Prompt',
      outputLabel: 'Output Result',
      description: 'Text input and text output'
    },
    'text-to-image': {
      name: 'Text to Image',
      icon: ImageIcon,
      displayFields: ['prompt', 'result_image'],
      inputLabel: 'Text Prompt',
      outputLabel: 'Generated Image',
      description: 'Text input produces image output'
    },
    'text-to-video': {
      name: 'Text to Video',
      icon: VideoIcon,
      displayFields: ['prompt', 'result_video_url'],
      inputLabel: 'Text Prompt',
      outputLabel: 'Generated Video',
      description: 'Text input produces video output'
    },
    'text-to-audio': {
      name: 'Text to Audio',
      icon: Volume2,
      displayFields: ['prompt', 'result_audio_url'],
      inputLabel: 'Text Prompt',
      outputLabel: 'Generated Audio',
      description: 'Text input produces audio output'
    },
    'image-to-image': {
      name: 'Image to Image',
      icon: ImageIcon,
      displayFields: ['prompt_image', 'result_image'],
      inputLabel: 'Input Image',
      outputLabel: 'Output Image',
      description: 'Image input produces transformed image'
    },
    'image-to-video': {
      name: 'Image to Video',
      icon: VideoIcon,
      displayFields: ['prompt_image', 'result_video_url'],
      inputLabel: 'Input Image',
      outputLabel: 'Generated Video',
      description: 'Image input produces video output'
    },
    'other': {
      name: 'AI Tool',
      icon: Zap,
      displayFields: ['prompt', 'result_text', 'result_image', 'result_video_url', 'result_audio_url'],
      inputLabel: 'Input',
      outputLabel: 'Output',
      description: 'Interactive demo'
    }
  };

  return configs[toolType] || configs['other'];
};

/**
 * Helper to check if field has valid data
 */
const hasValidField = (tool, fieldName) => {
  const value = tool[fieldName];
  return value && value.trim && value.trim().length > 0;
};

/**
 * Render based on field type
 */
const renderField = (tool, fieldName, label) => {
  if (fieldName === 'prompt') {
    return renderTextField(tool.prompt, label, 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800');
  }
  
  if (fieldName === 'result_text') {
    return renderTextField(tool.result_text, label, 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800');
  }

  if (fieldName === 'prompt_image') {
    return renderImageField(tool.prompt_image, label, 'input');
  }

  if (fieldName === 'result_image') {
    return renderImageField(tool.result_image, label, 'output');
  }

  if (fieldName === 'result_video_url') {
    return renderVideoField(tool.result_video_url, label);
  }

  if (fieldName === 'result_audio_url') {
    return renderAudioField(tool.result_audio_url, label);
  }

  return null;
};

/**
 * Render text input/output
 */
const renderTextField = (text, label, colorClasses) => {
  if (!text || !text.trim()) return null;

  return (
    <div key={label}>
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        {label}
      </h4>
      <div className={`rounded-lg p-4 border font-mono text-sm whitespace-pre-wrap ${colorClasses}`}>
        <p className="text-gray-700 dark:text-gray-300">
          {text}
        </p>
      </div>
    </div>
  );
};

/**
 * Render image input/output
 */
const renderImageField = (imagePath, label, type) => {
  if (!imagePath) return null;

  const colorClasses = type === 'input' 
    ? 'border-blue-200 dark:border-blue-800' 
    : 'border-green-200 dark:border-green-800';

  return (
    <div key={label}>
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <ImageIcon className="w-4 h-4" />
        {label}
      </h4>
      <div className={`rounded-lg overflow-hidden border ${colorClasses} shadow-lg`}>
        <img 
          src={imagePath} 
          alt={label} 
          className="w-full h-auto object-cover max-h-96"
        />
      </div>
    </div>
  );
};

/**
 * Render video with smart embed detection
 */
const renderVideoField = (videoUrl, label) => {
  if (!videoUrl || !videoUrl.trim()) return null;

  let embedUrl = null;
  let isEmbed = false;

  // YouTube
  if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
    const videoId = videoUrl.includes('youtu.be') 
      ? videoUrl.split('/').pop().split('?')[0]
      : new URLSearchParams(new URL(videoUrl).search).get('v');
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
    isEmbed = true;
  }
  
  // Vimeo
  if (videoUrl.includes('vimeo.com')) {
    const videoId = videoUrl.split('/').pop();
    embedUrl = `https://player.vimeo.com/video/${videoId}`;
    isEmbed = true;
  }

  return (
    <div key={label}>
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <Play className="w-4 h-4" />
        {label}
      </h4>
      <div className="rounded-lg overflow-hidden border border-green-200 dark:border-green-800 shadow-lg">
        {isEmbed ? (
          <iframe
            src={embedUrl}
            className="w-full aspect-video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={label}
          />
        ) : (
          <video 
            controls 
            className="w-full h-auto"
            preload="metadata"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
};

/**
 * Render audio output
 */
const renderAudioField = (audioUrl, label) => {
  if (!audioUrl || !audioUrl.trim()) return null;

  return (
    <div key={label}>
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <Volume2 className="w-4 h-4" />
        {label}
      </h4>
      <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
        <audio 
          controls 
          className="w-full"
          preload="metadata"
        >
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio tag.
        </audio>
      </div>
    </div>
  );
};

/**
 * Main Demo Component
 */
export const SmartDemoSection = ({ tool }) => {
  if (!tool || !tool.type) return null;

  // Get configuration for this tool type
  const config = getToolTypeConfig(tool.type);
  const Icon = config.icon;

  // Check if we have any data to display
  const hasAnyData = config.displayFields.some(field => {
    const value = tool[field];
    return value && (typeof value === 'string' ? value.trim().length > 0 : true);
  });

  if (!hasAnyData) return null;

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800 mb-8">
      <CardContent className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Live Demo
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {config.description}
          </p>
        </div>

        {/* Demo Content Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Side */}
          <div className="space-y-4">
            {config.displayFields.slice(0, 1).map(field => {
              const value = tool[field];
              if (!value || (typeof value === 'string' && value.trim().length === 0)) {
                return null;
              }

              // Map field names to display labels
              const labels = {
                'prompt': config.inputLabel,
                'prompt_image': config.inputLabel
              };

              return renderField(tool, field, labels[field] || config.inputLabel);
            })}
          </div>

          {/* Arrow Divider - only on md screens */}
          {config.displayFields.length > 1 && (
            <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
            </div>
          )}

          {/* Output Side */}
          <div className="space-y-4">
            {config.displayFields.slice(1).map(field => {
              const value = tool[field];
              if (!value || (typeof value === 'string' && value.trim().length === 0)) {
                return null;
              }

              // Map field names to display labels
              const labels = {
                'result_text': config.outputLabel,
                'result_image': config.outputLabel,
                'result_video_url': config.outputLabel,
                'result_audio_url': config.outputLabel
              };

              return renderField(tool, field, labels[field] || config.outputLabel);
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartDemoSection;