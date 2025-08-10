from django.db import models
from django.conf import settings

class Project(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='projects'
    )
    title = models.CharField(max_length=255)
    pattern_source = models.CharField(max_length=255, blank=True, null=True)
    type = models.CharField(max_length=100, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('wips', 'WIPs'),
        ('finished', 'Finished'),
        ('frogged', 'Frogged'),
        ('graveyard', 'Graveyard'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')

    # Hook size choices — common crochet hook sizes (US notation)
    HOOK_SIZE_CHOICES = [
        ('B-1', '2.25 mm'),
        ('C-2', '2.75 mm'),
        ('D-3', '3.25 mm'),
        ('E-4', '3.5 mm'),
        ('F-5', '3.75 mm'),
        ('G-6', '4.0 mm'),
        ('7', '4.5 mm'),
        ('H-8', '5.0 mm'),
        ('I-9', '5.5 mm'),
        ('J-10', '6.0 mm'),
        ('K-10.5', '6.5 mm'),
        ('L-11', '8.0 mm'),
        ('M-13', '9.0 mm'),
        ('N-15', '10.0 mm'),
        ('P-16', '11.5 mm'),
        ('Q', '15.75 mm'),
        ('S', '19.0 mm'),
    ]
    hook_size = models.CharField(max_length=10, choices=HOOK_SIZE_CHOICES, blank=True, null=True)

    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
        ('extra_hard', 'Extra Hard'),
    ]
    difficulty_level = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, blank=True, null=True)

    colors = models.JSONField(blank=True, null=True)  # store list/dict of colors
    rating = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    brand = models.CharField(max_length=100, blank=True, null=True)
    material = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.title} ({self.user.username})"

class Log(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='logs'
    )
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='logs'
    )
    date = models.DateField()

    def __str__(self):
        return f"{self.user.username} - {self.project.title} on {self.date}"
    
    class Meta:
        unique_together = ('user', 'date')
