from django.contrib import admin
from .models import Tool, BlogPost, News, Author


@admin.register(Tool)
class ToolAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'type', 'pricing', 'difficulty', 'rating', 'is_featured', 'created_at')
    list_filter = ('category', 'type', 'pricing', 'difficulty', 'is_featured', 'created_at')
    search_fields = ('name', 'description', 'category')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'category')
        }),
        ('Images & Branding', {
            'fields': ('logo_url', 'featured_image', 'brand_color')
        }),
        ('Details', {
            'fields': ('pricing', 'difficulty', 'rating', 'website_url')
        }),
        ('Content', {
            'fields': ('overview', 'usage_guide', 'key_features', 'pros', 'cons', 'use_cases')
        }),
        ('AI Tool Demonstration', {
            'fields': ('type', 'prompt', 'result'),
            'description': 'Configure how this AI tool works with example inputs and outputs',
            'classes': ('wide',)
        }),
        ('Demo Input Media', {
            'fields': ('input_image_url', 'input_video_url', 'input_audio_url'),
            'description': 'Input media URLs (leave empty for generative AI tools like text-to-image)',
            'classes': ('collapse',)
        }),
        ('Demo Output Media', {
            'fields': ('output_image_url', 'output_video_url', 'output_audio_url'),
            'description': 'Output media URLs showing the AI-generated results',
            'classes': ('wide',)
        }),
        ('Admin Review', {
            'fields': ('review', 'editor_score', 'users', 'is_featured')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'views', 'published', 'created_at')
    list_filter = ('category', 'published', 'created_at')
    search_fields = ('title', 'author', 'content')
    readonly_fields = ('created_at', 'updated_at', 'views')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'excerpt', 'content')
        }),
        ('Author', {
            'fields': ('author', 'author_avatar', 'author_bio')
        }),
        ('Metadata', {
            'fields': ('category', 'tags', 'read_time')
        }),
        ('Images', {
            'fields': ('featured_image',)
        }),
        ('Analytics', {
            'fields': ('views',),
            'classes': ('collapse',)
        }),
        ('Publishing', {
            'fields': ('published', 'created_at', 'updated_at')
        }),
    )


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'source', 'published', 'created_at')
    list_filter = ('category', 'published', 'created_at')
    search_fields = ('title', 'summary', 'source')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Content', {
            'fields': ('title', 'summary', 'category')
        }),
        ('Source', {
            'fields': ('source', 'external_url', 'tags')
        }),
        ('Publishing', {
            'fields': ('published', 'created_at', 'updated_at')
        }),
    )


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_verified', 'created_at')
    list_filter = ('is_verified', 'created_at')
    search_fields = ('name', 'bio')
    readonly_fields = ('created_at',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'bio')
        }),
        ('Profile', {
            'fields': ('profile_image', 'location', 'is_verified')
        }),
        ('Social Links', {
            'fields': ('linkedin_url', 'twitter_url', 'instagram_url', 'github_url', 'personal_website')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )