# ==================== UPDATED MODELS.PY ====================
# Add these new fields to your Tool model:

"""
class Tool(models.Model):
    # ... existing fields ...
    
    # Demo/Example Fields - Universal
    prompt = models.TextField(blank=True, help_text="Example text input/prompt for this tool")
    prompt_image = models.ImageField(upload_to='tool_prompts/', blank=True, null=True, help_text="Example input image (for image-to-image, image-to-video)")
    
    # Text Results
    result_text = models.TextField(blank=True, null=True, help_text="Example text output")
    
    # Image Results
    result_image = models.ImageField(upload_to='tool_results/', blank=True, null=True, help_text="Example image output")
    
    # Video Results (URL)
    result_video_url = models.URLField(blank=True, null=True, help_text="Example video output URL (YouTube, Vimeo, etc.)")
    
    # Audio Results (URL)
    result_audio_url = models.URLField(blank=True, null=True, help_text="Example audio output URL")
    
    # ... rest of fields ...
"""

# ==================== UPDATED ADMIN.PY ====================

from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Tool, KeyFeature, Pro, Con, UsageStep,
    BlogPost, News, Author
)


# ==================== TOOL INLINE ADMINS ====================

class KeyFeatureInline(admin.TabularInline):
    model = KeyFeature
    extra = 1
    fields = ('feature',)


class ProInline(admin.TabularInline):
    model = Pro
    extra = 1
    fields = ('text',)


class ConInline(admin.TabularInline):
    model = Con
    extra = 1
    fields = ('text',)


class UsageStepInline(admin.TabularInline):
    model = UsageStep
    extra = 1
    fields = ('step',)


@admin.register(Tool)
class ToolAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'type', 'pricing', 'difficulty', 'rating', 'created_at')
    list_filter = ('category', 'type', 'pricing', 'difficulty', 'created_at')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at', 'updated_at')

    inlines = [KeyFeatureInline, ProInline, ConInline, UsageStepInline]

    class Media:
        js = ('admin/js/tool_example_toggle.js',)

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'category')
        }),
        ('Branding & Media', {
            'fields': ('logo_url', 'featured_image', 'website_url'),
        }),
        ('Details', {
            'fields': ('pricing', 'difficulty', 'rating')
        }),
        ('Content', {
            'fields': ('overview', 'usage_guide'),
        }),
        ('AI Tool Type', {
            'fields': ('type',),
            'description': 'Select tool type. The input/output fields below will adjust accordingly.',
        }),
        ('Demo Input - Text Prompt', {
            'fields': ('prompt',),
            'description': 'Enter example text input/prompt',
        }),
        ('Demo Input - Image', {
            'fields': ('prompt_image',),
            'description': 'Upload example input image (for image-to-image, image-to-video)',
        }),
        ('Demo Output - Text', {
            'fields': ('result_text',),
            'description': 'Enter example text output',
        }),
        ('Demo Output - Image', {
            'fields': ('result_image',),
            'description': 'Upload example image output',
        }),
        ('Demo Output - Video URL', {
            'fields': ('result_video_url',),
            'description': 'Enter video URL (YouTube, Vimeo, direct MP4, etc.)',
        }),
        ('Demo Output - Audio URL', {
            'fields': ('result_audio_url',),
            'description': 'Enter audio URL (SoundCloud, direct MP3, etc.)',
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


# ==================== BLOG POST ADMIN ====================

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


# ==================== NEWS ADMIN ====================

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


# ==================== AUTHOR ADMIN ====================

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_verified', 'created_at')
    list_filter = ('is_verified', 'created_at')
    search_fields = ('name', 'bio')
    readonly_fields = ('created_at',)
    prepopulated_fields = {'slug': ('name',)}
    
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