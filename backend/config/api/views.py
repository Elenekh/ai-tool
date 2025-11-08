from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .models import (
    Tool, ToolDemo, KeyFeature, Pro, Con, UsageStep,
    BlogPost, BlogPostImage, News, Author
)
from .serializers import (
    ToolSerializer, ToolDemoSerializer, KeyFeatureSerializer,
    ProSerializer, ConSerializer, UsageStepSerializer,
    BlogPostSerializer, BlogPostImageSerializer, NewsSerializer, AuthorSerializer
)
from .permissions import IsAdminOrReadOnly, IsAuthorOrAdmin


# ==================== TOOL VIEWSETS ====================

class ToolViewSet(viewsets.ModelViewSet):
    queryset = Tool.objects.all()
    serializer_class = ToolSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'pricing', 'difficulty']
    search_fields = ['name', 'description', 'category']
    ordering_fields = ['created_at', 'rating', 'name']
    ordering = ['-created_at']


# ==================== TOOL DEMO VIEWSETS ====================

class ToolDemoViewSet(viewsets.ModelViewSet):
    queryset = ToolDemo.objects.all()
    serializer_class = ToolDemoSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['tool', 'demo_type']
    search_fields = ['title', 'description', 'tool__name']
    ordering_fields = ['order', 'created_at']
    ordering = ['order', 'created_at']


class KeyFeatureViewSet(viewsets.ModelViewSet):
    queryset = KeyFeature.objects.all()
    serializer_class = KeyFeatureSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tool']


class ProViewSet(viewsets.ModelViewSet):
    queryset = Pro.objects.all()
    serializer_class = ProSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tool']


class ConViewSet(viewsets.ModelViewSet):
    queryset = Con.objects.all()
    serializer_class = ConSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tool']


class UsageStepViewSet(viewsets.ModelViewSet):
    queryset = UsageStep.objects.all()
    serializer_class = UsageStepSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tool']


# ==================== BLOG POST VIEWSETS ====================

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.filter(published=True)
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'author', 'published']
    search_fields = ['title', 'author', 'content', 'tags']
    ordering_fields = ['created_at', 'views']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthorOrAdmin()]
        elif self.action == 'increment_views':
            return [AllowAny()]
        return super().get_permissions()

    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        """Increment view count for a blog post"""
        post = self.get_object()
        post.views += 1
        post.save()
        serializer = self.get_serializer(post)
        return Response(serializer.data)


class BlogPostImageViewSet(viewsets.ModelViewSet):
    queryset = BlogPostImage.objects.all()
    serializer_class = BlogPostImageSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['blog_post']
    ordering_fields = ['order', 'created_at']
    ordering = ['order', 'created_at']


# ==================== NEWS VIEWSETS ====================

class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.filter(published=True)
    serializer_class = NewsSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'published']
    search_fields = ['title', 'summary', 'source', 'tags']
    ordering_fields = ['created_at']
    ordering = ['-created_at']


# ==================== AUTHOR VIEWSETS ====================

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'bio']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    @action(detail=False, methods=['get'])
    def by_slug(self, request):
        """Get author by slug"""
        slug = request.query_params.get('slug')
        if not slug:
            return Response(
                {'error': 'slug parameter required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            author = Author.objects.get(slug=slug)
            serializer = self.get_serializer(author)
            return Response(serializer.data)
        except Author.DoesNotExist:
            return Response(
                {'error': 'Author not found'},
                status=status.HTTP_404_NOT_FOUND
            )


# ==================== CUSTOM LOGIN ENDPOINT ====================

class LoginView(APIView):
    """Custom login endpoint"""
    permission_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)

        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
            }
        })