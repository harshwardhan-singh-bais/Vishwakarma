from django.db import models

class Project(models.Model):
    TYPE_GROW = 'Grow a Business'
    TYPE_ENTRY = 'New Market Entry'
    PROJECT_TYPE_CHOICES = [
        (TYPE_GROW, 'Grow a Business'),
        (TYPE_ENTRY, 'New Market Entry'),
    ]

    name = models.CharField(max_length=255)
    type = models.CharField(max_length=32, choices=PROJECT_TYPE_CHOICES)
    created_date = models.DateField(auto_now_add=True)
    questions_answered = models.BooleanField(default=False)
    answers = models.JSONField(default=list, blank=True)
    charts = models.JSONField(default=dict, blank=True)
    analysis_content = models.JSONField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)  # <-- Add this line

    # <-- Added field to fix the NOT NULL constraint error
    is_first_iteration = models.BooleanField(default=True)

    class Meta:
        ordering = ['-id']

    def __str__(self) -> str:
        return f"{self.name} ({self.type})"


class ApiKeys(models.Model):
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='api_keys', null=True, blank=True)
    instagram = models.CharField(max_length=128, blank=True, null=True)
    youtube = models.CharField(max_length=128, blank=True, null=True)
    flipkart = models.CharField(max_length=128, blank=True, null=True)
