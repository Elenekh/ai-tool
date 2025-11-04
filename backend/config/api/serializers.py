from rest_framework import serializers
from .models import Tool, BlogPost, News, Author
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)


class AuthorSerializer(serializers.ModelSerializer):
    # Convert relative image paths to absolute URLs
    profile_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Author
        fields = '__all__'
        read_only_fields = ('created_at',)
    
    def get_profile_image(self, obj):
        """Convert profile image to absolute URL"""
        request = self.context.get('request')
        if obj.profile_image:
            try:
                # If it's a file upload, build absolute URL
                if hasattr(obj.profile_image, 'url'):
                    return request.build_absolute_uri(obj.profile_image.url) if request else obj.profile_image.url
                return obj.profile_image
            except Exception as e:
                return None
        return None


class ToolSerializer(serializers.ModelSerializer):
    # Convert relative media paths to absolute URLs
    logo_url = serializers.URLField(required=False, allow_blank=True)
    featured_image = serializers.SerializerMethodField()
    input_image_url = serializers.URLField(required=False, allow_blank=True)
    output_image_url = serializers.URLField(required=False, allow_blank=True)
    input_video_url = serializers.URLField(required=False, allow_blank=True)
    output_video_url = serializers.URLField(required=False, allow_blank=True)
    input_audio_url = serializers.URLField(required=False, allow_blank=True)
    output_audio_url = serializers.URLField(required=False, allow_blank=True)
    
    class Meta:
        model = Tool
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
    
    def get_featured_image(self, obj):
        """Convert featured image to absolute URL"""
        request = self.context.get('request')
        if obj.featured_image:
            try:
                if hasattr(obj.featured_image, 'url'):
                    return request.build_absolute_uri(obj.featured_image.url) if request else obj.featured_image.url
                return obj.featured_image
            except Exception as e:
                return None
        return None


class BlogPostSerializer(serializers.ModelSerializer):
    # Convert relative media paths to absolute URLs
    featured_image = serializers.SerializerMethodField()
    author_avatar = serializers.URLField(required=False, allow_blank=True)
    
    class Meta:
        model = BlogPost
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'views')
    
    def get_featured_image(self, obj):
        """Convert featured image to absolute URL"""
        request = self.context.get('request')
        if obj.featured_image:
            try:
                if hasattr(obj.featured_image, 'url'):
                    return request.build_absolute_uri(obj.featured_image.url) if request else obj.featured_image.url
                return obj.featured_image
            except Exception as e:
                return None
        return None


class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        token['is_staff'] = user.is_staff
        
        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer