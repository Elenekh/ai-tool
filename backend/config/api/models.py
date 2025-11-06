from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

# ==================== TOOL MODELS ====================

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

    CATEGORY_CHOICES = [
        ('Writing', 'Writing Tools'),
        ('Design', 'Design & Graphics'),
        ('Presentation', 'Presentation Tools'),
        ('Productivity', 'Productivity & Organization'),
        ('Image Generation', 'Image Generation'),
        ('Video Editing', 'Video Editing'),
        ('Code Assistant', 'Code Assistant'),
        ('Voice & Audio', 'Voice & Audio'),
        ('Research', 'Research & Analysis'),
        ('Marketing', 'Marketing & Social Media'),
        ('Data Analysis', 'Data Analysis'),
        ('Education', 'Education & Learning'),
        ('Business', 'Business & Finance'),
        ('Music & Audio', 'Music & Audio'),
        ('3D & Animation', '3D & Animation'),
        ('Translation', 'Translation & Localization'),
        ('Customer Service', 'Customer Service'),
        ('Content Creation', 'Content Creation'),
        ('Other', 'Other'),
    ]
    
    TYPE_CHOICES = [
        ('text-to-text', 'Text to Text'),
        ('text-to-image', 'Text to Image'),
        ('text-to-video', 'Text to Video'),
        ('text-to-audio', 'Text to Audio'),
        ('image-to-image', 'Image to Image'),
        ('image-to-video', 'Image to Video'),
        ('other', 'Other'),
    ]
    
    # Basic Info
    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    logo_url = models.URLField(blank=True, null=True)
    featured_image = models.ImageField(upload_to='tools/', blank=True, null=True)

    # Details
    pricing = models.CharField(max_length=50, choices=PRICING_CHOICES)
    difficulty = models.CharField(max_length=50, choices=DIFFICULTY_CHOICES)
    rating = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
    website_url = models.URLField(blank=True, null=True)

    # Content
    overview = models.TextField(blank=True)
    usage_guide = models.TextField(blank=True, help_text="Add overall usage instructions")

    # AI Tool Type (determines what fields are used)
    type = models.CharField(max_length=100, choices=TYPE_CHOICES)

    # ==================== DEMO/EXAMPLE FIELDS ====================
    
    # Input Fields
    prompt = models.TextField(blank=True, help_text="Example text input/prompt for this tool")
    prompt_image = models.ImageField(
        upload_to='tool_prompts/', 
        blank=True, 
        null=True, 
        help_text="Example input image (for image-to-image, image-to-video)"
    )
    
    # Output Fields - Text
    result_text = models.TextField(
        blank=True, 
        null=True, 
        help_text="Example text output"
    )
    
    # Output Fields - Image
    result_image = models.ImageField(
        upload_to='tool_results/', 
        blank=True, 
        null=True, 
        help_text="Example image output"
    )
    
    # Output Fields - Video URL
    result_video_url = models.URLField(
        blank=True, 
        null=True, 
        help_text="Example video output URL (YouTube, Vimeo, direct MP4, etc.)"
    )
    
    # Output Fields - Audio URL
    result_audio_url = models.URLField(
        blank=True, 
        null=True, 
        help_text="Example audio output URL (SoundCloud, direct MP3, etc.)"
    )

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'AI Tool'
        verbose_name_plural = 'AI Tools'

    def __str__(self):
        return self.name


# ==================== KEY FEATURES (INLINE) ====================

class KeyFeature(models.Model):
    tool = models.ForeignKey(Tool, on_delete=models.CASCADE, related_name='key_features')
    feature = models.CharField(max_length=255)

    class Meta:
        verbose_name = "Key Feature"
        verbose_name_plural = "Key Features"

    def __str__(self):
        return self.feature


# ==================== PROS (INLINE) ====================

class Pro(models.Model):
    tool = models.ForeignKey(Tool, on_delete=models.CASCADE, related_name='pros')
    text = models.CharField(max_length=255)

    class Meta:
        verbose_name = "Pro"
        verbose_name_plural = "Pros"

    def __str__(self):
        return self.text


# ==================== CONS (INLINE) ====================

class Con(models.Model):
    tool = models.ForeignKey(Tool, on_delete=models.CASCADE, related_name='cons')
    text = models.CharField(max_length=255)

    class Meta:
        verbose_name = "Con"
        verbose_name_plural = "Cons"

    def __str__(self):
        return self.text


# ==================== USAGE STEPS (INLINE) ====================

class UsageStep(models.Model):
    tool = models.ForeignKey(Tool, on_delete=models.CASCADE, related_name='usage_steps')
    step = models.CharField(max_length=255)

    class Meta:
        verbose_name = "Usage Step"
        verbose_name_plural = "Usage Steps"

    def __str__(self):
        return self.step


# ==================== BLOG POST MODELS ====================

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
    
    title = models.CharField(max_length=300)
    excerpt = models.TextField(max_length=500, blank=True)
    content = models.TextField()
    
    author = models.CharField(max_length=200)
    author_avatar = models.URLField(blank=True, null=True)
    author_bio = models.TextField(blank=True)
    
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    tags = models.JSONField(default=list, blank=True)
    
    featured_image = models.ImageField(upload_to='blog/', blank=True, null=True)
    
    views = models.IntegerField(default=0)
    read_time = models.IntegerField(blank=True, null=True, help_text='Reading time in minutes')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Blog Post'
        verbose_name_plural = 'Blog Posts'
    
    def __str__(self):
        return self.title


# ==================== NEWS MODELS ====================

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


# ==================== AUTHOR MODELS ====================

class Author(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    bio = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='authors/', blank=True, null=True)
    location = models.CharField(max_length=200, blank=True)
    
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