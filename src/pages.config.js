import Home from './pages/Home';
import AITools from './pages/AITools';
import AIToolDetail from './pages/AIToolDetail';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import News from './pages/News';
import AuthorPage from './pages/AuthorPage';
import Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "AITools": AITools,
    "AIToolDetail": AIToolDetail,
    "Blog": Blog,
    "BlogPost": BlogPost,
    "News": News,
    "AuthorPage": AuthorPage,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: Layout,
};