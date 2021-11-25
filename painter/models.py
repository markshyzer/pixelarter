from django.db import models

class Masterpiece(models.Model):
    art = models.JSONField()
    artist = models.CharField(max_length=10)
    flag_count = models.IntegerField(default=0)
    approved = models.BooleanField(default=False)
    like_count = models.IntegerField(default=0)
    liked_by = models.TextField(default='')

# Create your models here.
