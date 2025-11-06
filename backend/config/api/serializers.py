from rest_framework import serializers
from .models import (
    Tool, KeyFeature, Pro, Con, UsageStep,
    BlogPost, News, Author
)
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)


# ==================== TOOL RELATED SERIALIZERS ====================

class KeyFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = KeyFeature
        fields = ('id', 'tool', 'feature')
        read_only_fields = ('id',)


class ProSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pro
        fields = ('id', 'tool', 'text')
        read_only_fields = ('id',)


class ConSerializer(serializers.ModelSerializer):
    class Meta:
        model = Con
        fields = ('id', 'tool', 'text')
        read_only_fields = ('id',)


class UsageStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsageStep
        fields = ('id', 'tool', 'step')
        read_only_fields = ('id',)


class ToolSerializer(serializers.ModelSerializer):
    # Nested related fields
    key_features = KeyFeatureSerializer(many=True, read_only=True)
    pros = ProSerializer(many=True, read_only=True)
    cons = ConSerializer(many=True, read_only=True)
    usage_steps = UsageStepSerializer(many=True, read_only=True)

    # Media fields
    featured_image = serializers.SerializerMethodField()
    prompt_image = serializers.SerializerMethodField()
    result_image = serializers.SerializerMethodField()

    class Meta:
        model = Tool
        fields = (
            'id', 'name', 'description', 'category', 'type',
            'pricing', 'difficulty', 'rating', 'overview', 'usage_guide',
            'logo_url', 'featured_image', 'website_url',
            'prompt', 'prompt_image', 
            'result_text', 'result_image', 'result_video_url', 'result_audio_url',
            'key_features', 'pros', 'cons', 'usage_steps',
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

    def get_prompt_image(self, obj):
        """Convert prompt image to absolute URL"""
        request = self.context.get('request')
        if obj.prompt_image:
            try:
                if hasattr(obj.prompt_image, 'url'):
                    return request.build_absolute_uri(obj.prompt_image.url) if request else obj.prompt_image.url
                return obj.prompt_image
            except Exception:
                return None
        return None

    def get_result_image(self, obj):
        """Convert result image to absolute URL"""
        request = self.context.get('request')
        if obj.result_image:
            try:
                if hasattr(obj.result_image, 'url'):
                    return request.build_absolute_uri(obj.result_image.url) if request else obj.result_image.url
                return obj.result_image
            except Exception:
                return None
        return None


# ==================== BLOG POST SERIALIZERS ====================

class BlogPostSerializer(serializers.ModelSerializer):
    featured_image = serializers.SerializerMethodField()

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
            except Exception:
                return None
        return None


# ==================== NEWS SERIALIZERS ====================

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


# ==================== AUTHOR SERIALIZERS ====================

class AuthorSerializer(serializers.ModelSerializer):
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