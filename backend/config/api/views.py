from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .models import Tool, BlogPost, News, Author
from .serializers import ToolSerializer, BlogPostSerializer, NewsSerializer, AuthorSerializer
from .permissions import IsAdminOrReadOnly, IsAuthorOrAdmin


# ----------------------- Tool ViewSet -----------------------
class ToolViewSet(viewsets.ModelViewSet):
    queryset = Tool.objects.all()
    serializer_class = ToolSerializer
    permission_classes = [IsAdminOrReadOnly]  # Only admins can create/update/delete
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'pricing', 'difficulty', 'is_featured']
    search_fields = ['name', 'description', 'category']
    ordering_fields = ['created_at', 'rating', 'name']
    ordering = ['-created_at']
    pagination_class = None  # Disable pagination or use default


# ----------------------- BlogPost ViewSet -----------------------
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
        # Apply custom permission for unsafe methods
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthorOrAdmin()]
        return super().get_permissions()

    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        """Increment view count for a blog post"""
        post = self.get_object()
        post.views += 1
        post.save()
        serializer = self.get_serializer(post)
        return Response(serializer.data)


# ----------------------- News ViewSet -----------------------
class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.filter(published=True)
    serializer_class = NewsSerializer
    permission_classes = [IsAdminOrReadOnly]  # Only admins can modify news
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'published']
    search_fields = ['title', 'summary', 'source', 'tags']
    ordering_fields = ['created_at']
    ordering = ['-created_at']


# ----------------------- Author ViewSet -----------------------
class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [IsAdminOrReadOnly]  # Only admins can modify author info
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


# ----------------------- Custom Login Endpoint -----------------------
class LoginView(APIView):
    """Custom login endpoint"""
    permission_classes = []  # Public endpoint

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
