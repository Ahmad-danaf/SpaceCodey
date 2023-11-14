from django.db import models

# Create your models here.


class NASAEvent(models.Model):
    event_id = models.CharField(max_length=50)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    link = models.URLField()
    categories = models.CharField(max_length=100)
    sources = models.CharField(max_length=100)

    def __str__(self):
        return self.title