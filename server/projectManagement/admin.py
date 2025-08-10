from django.contrib import admin
from .models import Project, Log

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'status', 'start_date', 'end_date', 'difficulty_level')
    list_filter = ('status', 'difficulty_level', 'hook_size')
    search_fields = ('title', 'user__username', 'brand', 'material')

@admin.register(Log)
class LogAdmin(admin.ModelAdmin):
    list_display = ('user', 'project', 'date')
    list_filter = ('date', 'user')
    search_fields = ('user__username', 'project__title')
