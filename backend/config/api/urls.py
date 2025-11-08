from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ToolViewSet, ToolDemoViewSet, KeyFeatureViewSet, ProViewSet, ConViewSet, UsageStepViewSet,
    BlogPostViewSet, BlogPostImageViewSet, NewsViewSet, AuthorViewSet, LoginView
)

router = DefaultRouter()

# Tool routes
router.register(r'tools', ToolViewSet, basename='tool')
router.register(r'tool-demos', ToolDemoViewSet, basename='tool-demo')
router.register(r'key-features', KeyFeatureViewSet, basename='key-feature')
router.register(r'pros', ProViewSet, basename='pro')
router.register(r'cons', ConViewSet, basename='con')
router.register(r'usage-steps', UsageStepViewSet, basename='usage-step')

# Blog and News routes
router.register(r'blog-posts', BlogPostViewSet, basename='blog-post')
router.register(r'blog-post-images', BlogPostImageViewSet, basename='blog-post-image')
router.register(r'news', NewsViewSet, basename='news')
router.register(r'authors', AuthorViewSet, basename='author')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', LoginView.as_view(), name='login'),
]