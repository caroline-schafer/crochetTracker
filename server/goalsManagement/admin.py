from django.contrib import admin
from .models import Streak

# Register your models here.
@admin.register(Streak)
class StreakAdmin(admin.ModelAdmin):
    list_display = ('user', 'start_date', 'end_date', 'length')
