from django.db import models
from django.conf import settings

class Streak(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='streaks')
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return f"{self.user.username}: {self.start_date} → {self.end_date}"

    @property
    def length(self):
        return (self.end_date - self.start_date).days + 1
