import React, { useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';
import { translations } from './translations';

const UserNotRegisteredError = () => {
  const { language } = useLanguage();
  const t = (key) => translations[key]?.[language] || translations[key]?.['en'] || '';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-slate-100 dark:border-slate-800">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-orange-100 dark:bg-orange-900/30">
            <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {t('access_restricted')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            {t('not_registered')}. {t('contact_admin')}.
          </p>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md text-sm text-slate-600 dark:text-slate-400 space-y-2">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              {language === 'ka' ? 'თუ ეს შეცდომაა:' : 'If you believe this is an error:'}
            </p>
            <ul className="list-disc list-inside space-y-1 text-left">
              <li>{t('verify_account')}</li>
              <li>{t('contact_admin')}</li>
              <li>
                {language === 'ka' 
                  ? 'სცადეთ გამოსვლა და ხელახლა შესვლა' 
                  : 'Try logging out and back in again'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNotRegisteredError;