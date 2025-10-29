import Layout from "./Layout.jsx";

import Home from "./Home";

import AITools from "./AITools";

import AIToolDetail from "./AIToolDetail";

import Blog from "./Blog";

import BlogPost from "./BlogPost";

import News from "./News";

import AuthorPage from "./AuthorPage";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    AITools: AITools,
    
    AIToolDetail: AIToolDetail,
    
    Blog: Blog,
    
    BlogPost: BlogPost,
    
    News: News,
    
    AuthorPage: AuthorPage,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/AITools" element={<AITools />} />
                
                <Route path="/AIToolDetail" element={<AIToolDetail />} />
                
                <Route path="/Blog" element={<Blog />} />
                
                <Route path="/BlogPost" element={<BlogPost />} />
                
                <Route path="/News" element={<News />} />
                
                <Route path="/AuthorPage" element={<AuthorPage />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}