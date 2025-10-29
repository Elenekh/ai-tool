import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Star, Award } from "lucide-react";

export default function ReviewSection({ tool }) {
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

  // Check if pros and cons are arrays
  const hasPros = tool.pros && Array.isArray(tool.pros) && tool.pros.length > 0;
  const hasCons = tool.cons && Array.isArray(tool.cons) && tool.cons.length > 0;

  return (
    <div className="space-y-6">
      {/* Editor's Score */}
      {tool.editor_score && (
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-2 border-indigo-200 dark:border-indigo-800">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Award className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Editor's Score
              </h3>
            </div>
            <div className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {tool.editor_score.toFixed(1)}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">out of 10</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              {renderStars(tool.rating)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pros and Cons */}
      {(hasPros || hasCons) && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pros */}
          {hasPros && (
            <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-300">
                  <ThumbsUp className="w-5 h-5" />
                  Pros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {tool.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-3 text-green-800 dark:text-green-300">
                      <span className="flex-shrink-0 w-5 h-5 bg-green-200 dark:bg-green-900 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                        ✓
                      </span>
                      <span className="flex-1">{pro}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Cons */}
          {hasCons && (
            <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-900 dark:text-red-300">
                  <ThumbsDown className="w-5 h-5" />
                  Cons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {tool.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-3 text-red-800 dark:text-red-300">
                      <span className="flex-shrink-0 w-5 h-5 bg-red-200 dark:bg-red-900 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                        ×
                      </span>
                      <span className="flex-1">{con}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Editorial Review */}
      {tool.review && (
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl">Editorial Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {tool.review}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Rating Summary */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-800">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                {tool.rating?.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                User Rating
              </div>
            </div>
            {tool.editor_score && (
              <div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {tool.editor_score?.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Editor Score
                </div>
              </div>
            )}
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                {tool.users || "N/A"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Users
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* If no review data available */}
      {!tool.editor_score && !hasPros && !hasCons && !tool.review && (
        <Card className="bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700">
          <CardContent className="p-12 text-center">
            <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Review Coming Soon
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Our editorial team is currently reviewing this tool
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}