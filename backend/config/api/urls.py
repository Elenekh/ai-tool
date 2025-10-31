from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ToolViewSet, BlogPostViewSet, NewsViewSet, AuthorViewSet,
    LoginView
)

router = DefaultRouter()
router.register(r'tools', ToolViewSet, basename='tool')
router.register(r'blog-posts', BlogPostViewSet, basename='blog-post')
router.register(r'news', NewsViewSet, basename='news')
router.register(r'authors', AuthorViewSet, basename='author')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', LoginView.as_view(), name='login'),
]