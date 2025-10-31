from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Tool(models.Model):
    PRICING_CHOICES = [
        ('Free', 'Free'),
        ('Freemium', 'Freemium'),
        ('Paid', 'Paid'),
        ('Enterprise', 'Enterprise'),
    ]
    
    DIFFICULTY_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]
    
    # Basic Info
    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=100)
    
    # Images & Branding
    logo_url = models.URLField(blank=True, null=True)
    featured_image = models.ImageField(upload_to='tools/', blank=True, null=True)
    brand_color = models.CharField(max_length=7, blank=True, default='#667eea')
    
    # Details
    pricing = models.CharField(max_length=50, choices=PRICING_CHOICES)
    difficulty = models.CharField(max_length=50, choices=DIFFICULTY_CHOICES)
    rating = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
    
    # Content
    overview = models.TextField(blank=True)
    usage_guide = models.TextField(blank=True)
    key_features = models.JSONField(default=list, blank=True)
    pros = models.JSONField(default=list, blank=True)
    cons = models.JSONField(default=list, blank=True)
    
    # Additional Info
    website_url = models.URLField(blank=True, null=True)
    editor_score = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(10)])
    review = models.TextField(blank=True)
    users = models.CharField(max_length=100, blank=True)
    is_featured = models.BooleanField(default=False)
    use_cases = models.JSONField(default=list, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'AI Tool'
        verbose_name_plural = 'AI Tools'
    
    def __str__(self):
        return self.name


class BlogPost(models.Model):
    CATEGORY_CHOICES = [
        ('AI Tools', 'AI Tools'),
        ('Tutorials', 'Tutorials'),
        ('Reviews', 'Reviews'),
        ('Updates', 'Updates'),
        ('Case Studies', 'Case Studies'),
        ('Productivity', 'Productivity'),
        ('Education', 'Education'),
    ]
    
    # Basic Info
    title = models.CharField(max_length=300)
    excerpt = models.TextField(max_length=500, blank=True)
    content = models.TextField()
    
    # Author Info
    author = models.CharField(max_length=200)
    author_avatar = models.URLField(blank=True, null=True)
    author_bio = models.TextField(blank=True)
    
    # Metadata
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    tags = models.JSONField(default=list, blank=True)
    
    # Images
    featured_image = models.ImageField(upload_to='blog/', blank=True, null=True)
    
    # Analytics
    views = models.IntegerField(default=0)
    read_time = models.IntegerField(blank=True, null=True, help_text='Reading time in minutes')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Blog Post'
        verbose_name_plural = 'Blog Posts'
    
    def __str__(self):
        return self.title


class News(models.Model):
    CATEGORY_CHOICES = [
        ('Product Launch', 'Product Launch'),
        ('Feature Update', 'Feature Update'),
        ('Industry News', 'Industry News'),
        ('Company Announcement', 'Company Announcement'),
        ('Research', 'Research'),
        ('Events', 'Events'),
    ]
    
    title = models.CharField(max_length=300)
    summary = models.TextField(max_length=500)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    source = models.CharField(max_length=200, blank=True)
    external_url = models.URLField(blank=True, null=True)
    tags = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'News Item'
        verbose_name_plural = 'News Items'
    
    def __str__(self):
        return self.title


class Author(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    bio = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='authors/', blank=True, null=True)
    location = models.CharField(max_length=200, blank=True)
    
    # Social Links
    linkedin_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    instagram_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    personal_website = models.URLField(blank=True, null=True)
    
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name