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
    description = models.TextField(blank=True)
    created_date = models.DateField(auto_now_add=True)
    questions_answered = models.BooleanField(default=False)
    answers = models.JSONField(default=list, blank=True)
    charts = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-id']

    def __str__(self) -> str:
        return f"{self.name} ({self.type})"

