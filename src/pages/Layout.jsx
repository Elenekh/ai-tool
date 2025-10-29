
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Moon, Sun, Sparkles, Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageProvider, useLanguage } from "@/components/LanguageContext";
import { translations } from "@/components/translations";

function LayoutContent({ children, currentPageName }) {
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const navItems = [
    { name: t(translations.home), path: "Home" },
    { name: t(translations.aiTools), path: "AITools" },
    { name: t(translations.blog), path: "Blog" },
    { name: t(translations.news), path: "News" }
  ];

  const isActive = (path) => {
    return location.pathname === createPageUrl(path);
  };

  return (
    <div className="min-h-screen transition-colors duration-500" style={{ 
      background: isDark 
        ? 'linear-gradient(135deg, #1D1E1A 0%, #2A2621 50%, #1D1E1A 100%)'
        : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #f8f9fa 100%)',
      fontFamily: language === 'ka' ? 'FiraGO, Noto Sans Georgian, system-ui, sans-serif' : 'Inter, -apple-system, system-ui, sans-serif'
    }}>
      <style>{`
        /* Banza UI Style System */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400;500;600;700&display=swap');
        
        :root {
          --banza-bg: #1D1E1A;
          --banza-bg-light: #2A2621;
          --banza-primary: #E5542E;
          --banza-secondary: #1F6949;
          --banza-neutral: #A6A6A6;
          --banza-glass: rgba(255, 255, 255, 0.05);
          --banza-glass-border: rgba(255, 255, 255, 0.06);
          --banza-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          --banza-glow: 0 0 24px rgba(229, 84, 46, 0.15);
        }
        
        * {
          letter-spacing: 0.01em;
        }
        
        /* Glassmorphism Effect */
        .banza-glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        /* Card Hover Effect */
        .banza-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          border-radius: 24px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .banza-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4), 0 0 24px rgba(229, 84, 46, 0.12);
          border-color: rgba(229, 84, 46, 0.2);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%);
        }
        
        /* Primary Button */
        .banza-btn-primary {
          background: linear-gradient(135deg, #E5542E 0%, #d94d29 100%);
          border: none;
          border-radius: 16px;
          padding: 12px 28px;
          font-weight: 600;
          color: white;
          box-shadow: 0 4px 16px rgba(229, 84, 46, 0.25);
          transition: all 0.3s ease;
        }
        
        .banza-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(229, 84, 46, 0.35);
          filter: brightness(1.1);
        }
        
        /* Secondary Button */
        .banza-btn-secondary {
          background: linear-gradient(135deg, #1F6949 0%, #1a5a3d 100%);
          border: none;
          border-radius: 16px;
          padding: 12px 28px;
          font-weight: 600;
          color: white;
          box-shadow: 0 4px 16px rgba(31, 105, 73, 0.25);
          transition: all 0.3s ease;
        }
        
        .banza-btn-secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(31, 105, 73, 0.35);
          filter: brightness(1.1);
        }
        
        /* Nav Link */
        .banza-nav-link {
          position: relative;
          color: #A6A6A6;
          font-weight: 500;
          transition: all 0.3s ease;
          padding: 8px 16px;
          border-radius: 12px;
        }
        
        .banza-nav-link:hover {
          color: #E5542E;
          background: rgba(229, 84, 46, 0.08);
        }
        
        .banza-nav-link.active {
          color: #E5542E;
          background: rgba(229, 84, 46, 0.12);
        }
        
        /* Ambient Glow */
        .banza-glow {
          position: relative;
        }
        
        .banza-glow::before {
          content: '';
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle at center, rgba(229, 84, 46, 0.15) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          z-index: -1;
        }
        
        .banza-glow:hover::before {
          opacity: 1;
        }
        
        /* Smooth Transitions */
        * {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 transition-all duration-300" style={{
        background: 'rgba(29, 30, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-[18px] flex items-center justify-center shadow-lg transition-all duration-300" style={{
                background: 'linear-gradient(135deg, #E5542E 0%, #d94d29 100%)',
                boxShadow: '0 4px 16px rgba(229, 84, 46, 0.3)'
              }}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                AI TOOL
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path)}
                  className={`banza-nav-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Theme Toggle, Language & Mobile Menu */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="px-4 py-2 rounded-[14px] transition-all duration-300 flex items-center gap-2 font-semibold"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  color: '#A6A6A6'
                }}
              >
                <Globe className="w-4 h-4" />
                <span>{language === 'en' ? 'EN' : 'ქა'}</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-[14px] flex items-center justify-center transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-400" />
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden w-10 h-10 rounded-[14px] flex items-center justify-center"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-6" style={{
            background: 'rgba(29, 30, 26, 0.95)',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <div className="space-y-2 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-5 py-3 rounded-[16px] font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? 'text-white'
                      : 'text-neutral-400'
                  }`}
                  style={isActive(item.path) ? {
                    background: 'rgba(229, 84, 46, 0.12)',
                    color: '#E5542E'
                  } : {}}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-5rem)]">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-32 border-t transition-colors duration-300" style={{
        background: 'rgba(29, 30, 26, 0.6)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(255, 255, 255, 0.06)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-[18px] flex items-center justify-center shadow-lg" style={{
                  background: 'linear-gradient(135deg, #E5542E 0%, #d94d29 100%)'
                }}>
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">
                  AI TOOL
                </span>
              </div>
              <p className="text-neutral-400 mb-6 leading-relaxed">
                {t(translations.yourTrustedSource)}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">{t(translations.quickLinks)}</h3>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={createPageUrl(item.path)}
                      className="text-neutral-400 hover:text-orange-400 transition-colors duration-300 text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">{t(translations.categories)}</h3>
              <ul className="space-y-3 text-neutral-400 text-sm">
                <li className="hover:text-orange-400 transition-colors cursor-pointer">{t(translations.writingTools)}</li>
                <li className="hover:text-orange-400 transition-colors cursor-pointer">{t(translations.designTools)}</li>
                <li className="hover:text-orange-400 transition-colors cursor-pointer">{t(translations.codeAssistants)}</li>
                <li className="hover:text-orange-400 transition-colors cursor-pointer">{t(translations.Productivity)}</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 text-center text-neutral-500 text-sm" style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <p>© 2025 AI TOOL. {t(translations.footerText)}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <LanguageProvider>
      <LayoutContent children={children} currentPageName={currentPageName} />
    </LanguageProvider>
  );
}
