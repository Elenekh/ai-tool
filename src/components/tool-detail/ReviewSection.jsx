import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Star, Award, AlertCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { getLocalizedField } from "@/lib/localization";
import { translations } from "@/components/translations";

export default function ReviewSection({ tool }) {
  const { language } = useLanguage();
  const t = (key) => translations[key]?.[language] || translations[key]?.['en'] || '';

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

  // Safely extract pros and cons
  const getPros = () => {
    if (!tool.pros) return [];
    if (Array.isArray(tool.pros)) {
      return tool.pros
        .map(pro => getLocalizedField(pro, 'text', language) || pro)
        .filter(Boolean);
    }
    return [];
  };

  const getCons = () => {
    if (!tool.cons) return [];
    if (Array.isArray(tool.cons)) {
      return tool.cons
        .map(con => getLocalizedField(con, 'text', language) || con)
        .filter(Boolean);
    }
    return [];
  };

  const pros = getPros();
  const cons = getCons();
  const hasReview = tool.review && tool.review.trim().length > 0;
  const hasEditorScore = tool.editor_score !== null && tool.editor_score !== undefined;
  const hasRating = tool.rating !== null && tool.rating !== undefined;

  // If nothing to show, display empty state
  if (!pros.length && !cons.length && !hasReview && !hasEditorScore) {
    return (
      <div className="space-y-6">
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
              {language === 'ka' ? 'მიმოხილვა მალე' : 'Review Coming Soon'}
            </h4>
            <p className="text-blue-800 dark:text-blue-400">
              {language === 'ka' 
                ? 'ჩვენი რედაქტორის გუნდი ამჟამად აკვირდება ამ ხელსაწყოს. მალე დაბრუნდით დეტალური შეხედვისთვის, უპირატესობებისთვის, მინუსებისთვის და ჩვენი ექსპერტის შეფასებისთვის.'
                : 'Our editorial team is currently reviewing this tool. Check back soon for detailed insights, pros, cons, and our expert rating.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Editor's Score */}
      {hasEditorScore && (
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-2 border-indigo-200 dark:border-indigo-800">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Award className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('editorsScore')}
              </h3>
            </div>
            <div className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {tool.editor_score.toFixed(1)}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              {t('outOf')} 10
            </p>
            {hasRating && (
              <div className="flex items-center justify-center gap-2">
                {renderStars(tool.rating)}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pros and Cons */}
      {(pros.length > 0 || cons.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pros */}
          {pros.length > 0 && (
            <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ThumbsUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h3 className="font-semibold text-green-900 dark:text-green-300 text-lg">
                    {t('pro')}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-3 text-green-800 dark:text-green-300">
                      <span className="flex-shrink-0 w-5 h-5 bg-green-200 dark:bg-green-900 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 text-green-700 dark:text-green-300">
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
          {cons.length > 0 && (
            <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ThumbsDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <h3 className="font-semibold text-red-900 dark:text-red-300 text-lg">
                    {t('con')}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-3 text-red-800 dark:text-red-300">
                      <span className="flex-shrink-0 w-5 h-5 bg-red-200 dark:bg-red-900 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 text-red-700 dark:text-red-300">
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
      {hasReview && (
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('editorialReview')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
              {getLocalizedField(tool, 'review', language)}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Rating Summary */}
      {(hasEditorScore || hasRating) && (
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              {hasRating && (
                <div>
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                    {tool.rating?.toFixed(1) || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {language === 'ka' ? 'მომხმარებლის შეფასება' : 'User Rating'}
                  </div>
                </div>
              )}
              {hasEditorScore && (
                <div>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    {tool.editor_score?.toFixed(1) || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('editorsScore')}
                  </div>
                </div>
              )}
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {tool.users || 'N/A'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('users')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}