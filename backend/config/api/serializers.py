from rest_framework import serializers
from .models import (
    Tool, ToolDemo, KeyFeature, Pro, Con, UsageStep,
    BlogPost, BlogPostImage, News, Author
)
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)


# ==================== TOOL DEMO SERIALIZERS ====================

class ToolDemoSerializer(serializers.ModelSerializer):
    # Media fields - return URL (prefer URL over file)
    input_image = serializers.SerializerMethodField()
    input_audio = serializers.SerializerMethodField()
    input_video = serializers.SerializerMethodField()
    output_image = serializers.SerializerMethodField()
    output_audio = serializers.SerializerMethodField()
    output_video = serializers.SerializerMethodField()

    class Meta:
        model = ToolDemo
        fields = (
            'id', 'tool', 'demo_type', 'title', 'title_ge', 
            'description', 'description_ge', 'order',
            'input_prompt', 'input_prompt_ge',
            'input_image', 'input_audio', 'input_video',
            'output_text', 'output_text_ge',
            'output_image', 'output_audio', 'output_video',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def _get_media_url(self, obj, url_field, file_field):
        """Helper to get media URL (prefers URL over file)"""
        request = self.context.get('request')
        
        # URL takes precedence
        url_value = getattr(obj, url_field, None)
        if url_value:
            return url_value
        
        # Fall back to file
        file_value = getattr(obj, file_field, None)
        if file_value:
            try:
                if hasattr(file_value, 'url'):
                    return request.build_absolute_uri(file_value.url) if request else file_value.url
                return str(file_value)
            except Exception:
                return None
        
        return None

    def get_input_image(self, obj):
        return self._get_media_url(obj, 'input_image_url', 'input_image_file')

    def get_input_audio(self, obj):
        return self._get_media_url(obj, 'input_audio_url', 'input_audio_file')

    def get_input_video(self, obj):
        return self._get_media_url(obj, 'input_video_url', 'input_video_file')

    def get_output_image(self, obj):
        return self._get_media_url(obj, 'output_image_url', 'output_image_file')

    def get_output_audio(self, obj):
        return self._get_media_url(obj, 'output_audio_url', 'output_audio_file')

    def get_output_video(self, obj):
        return self._get_media_url(obj, 'output_video_url', 'output_video_file')


# ==================== TOOL RELATED SERIALIZERS ====================

class KeyFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = KeyFeature
        fields = ('id', 'tool', 'feature', 'feature_ge')
        read_only_fields = ('id',)


class ProSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pro
        fields = ('id', 'tool', 'text', 'text_ge')
        read_only_fields = ('id',)


class ConSerializer(serializers.ModelSerializer):
    class Meta:
        model = Con
        fields = ('id', 'tool', 'text', 'text_ge')
        read_only_fields = ('id',)


class UsageStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsageStep
        fields = ('id', 'tool', 'step', 'step_ge')
        read_only_fields = ('id',)


class ToolSerializer(serializers.ModelSerializer):
    # Nested related fields
    key_features = KeyFeatureSerializer(many=True, read_only=True)
    pros = ProSerializer(many=True, read_only=True)
    cons = ConSerializer(many=True, read_only=True)
    usage_steps = UsageStepSerializer(many=True, read_only=True)
    demos = ToolDemoSerializer(many=True, read_only=True)

    # Media fields
    featured_image = serializers.SerializerMethodField()

    class Meta:
        model = Tool
        fields = (
            'id', 'name', 'name_ge', 
            'description', 'description_ge',
            'category',
            'pricing', 'difficulty', 'rating', 
            'overview', 'overview_ge',
            'logo_url', 'featured_image', 'website_url',
            'key_features', 'pros', 'cons', 'usage_steps',
            'demos',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_featured_image(self, obj):
        """Convert featured image to absolute URL"""
        request = self.context.get('request')
        if obj.featured_image:
            try:
                if hasattr(obj.featured_image, 'url'):
                    return request.build_absolute_uri(obj.featured_image.url) if request else obj.featured_image.url
                return obj.featured_image
            except Exception:
                return None
        return None


# ==================== BLOG POST IMAGE SERIALIZER ====================

class BlogPostImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = BlogPostImage
        fields = ('id', 'blog_post', 'image', 'caption', 'caption_ge', 'alt_text', 'order', 'created_at')
        read_only_fields = ('id', 'created_at')

    def get_image(self, obj):
        """Convert image to absolute URL"""
        request = self.context.get('request')
        if obj.image:
            try:
                if hasattr(obj.image, 'url'):
                    return request.build_absolute_uri(obj.image.url) if request else obj.image.url
                return obj.image
            except Exception:
                return None
        return None


# ==================== BLOG POST SERIALIZERS ====================

class BlogPostSerializer(serializers.ModelSerializer):
    featured_image = serializers.SerializerMethodField()
    images = BlogPostImageSerializer(many=True, read_only=True)

    class Meta:
        model = BlogPost
        fields = (
            'id', 'title', 'title_ge',
            'excerpt', 'excerpt_ge',
            'content', 'content_ge',
            'author', 'author_avatar',
            'author_bio', 'author_bio_ge',
            'category', 'tags', 'featured_image',
            'images',
            'views', 'read_time',
            'created_at', 'updated_at', 'published'
        )
        read_only_fields = ('created_at', 'updated_at', 'views')

    def get_featured_image(self, obj):
        """Convert featured image to absolute URL"""
        request = self.context.get('request')
        if obj.featured_image:
            try:
                if hasattr(obj.featured_image, 'url'):
                    return request.build_absolute_uri(obj.featured_image.url) if request else obj.featured_image.url
                return obj.featured_image
            except Exception:
                return None
        return None


# ==================== NEWS SERIALIZERS ====================

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = (
            'id', 'title', 'title_ge',
            'summary', 'summary_ge',
            'category', 'source', 'external_url', 'tags',
            'created_at', 'updated_at', 'published'
        )
        read_only_fields = ('created_at', 'updated_at')


# ==================== AUTHOR SERIALIZERS ====================

class AuthorSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = Author
        fields = (
            'id', 'name', 'slug',
            'bio', 'bio_ge',
            'profile_image', 'location',
            'linkedin_url', 'twitter_url', 'instagram_url', 
            'github_url', 'personal_website',
            'is_verified', 'created_at'
        )
        read_only_fields = ('created_at',)

    def get_profile_image(self, obj):
        """Convert profile image to absolute URL"""
        request = self.context.get('request')
        if obj.profile_image:
            try:
                if hasattr(obj.profile_image, 'url'):
                    return request.build_absolute_uri(obj.profile_image.url) if request else obj.profile_image.url
                return obj.profile_image
            except Exception:
                return None
        return None


# ==================== JWT SERIALIZERS ====================

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        token['is_staff'] = user.is_staff
        return token