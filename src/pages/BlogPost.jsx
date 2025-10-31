import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useSearchParams, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, Calendar, Clock, User, Eye, Linkedin, Twitter, 
  Globe, Share2, Facebook, Link as LinkIcon, ChevronRight,
  ArrowUp
} from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import BlogCard from "../components/BlogCard";

export default function BlogPost() {
  const [searchParams] = useSearchParams();
  const postId = searchParams.get('id');
  const queryClient = useQueryClient();
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { data: post, isLoading } = useQuery({
    queryKey: ['blogPost', postId],
    queryFn: async () => {
      const posts = await base44.entities.BlogPost.filter({ id: postId });
      return posts[0];
    },
    enabled: !!postId,
  });

  const { data: allPosts = [] } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => base44.entities.BlogPost.list('-created_date', 10),
  });

  // Get related posts (same category, excluding current post)
  const relatedPosts = allPosts
    .filter(p => p.id !== postId && p.category === post?.category)
    .slice(0, 3);

  // Increment view count
  const incrementViewMutation = useMutation({
    mutationFn: (postId) => 
      base44.entities.BlogPost.update(postId, { views: (post?.views || 0) + 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPost', postId] });
    },
  });

  // Track reading progress
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

  useEffect(() => {
    if (post && postId) {
      incrementViewMutation.mutate(postId);
    }
  }, [postId]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sharePost = (platform) => {
    const url = window.location.href;
    const title = post?.title;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Article not found</h2>
          <Link to={createPageUrl("Blog")}>
            <Button variant="outline">Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

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

  const authorSlug = post.author.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Hero Section with Featured Image */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden bg-gray-900">
        {post.featured_image && (
          <>
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-gray-50 dark:to-gray-950"></div>
          </>
        )}
        
        {/* Back Button */}
        <div className="absolute top-8 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={createPageUrl("Blog")}>
            <Button variant="ghost" className="text-white hover:bg-white/20 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Title and Meta */}
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {post.category && (
            <Badge className={`${categoryColors[post.category]} mb-4`}>
              {post.category}
            </Badge>
          )}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-white/90">
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
              <span className="font-semibold">{post.author}</span>
            </Link>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(post.created_date), "MMMM d, yyyy")}</span>
            </div>
            {post.read_time && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.read_time} min read</span>
              </div>
            )}
            {post.views !== undefined && (
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{post.views.toLocaleString()} views</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        {/* Social Share Sidebar - Desktop */}
        <div className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-40">
          <div className="flex flex-col gap-3 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-3 border border-gray-200 dark:border-gray-800">
            <button
              onClick={() => sharePost('twitter')}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-sky-50 dark:hover:bg-sky-950/20 text-gray-600 dark:text-gray-400 hover:text-sky-500 transition-colors"
              title="Share on Twitter"
            >
              <Twitter className="w-5 h-5" />
            </button>
            <button
              onClick={() => sharePost('linkedin')}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
              title="Share on LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </button>
            <button
              onClick={() => sharePost('facebook')}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 text-gray-600 dark:text-gray-400 hover:text-blue-700 transition-colors"
              title="Share on Facebook"
            >
              <Facebook className="w-5 h-5" />
            </button>
            <button
              onClick={copyLink}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="Copy link"
            >
              <LinkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none 
          prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:mt-12 prose-headings:mb-6
          prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
          prose-code:text-indigo-600 dark:prose-code:text-indigo-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
          prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-800
          prose-blockquote:border-l-4 prose-blockquote:border-indigo-600 prose-blockquote:bg-indigo-50 dark:prose-blockquote:bg-indigo-950/20 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
          prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6
          prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:mb-2
          prose-img:rounded-2xl prose-img:shadow-xl prose-img:my-8
          prose-hr:border-gray-200 dark:prose-hr:border-gray-800 prose-hr:my-12
          prose-table:border-collapse prose-table:w-full
          prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:p-4 prose-th:text-left
          prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-800 prose-td:p-4">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-600 dark:text-indigo-400">#</span>
              Tagged Topics
            </h3>
            <div className="flex flex-wrap gap-3">
              {post.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 cursor-pointer transition-colors px-4 py-2 text-sm"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio Section */}
        <Card className="mt-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-pink-950/20 border-indigo-200 dark:border-indigo-800">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              About the Author
            </h3>
            <div className="flex flex-col md:flex-row gap-6">
              <Link to={`${createPageUrl("AuthorPage")}?slug=${authorSlug}`}>
                {post.author_avatar ? (
                  <img 
                    src={post.author_avatar} 
                    alt={post.author}
                    className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white dark:border-gray-800 hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800">
                    <User className="w-12 h-12 text-white" />
                  </div>
                )}
              </Link>
              <div className="flex-1">
                <Link to={`${createPageUrl("AuthorPage")}?slug=${authorSlug}`}>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {post.author}
                  </h4>
                </Link>
                {post.author_bio && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {post.author_bio}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-4">
                  {post.author_social && (
                    <>
                      {post.author_social.linkedin && (
                        <a 
                          href={post.author_social.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {post.author_social.twitter && (
                        <a 
                          href={post.author_social.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 dark:text-gray-400 hover:text-sky-500 transition-colors"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {post.author_social.website && (
                        <a 
                          href={post.author_social.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          <Globe className="w-5 h-5" />
                        </a>
                      )}
                    </>
                  )}
                  <Link to={`${createPageUrl("AuthorPage")}?slug=${authorSlug}`}>
                    <Button variant="outline" size="sm" className="ml-auto">
                      View Profile
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Share Section - Mobile */}
        <div className="lg:hidden mt-12 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share this article
          </h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={() => sharePost('twitter')}>
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>
            <Button variant="outline" size="sm" onClick={() => sharePost('linkedin')}>
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </Button>
            <Button variant="outline" size="sm" onClick={() => sharePost('facebook')}>
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </Button>
            <Button variant="outline" size="sm" onClick={copyLink}>
              <LinkIcon className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <div className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-110"
          title="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}