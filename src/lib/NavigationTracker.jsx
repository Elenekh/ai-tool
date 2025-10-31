import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { pagesConfig } from '@/pages.config';

export default function NavigationTracker() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { Pages, mainPage } = pagesConfig;
  const mainPageKey = mainPage ?? Object.keys(Pages)[0];

  // Post navigation changes to parent window (if in iframe)
  useEffect(() => {
    window.parent?.postMessage({
      type: "app_changed_url",
      url: window.location.href
    }, '*');
  }, [location]);

  // Track page views
  useEffect(() => {
    const pathname = location.pathname;
    let pageName;
    
    if (pathname === '/' || pathname === '') {
      pageName = mainPageKey;
    } else {
      const pathSegment = pathname.replace(/^\//, '').split('/')[0];
      const pageKeys = Object.keys(Pages);
      const matchedKey = pageKeys.find(
        key => key.toLowerCase() === pathSegment.toLowerCase()
      );
      pageName = matchedKey || null;
    }

    // You can add analytics tracking here if needed
    if (pageName) {
      console.log('Navigated to:', pageName);
    }
  }, [location, Pages, mainPageKey]);

  return null;
}