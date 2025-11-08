from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Tool, ToolDemo, KeyFeature, Pro, Con, UsageStep,
    BlogPost, BlogPostImage, News, Author
)


# ==================== TOOL DEMO INLINE ====================

class ToolDemoInline(admin.TabularInline):
    model = ToolDemo
    extra = 1
    fields = (
        'title', 'title_ge', 'demo_type', 'order',
        'description', 'description_ge',
        'input_prompt', 'input_prompt_ge',
        'input_image_file', 'input_image_url',
        'input_audio_file', 'input_audio_url',
        'input_video_file', 'input_video_url',
        'output_text', 'output_text_ge',
        'output_image_file', 'output_image_url',
        'output_audio_file', 'output_audio_url',
        'output_video_file', 'output_video_url',
    )
    
    # Make this collapsible by default
    classes = ('collapse',)


# ==================== TOOL INLINE ADMINS ====================

class KeyFeatureInline(admin.TabularInline):
    model = KeyFeature
    extra = 1
    fields = ('feature', 'feature_ge')


class ProInline(admin.TabularInline):
    model = Pro
    extra = 1
    fields = ('text', 'text_ge')


class ConInline(admin.TabularInline):
    model = Con
    extra = 1
    fields = ('text', 'text_ge')


class UsageStepInline(admin.TabularInline):
    model = UsageStep
    extra = 1
    fields = ('step', 'step_ge')
    verbose_name = "Usage Step"
    verbose_name_plural = "Usage Guide Steps"


# ==================== TOOL ADMIN ====================

@admin.register(Tool)
class ToolAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'pricing', 'difficulty', 'rating', 'demo_count', 'created_at')
    list_filter = ('category', 'pricing', 'difficulty', 'created_at')
    search_fields = ('name', 'description', 'name_ge', 'description_ge')
    readonly_fields = ('created_at', 'updated_at', 'demo_count')

    inlines = [ToolDemoInline, KeyFeatureInline, ProInline, ConInline, UsageStepInline]

    fieldsets = (
        ('Basic Information - English', {
            'fields': ('name', 'description', 'category', 'overview')
        }),
        ('Basic Information - Georgian', {
            'fields': ('name_ge', 'description_ge', 'overview_ge'),
            'classes': ('collapse',)
        }),
        ('Branding & Media', {
            'fields': ('logo_url', 'featured_image', 'website_url'),
        }),
        ('Details', {
            'fields': ('pricing', 'difficulty', 'rating')
        }),
        ('Statistics', {
            'fields': ('demo_count',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def demo_count(self, obj):
        """Display the number of demos for this tool"""
        count = obj.demos.count()
        return format_html(
            '<span style="color: #417690; font-weight: bold;">{} Demo{}</span>',
            count,
            's' if count != 1 else ''
        )
    demo_count.short_description = 'Number of Demos'


# ==================== BLOG POST IMAGE INLINE ====================

class BlogPostImageInline(admin.TabularInline):
    model = BlogPostImage
    extra = 1
    fields = ('image', 'caption', 'caption_ge', 'alt_text', 'order', 'image_preview')
    readonly_fields = ('image_preview',)
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 100px; max-width: 200px;" />', obj.image.url)
        return "No image"
    image_preview.short_description = 'Preview'


# ==================== BLOG POST ADMIN ====================

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'views', 'image_count', 'published', 'created_at')
    list_filter = ('category', 'published', 'created_at')
    search_fields = ('title', 'author', 'content', 'title_ge', 'content_ge')
    readonly_fields = ('created_at', 'updated_at', 'views', 'image_count')
    
    inlines = [BlogPostImageInline]
    
    fieldsets = (
        ('Basic Information - English', {
            'fields': ('title', 'excerpt', 'content')
        }),
        ('Basic Information - Georgian', {
            'fields': ('title_ge', 'excerpt_ge', 'content_ge'),
            'classes': ('collapse',)
        }),
        ('Author - English', {
            'fields': ('author', 'author_avatar', 'author_bio')
        }),
        ('Author - Georgian', {
            'fields': ('author_bio_ge',),
            'classes': ('collapse',)
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
    
    def image_count(self, obj):
        """Display the number of images for this blog post"""
        count = obj.images.count()
        return format_html(
            '<span style="color: #417690; font-weight: bold;">{} Image{}</span>',
            count,
            's' if count != 1 else ''
        )
    image_count.short_description = 'Images'


# ==================== NEWS ADMIN ====================

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'source', 'published', 'created_at')
    list_filter = ('category', 'published', 'created_at')
    search_fields = ('title', 'summary', 'source', 'title_ge', 'summary_ge')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Content - English', {
            'fields': ('title', 'summary', 'category')
        }),
        ('Content - Georgian', {
            'fields': ('title_ge', 'summary_ge'),
            'classes': ('collapse',)
        }),
        ('Source', {
            'fields': ('source', 'external_url', 'tags')
        }),
        ('Publishing', {
            'fields': ('published', 'created_at', 'updated_at')
        }),
    )


# ==================== AUTHOR ADMIN ====================

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_verified', 'created_at')
    list_filter = ('is_verified', 'created_at')
    search_fields = ('name', 'bio', 'bio_ge')
    readonly_fields = ('created_at',)
    prepopulated_fields = {'slug': ('name',)}
    
    fieldsets = (
        ('Basic Information - English', {
            'fields': ('name', 'slug', 'bio')
        }),
        ('Basic Information - Georgian', {
            'fields': ('bio_ge',),
            'classes': ('collapse',)
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