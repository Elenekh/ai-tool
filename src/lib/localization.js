// lib/localization.js
// Utility functions for handling Georgian/English localization from backend

/**
 * Get localized field value based on current language
 * @param {Object} object - Data object from API
 * @param {string} fieldName - Base field name (without language suffix)
 * @param {string} language - Current language ('en' or 'ka')
 * @returns {string} Localized value or empty string
 * 
 * @example
 * const title = getLocalizedField(post, 'title', 'ka');
 * // Returns post.title_ge if it exists, otherwise post.title
 */
export const getLocalizedField = (object, fieldName, language) => {
  if (!object || !fieldName) return '';
  
  // Build the language-specific field name
  // Georgian suffix is '_ge', English is '' (no suffix)
  const langSuffix = language === 'ka' ? '_ge' : '';
  const localizedFieldName = `${fieldName}${langSuffix}`;
  
  // Try language-specific field first
  if (object[localizedFieldName]) {
    return object[localizedFieldName];
  }
  
  // Fallback to base field
  if (object[fieldName]) {
    return object[fieldName];
  }
  
  return '';
};

/**
 * Get localized array of objects
 * @param {Array} array - Array of objects from API
 * @param {string} fieldName - Field to localize
 * @param {string} language - Current language
 * @returns {Array} Array of localized values
 * 
 * @example
 * const features = getLocalizedArray(tool.key_features, 'feature', 'ka');
 */
export const getLocalizedArray = (array, fieldName, language) => {
  if (!Array.isArray(array)) return [];
  
  return array
    .map(item => getLocalizedField(item, fieldName, language))
    .filter(value => value && String(value).trim().length > 0);
};

/**
 * Localize entire object - creates new object with language-specific values
 * @param {Object} object - Data object
 * @param {string} language - Current language
 * @returns {Object} New object with localized values
 * 
 * @example
 * const localizedTool = localizeObject(tool, 'ka');
 */
export const localizeObject = (object, language) => {
  if (!object) return object;
  
  const localized = { ...object };
  const langSuffix = language === 'ka' ? '_ge' : '';
  
  // Get all keys and handle localization
  Object.keys(object).forEach(key => {
    // Skip language-specific keys that end with _ge or _en
    if (key.endsWith('_ge') || key.endsWith('_en')) {
      return;
    }
    
    // Check if there's a localized version
    const localizedKeyName = `${key}${langSuffix}`;
    if (object[localizedKeyName]) {
      localized[key] = object[localizedKeyName];
    }
  });
  
  return localized;
};

/**
 * Sort objects by language-specific field
 * @param {Array} array - Array to sort
 * @param {string} fieldName - Field to sort by
 * @param {string} language - Current language
 * @returns {Array} Sorted array
 */
export const sortByLocalizedField = (array, fieldName, language) => {
  if (!Array.isArray(array)) return [];
  
  return [...array].sort((a, b) => {
    const aValue = getLocalizedField(a, fieldName, language);
    const bValue = getLocalizedField(b, fieldName, language);
    return aValue.localeCompare(bValue);
  });
};

/**
 * Get both English and Georgian versions of a field
 * Useful for bilingual displays
 * @param {Object} object - Data object
 * @param {string} fieldName - Base field name
 * @returns {Object} {en: string, ka: string}
 * 
 * @example
 * const { en, ka } = getBilingualField(post, 'title');
 */
export const getBilingualField = (object, fieldName) => {
  if (!object) return { en: '', ka: '' };
  
  return {
    en: getLocalizedField(object, fieldName, 'en'),
    ka: getLocalizedField(object, fieldName, 'ka'),
  };
};

/**
 * Check if a localized field is empty or missing
 * @param {Object} object - Data object
 * @param {string} fieldName - Field to check
 * @param {string} language - Language to check
 * @returns {boolean} True if field is empty
 */
export const isLocalizedFieldEmpty = (object, fieldName, language) => {
  const value = getLocalizedField(object, fieldName, language);
  return !value || String(value).trim().length === 0;
};

/**
 * Get array of available languages for an object
 * Checks which language versions exist for a field
 * @param {Object} object - Data object
 * @param {string} fieldName - Field to check
 * @returns {Array} ['en', 'ka'] or just ['en']
 */
export const getAvailableLanguages = (object, fieldName) => {
  const languages = [];
  
  if (object[fieldName]) languages.push('en');
  if (object[`${fieldName}_ge`]) languages.push('ka');
  
  return languages;
};

/**
 * Format localized date
 * @param {string} dateString - ISO date string
 * @param {string} language - 'en' or 'ka'
 * @returns {string} Formatted date
 */
export const formatLocalizedDate = (dateString, language) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const locale = language === 'ka' ? 'ka-GE' : 'en-US';
  
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Create a language selector component context helper
 * Returns metadata about localization for UI purposes
 * @param {Object} object - Data object
 * @param {Array<string>} fieldNames - Fields to check
 * @returns {Object} Localization metadata
 */
export const getLocalizationMetadata = (object, fieldNames = []) => {
  const metadata = {
    isFullyLocalized: true,
    missingTranslations: [],
    availableLanguages: new Set(),
  };
  
  fieldNames.forEach(fieldName => {
    const langAvailable = getAvailableLanguages(object, fieldName);
    langAvailable.forEach(lang => metadata.availableLanguages.add(lang));
    
    if (!object[`${fieldName}_ge`]) {
      metadata.isFullyLocalized = false;
      metadata.missingTranslations.push(fieldName);
    }
  });
  
  return {
    ...metadata,
    availableLanguages: Array.from(metadata.availableLanguages),
  };
};

/**
 * Helper to handle nested localization
 * For objects with nested arrays of localized objects
 * @param {Array} items - Array of items to localize
 * @param {Array<string>} fieldsToLocalize - Which fields to localize
 * @param {string} language - Current language
 * @returns {Array} Localized items
 * 
 * @example
 * const localizedFeatures = localizeNestedArray(
 *   tool.key_features,
 *   ['feature', 'description'],
 *   'ka'
 * );
 */
export const localizeNestedArray = (
  items,
  fieldsToLocalize = [],
  language = 'en'
) => {
  if (!Array.isArray(items)) return [];
  
  return items.map(item => {
    const localized = { ...item };
    
    fieldsToLocalize.forEach(fieldName => {
      localized[fieldName] = getLocalizedField(
        item,
        fieldName,
        language
      );
    });
    
    return localized;
  });
};