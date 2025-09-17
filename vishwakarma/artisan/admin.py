from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "type", "created_date", "questions_answered")
    list_filter = ("type", "questions_answered", "created_date")
    search_fields = ("name", "description")


# Register your models here.
