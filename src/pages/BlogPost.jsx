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

export default function BlogPost() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const postIdFromState = location.state?.postId;
  const postIdFromQuery = searchParams.get('id');
  const postId = postIdFromState || postIdFromQuery;

  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Redirect to Blog if no postId
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

  // Fetch post
  const { data: post, isLoading, error } = useBlogPost(postId);

  // Fetch all posts for related posts
  const { data: allPostsData } = useBlogPosts({ ordering: '-created_at' });
  const allPosts = allPostsData?.results || [];

  // Increment views
  const incrementViewsMutation = useIncrementBlogViews();

  useEffect(() => {
    if (post && postId) {
      const viewedPosts = JSON.parse(localStorage.getItem("viewedPosts") || "[]");

      // Only increment if not already viewed
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


  // Related posts
  const relatedPosts = allPosts.filter(p => p.id !== postId && p.category === post?.category).slice(0, 3);

  // Reading progress
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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const sharePost = (platform) => {
    const url = window.location.href;
    const title = post?.title;
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    };
    if (shareUrls[platform]) window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading article...</p>
      </div>
    </div>
  );

  if (error || !post) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Article not found</h2>
        <Link to={createPageUrl("Blog")}>
          <Button variant="outline">Back to Blog</Button>
        </Link>
      </div>
    </div>
  );

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
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50">
        <div className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 transition-all duration-150" style={{ width: `${readingProgress}%` }} />
      </div>

      {/* Hero */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden bg-gray-900">
        {post.featured_image && (
          <>
            <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-gray-50 dark:to-gray-950"></div>
          </>
        )}

        {/* Back */}
        <div className="absolute top-8 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={createPageUrl("Blog")}>
            <Button variant="ghost" className="text-white hover:bg-white/20 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
            </Button>
          </Link>
        </div>

        {/* Title & Meta */}
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {post.category && <Badge className={`${categoryColors[post.category]} mb-4`}>{post.category}</Badge>}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-white/90">
            <Link to={`${createPageUrl("AuthorPage")}?slug=${authorSlug}`} className="flex items-center gap-2 hover:text-white transition-colors">
              {post.author_avatar ? (
                <img src={post.author_avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover border-2 border-white/20" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center border-2 border-white/20">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="font-medium">{post.author}</span>
            </Link>
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{format(new Date(post.created_at), 'MMMM dd, yyyy')}</span></div>
            <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span>{post.reading_time} min read</span></div>
            <div className="flex items-center gap-2"><Eye className="w-4 h-4" /><span>{post.views}</span></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose dark:prose-invert">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {/* Share Buttons */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-4 flex-wrap">
        <Button onClick={() => sharePost("twitter")} variant="outline" size="sm"><Twitter className="w-4 h-4 mr-1" /> Twitter</Button>
        <Button onClick={() => sharePost("linkedin")} variant="outline" size="sm"><Linkedin className="w-4 h-4 mr-1" /> LinkedIn</Button>
        <Button onClick={() => sharePost("facebook")} variant="outline" size="sm"><Facebook className="w-4 h-4 mr-1" /> Facebook</Button>
        <Button onClick={copyLink} variant="outline" size="sm"><LinkIcon className="w-4 h-4 mr-1" /> Copy Link</Button>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedPosts.map(p => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      )}

      {/* Scroll to top */}
      {showScrollTop && (
        <button onClick={scrollToTop} className="fixed bottom-6 right-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-50">
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
