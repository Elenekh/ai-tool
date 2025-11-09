import React, { useEffect, useState } from "react";
import { useBlogPost, useIncrementBlogViews, useBlogPosts } from "@/hooks/useAPI";
import { useSearchParams, useLocation, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, User, Eye, Linkedin, Twitter, Facebook, Link as LinkIcon, ArrowUp } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import BlogCard from "../components/BlogCard";
import { useLanguage } from "@/components/LanguageContext";
import { getLocalizedField } from "@/lib/localization";

export default function BlogPost() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const postIdFromState = location.state?.postId;
  const postIdFromQuery = searchParams.get('id');
  const postId = postIdFromState || postIdFromQuery;

  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { language } = useLanguage();

  // Handle missing postId
  if (!postId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No post selected</h2>
          <Link to={createPageUrl("Blog")}>
            <Button variant="outline">Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Fetch blog post and related posts
  const { data: post, isLoading, error } = useBlogPost(postId);
  const { data: allPostsData } = useBlogPosts({ ordering: '-created_at' });
  const allPosts = Array.isArray(allPostsData) ? allPostsData : (allPostsData?.results || []);
  const incrementViewsMutation = useIncrementBlogViews();

  // Increment views on first load
  useEffect(() => {
    if (post && postId) {
      const viewedPosts = JSON.parse(localStorage.getItem("viewedPosts") || "[]");
      if (!viewedPosts.includes(postId)) {
        incrementViewsMutation.mutate(postId, {
          onSuccess: () => {
            viewedPosts.push(postId);
            localStorage.setItem("viewedPosts", JSON.stringify(viewedPosts));
          },
        });
      }
    }
  }, [post, postId, incrementViewsMutation]);

  // Get related posts
  const relatedPosts = allPosts
    .filter(p => p.id !== postId && p.category === post?.category)
    .slice(0, 3);

  // Reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const trackLength = documentHeight - windowHeight;
      const progress = (scrollTop / trackLength) * 100;

      setReadingProgress(Math.min(100, Math.max(0, progress)));
      setShowScrollTop(scrollTop > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Share functionality
  const sharePost = (platform) => {
    const url = window.location.href;
    const postTitle = getLocalizedField(post, 'title', language);
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    };
    if (shareUrls[platform]) window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert(language === 'ka' ? 'ბმული დაკოპირდა!' : 'Link copied to clipboard!');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{language === 'ka' ? 'სტატია იტვირთება...' : 'Loading article...'}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {language === 'ka' ? 'სტატია არ მოიძებნა' : 'Article not found'}
          </h2>
          <Link to={createPageUrl("Blog")}>
            <Button variant="outline">{language === 'ka' ? 'ბლოგში დაბრუნება' : 'Back to Blog'}</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Category colors
  const categoryColors = {
    "AI Tools": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    "Tutorials": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    "Reviews": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    "Updates": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    "Case Studies": "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
    "Productivity": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
    "Education": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
    "Research": "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400"
  };

  // Get localized content
  const postTitle = getLocalizedField(post, 'title', language);
  const postContent = getLocalizedField(post, 'content', language);
  const authorBio = getLocalizedField(post, 'author_bio', language);
  const authorSlug = post.author?.toLowerCase().replace(/\s+/g, '-') || '';

  // Sort images by order
  const sortedImages = (post.images || []).sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 transition-all duration-150" 
          style={{ width: `${readingProgress}%` }} 
        />
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden bg-gray-900">
        {/* Background Image */}
        {post.featured_image && (
          <>
            <img 
              src={post.featured_image} 
              alt={postTitle}
              className="w-full h-full object-cover opacity-40" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-white dark:to-gray-950"></div>
          </>
        )}

        {!post.featured_image && (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
        )}

        {/* Back Button */}
        <div className="absolute top-8 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={createPageUrl("Blog")}>
            <Button variant="ghost" className="text-white hover:bg-white/20 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" /> 
              {language === 'ka' ? 'ბლოგში დაბრუნება' : 'Back to Blog'}
            </Button>
          </Link>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {post.category && (
            <Badge className={`${categoryColors[post.category]} mb-4`}>
              {post.category}
            </Badge>
          )}
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {postTitle}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-white/90">
            {/* Author */}
            <Link 
              to={`${createPageUrl("AuthorPage")}?slug=${authorSlug}`} 
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              {post.author_avatar ? (
                <img 
                  src={post.author_avatar} 
                  alt={post.author}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center border-2 border-white/20">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="font-medium">{post.author}</span>
            </Link>

            {/* Date */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {post.created_at ? 
                  format(new Date(post.created_at), language === 'ka' ? 'dd MMMM yyyy' : 'MMMM dd, yyyy') :
                  'Unknown date'
                }
              </span>
            </div>

            {/* Read Time */}
            {post.read_time && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.read_time} {language === 'ka' ? 'წთ' : 'min'} read</span>
              </div>
            )}

            {/* Views */}
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{post.views || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 md:px-8 py-20">
        <div className="text-gray-800 dark:text-gray-100">
          {/* Blog Content */}
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className="text-4xl font-bold mt-10 mb-6 text-gray-900 dark:text-white" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-3xl font-bold mt-8 mb-5 text-gray-900 dark:text-white" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-2xl font-bold mt-6 mb-4 text-gray-900 dark:text-white" {...props} />,
              h4: ({node, ...props}) => <h4 className="text-xl font-bold mt-5 mb-3 text-gray-900 dark:text-white" {...props} />,
              p: ({node, ...props}) => <p className="text-base md:text-lg leading-relaxed mb-6 text-gray-700 dark:text-gray-300" {...props} />,
              a: ({node, ...props}) => <a className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
              strong: ({node, ...props}) => <strong className="font-bold text-gray-900 dark:text-white" {...props} />,
              em: ({node, ...props}) => <em className="italic text-gray-700 dark:text-gray-300" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-3 my-6 text-gray-700 dark:text-gray-300" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-3 my-6 text-gray-700 dark:text-gray-300" {...props} />,
              li: ({node, ...props}) => <li className="text-base md:text-lg leading-relaxed" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-600 dark:border-indigo-400 pl-6 italic my-8 py-4 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 rounded" {...props} />,
              code: ({node, inline, ...props}) => inline 
                ? <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono text-sm text-gray-800 dark:text-gray-200" {...props} />
                : <code className="block bg-gray-100 dark:bg-gray-900 p-4 rounded font-mono text-sm overflow-x-auto text-gray-800 dark:text-gray-200" {...props} />,
              pre: ({node, ...props}) => <pre className="bg-gray-900 dark:bg-gray-950 p-6 rounded-lg overflow-x-auto my-6 border border-gray-800" {...props} />,
              img: ({node, ...props}) => <img className="w-full rounded-lg shadow-lg my-8" {...props} />,
              table: ({node, ...props}) => <table className="w-full border-collapse my-6" {...props} />,
              thead: ({node, ...props}) => <thead className="bg-gray-100 dark:bg-gray-800" {...props} />,
              th: ({node, ...props}) => <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left font-semibold" {...props} />,
              td: ({node, ...props}) => <td className="border border-gray-300 dark:border-gray-700 px-4 py-3" {...props} />,
              hr: ({node, ...props}) => <hr className="my-8 border-gray-300 dark:border-gray-700" {...props} />,
            }}
          >
            {postContent}
          </ReactMarkdown>

          {/* Blog Post Images */}
          {sortedImages.length > 0 && (
            <div className="space-y-12 my-12">
              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                  {language === 'ka' ? 'გამოსახულებები' : 'Images'}
                </h3>
                
                <div className="space-y-12">
                  {sortedImages.map((img) => {
                    const caption = getLocalizedField(img, 'caption', language);
                    
                    return (
                      <figure key={img.id} className="space-y-3">
                        {/* Image Container */}
                        <div className="relative overflow-hidden rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800">
                          <img
                            src={img.image}
                            alt={img.alt_text || caption || 'Blog image'}
                            className="w-full h-auto"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect fill="%23ddd" width="800" height="400"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="18"%3EImage not available%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>

                        {/* Caption */}
                        {caption && (
                          <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 italic pt-2">
                            {caption}
                          </figcaption>
                        )}

                        {/* Alt text info for accessibility */}
                        {img.alt_text && caption !== img.alt_text && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
                            <span className="sr-only">Image description:</span> {img.alt_text}
                          </p>
                        )}
                      </figure>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Section */}
      <div className="max-w-2xl mx-auto px-6 md:px-8 py-8 border-t border-gray-200 dark:border-gray-800">
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">
          {language === 'ka' ? 'სტატიის გაზიარება:' : 'Share this article:'}
        </p>
        <div className="flex gap-3 flex-wrap">
          <Button 
            onClick={() => sharePost("twitter")} 
            className="bg-blue-400 hover:bg-blue-500 text-white" 
            size="sm"
          >
            <Twitter className="w-4 h-4 mr-2" /> Twitter
          </Button>
          <Button 
            onClick={() => sharePost("linkedin")} 
            className="bg-blue-600 hover:bg-blue-700 text-white" 
            size="sm"
          >
            <Linkedin className="w-4 h-4 mr-2" /> LinkedIn
          </Button>
          <Button 
            onClick={() => sharePost("facebook")} 
            className="bg-blue-700 hover:bg-blue-800 text-white" 
            size="sm"
          >
            <Facebook className="w-4 h-4 mr-2" /> Facebook
          </Button>
          <Button 
            onClick={copyLink} 
            variant="outline" 
            size="sm"
          >
            <LinkIcon className="w-4 h-4 mr-2" /> {language === 'ka' ? 'ბმული დაკოპირება' : 'Copy Link'}
          </Button>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            {language === 'ka' ? 'დაკავშირებული სტატიები' : 'Related Articles'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedPosts.map(p => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop} 
          className="fixed bottom-6 right-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-50"
          title={language === 'ka' ? 'ზემოთ გადასვლა' : 'Scroll to top'}
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}