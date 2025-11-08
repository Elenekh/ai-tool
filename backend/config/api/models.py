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
        ('image-to-text', 'Image to Text'),
        ('audio-to-text', 'Audio to Text'),
        ('video-to-text', 'Video to Text'),
        ('multi-modal', 'Multi-modal'),
        ('other', 'Other'),
    ]
    
    # Basic Info - English
    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    overview = models.TextField(blank=True, help_text="Short overview of how the tool works")
    
    # Basic Info - Georgian
    name_ge = models.CharField(max_length=200, blank=True, verbose_name="Name (Georgian)")
    description_ge = models.TextField(blank=True, verbose_name="Description (Georgian)")
    overview_ge = models.TextField(blank=True, verbose_name="Overview (Georgian)")
    
    # Media (no translation needed)
    logo_url = models.URLField(blank=True, null=True)
    featured_image = models.ImageField(upload_to='tools/', blank=True, null=True)

    # Details
    pricing = models.CharField(max_length=50, choices=PRICING_CHOICES)
    difficulty = models.CharField(max_length=50, choices=DIFFICULTY_CHOICES)
    rating = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
    website_url = models.URLField(blank=True, null=True)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'AI Tool'
        verbose_name_plural = 'AI Tools'

    def __str__(self):
        return self.name


# ==================== TOOL DEMO MODEL ====================

class ToolDemo(models.Model):
    DEMO_TYPE_CHOICES = [
        ('text-to-text', 'Text to Text'),
        ('text-to-image', 'Text to Image'),
        ('text-to-video', 'Text to Video'),
        ('text-to-audio', 'Text to Audio'),
        ('image-to-image', 'Image to Image'),
        ('image-to-video', 'Image to Video'),
        ('image-to-text', 'Image to Text'),
        ('audio-to-text', 'Audio to Text'),
        ('video-to-text', 'Video to Text'),
        ('multi-modal', 'Multi-modal (Multiple Inputs)'),
        ('other', 'Other'),
    ]

    tool = models.ForeignKey(Tool, on_delete=models.CASCADE, related_name='demos')
    demo_type = models.CharField(max_length=100, choices=DEMO_TYPE_CHOICES)
    
    # Title and Description - English
    title = models.CharField(max_length=255, help_text="e.g., 'Creative Writing', 'Code Generation'")
    description = models.TextField(blank=True, help_text="Brief description of what this demo shows")
    
    # Title and Description - Georgian
    title_ge = models.CharField(max_length=255, blank=True, verbose_name="Title (Georgian)")
    description_ge = models.TextField(blank=True, verbose_name="Description (Georgian)")

    # ==================== INPUT FIELDS ====================
    
    # Text Input - English
    input_prompt = models.TextField(
        blank=True, 
        help_text="Example text input/prompt for this demo"
    )
    
    # Text Input - Georgian
    input_prompt_ge = models.TextField(
        blank=True,
        verbose_name="Input Prompt (Georgian)",
        help_text="Georgian translation of the input prompt"
    )
    
    # Image Input (can upload or use URL)
    input_image_file = models.ImageField(
        upload_to='demo_inputs/', 
        blank=True, 
        null=True, 
        help_text="Upload an image file"
    )
    input_image_url = models.URLField(
        blank=True, 
        null=True, 
        help_text="Or provide a URL to an image (e.g., from Google Drive, Imgur, etc.)"
    )
    
    # Audio Input
    input_audio_file = models.FileField(
        upload_to='demo_inputs/audio/', 
        blank=True, 
        null=True, 
        help_text="Upload an audio file (MP3, WAV, etc.)"
    )
    input_audio_url = models.URLField(
        blank=True, 
        null=True, 
        help_text="Or provide a URL to audio"
    )
    
    # Video Input
    input_video_file = models.FileField(
        upload_to='demo_inputs/video/', 
        blank=True, 
        null=True, 
        help_text="Upload a video file (MP4, WebM, etc.)"
    )
    input_video_url = models.URLField(
        blank=True, 
        null=True, 
        help_text="Or provide a URL to a video"
    )

    # ==================== OUTPUT FIELDS ====================
    
    # Text Output - English
    output_text = models.TextField(
        blank=True, 
        null=True, 
        help_text="Example text output"
    )
    
    # Text Output - Georgian
    output_text_ge = models.TextField(
        blank=True,
        null=True,
        verbose_name="Output Text (Georgian)",
        help_text="Georgian translation of the output text"
    )
    
    # Image Output (can upload or use URL)
    output_image_file = models.ImageField(
        upload_to='demo_outputs/', 
        blank=True, 
        null=True, 
        help_text="Upload an image file"
    )
    output_image_url = models.URLField(
        blank=True, 
        null=True, 
        help_text="Or provide a URL to an image"
    )
    
    # Audio Output
    output_audio_file = models.FileField(
        upload_to='demo_outputs/audio/', 
        blank=True, 
        null=True, 
        help_text="Upload an audio file"
    )
    output_audio_url = models.URLField(
        blank=True, 
        null=True, 
        help_text="Or provide a URL to audio"
    )
    
    # Video Output
    output_video_file = models.FileField(
        upload_to='demo_outputs/video/', 
        blank=True, 
        null=True, 
        help_text="Upload a video file"
    )
    output_video_url = models.URLField(
        blank=True, 
        null=True, 
        help_text="Or provide a URL to a video (YouTube, Vimeo, direct MP4, etc.)"
    )

    # Metadata
    order = models.PositiveIntegerField(default=0, help_text="Display order (0 = first)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = 'Tool Demo'
        verbose_name_plural = 'Tool Demos'

    def __str__(self):
        return f"{self.tool.name} - {self.title}"


# ==================== KEY FEATURES (INLINE) ====================

class KeyFeature(models.Model):
    tool = models.ForeignKey(Tool, on_delete=models.CASCADE, related_name='key_features')
    feature = models.CharField(max_length=255)
    feature_ge = models.CharField(max_length=255, blank=True, verbose_name="Feature (Georgian)")

    class Meta:
        verbose_name = "Key Feature"
        verbose_name_plural = "Key Features"

    def __str__(self):
        return self.feature


# ==================== PROS (INLINE) ====================

class Pro(models.Model):
    tool = models.ForeignKey(Tool, on_delete=models.CASCADE, related_name='pros')
    text = models.CharField(max_length=255)
    text_ge = models.CharField(max_length=255, blank=True, verbose_name="Text (Georgian)")

    class Meta:
        verbose_name = "Pro"
        verbose_name_plural = "Pros"

    def __str__(self):
        return self.text


# ==================== CONS (INLINE) ====================

class Con(models.Model):
    tool = models.ForeignKey(Tool, on_delete=models.CASCADE, related_name='cons')
    text = models.CharField(max_length=255)
    text_ge = models.CharField(max_length=255, blank=True, verbose_name="Text (Georgian)")

    class Meta:
        verbose_name = "Con"
        verbose_name_plural = "Cons"

    def __str__(self):
        return self.text


# ==================== USAGE STEPS (INLINE) ====================

class UsageStep(models.Model):
    tool = models.ForeignKey(Tool, on_delete=models.CASCADE, related_name='usage_steps')
    step = models.CharField(max_length=255)
    step_ge = models.CharField(max_length=255, blank=True, verbose_name="Step (Georgian)")

    class Meta:
        verbose_name = "Usage Step"
        verbose_name_plural = "Usage Guide Steps"

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
    
    # English fields
    title = models.CharField(max_length=300)
    excerpt = models.TextField(max_length=500, blank=True)
    content = models.TextField()
    
    # Georgian fields
    title_ge = models.CharField(max_length=300, blank=True, verbose_name="Title (Georgian)")
    excerpt_ge = models.TextField(max_length=500, blank=True, verbose_name="Excerpt (Georgian)")
    content_ge = models.TextField(blank=True, verbose_name="Content (Georgian)")
    
    author = models.CharField(max_length=200)
    author_avatar = models.URLField(blank=True, null=True)
    author_bio = models.TextField(blank=True)
    author_bio_ge = models.TextField(blank=True, verbose_name="Author Bio (Georgian)")
    
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


# ==================== BLOG POST IMAGE MODEL ====================

class BlogPostImage(models.Model):
    blog_post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='blog/content_images/')
    caption = models.CharField(max_length=255, blank=True)
    caption_ge = models.CharField(max_length=255, blank=True, verbose_name="Caption (Georgian)")
    alt_text = models.CharField(max_length=255, blank=True, help_text="Alt text for accessibility")
    order = models.PositiveIntegerField(default=0, help_text="Display order within blog post")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = 'Blog Post Image'
        verbose_name_plural = 'Blog Post Images'
    
    def __str__(self):
        return f"{self.blog_post.title} - Image {self.order}"


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
    
    # English fields
    title = models.CharField(max_length=300)
    summary = models.TextField(max_length=500)
    
    # Georgian fields
    title_ge = models.CharField(max_length=300, blank=True, verbose_name="Title (Georgian)")
    summary_ge = models.TextField(max_length=500, blank=True, verbose_name="Summary (Georgian)")
    
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
    bio_ge = models.TextField(blank=True, verbose_name="Bio (Georgian)")
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