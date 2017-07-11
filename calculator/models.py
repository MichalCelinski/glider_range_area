from django.db import models


class Glider(models.Model):
    name = models.CharField(max_length=16)
    glide_ratio = models.FloatField()
    best_glide_speed = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class Airdrome(models.Model):
    name = models.CharField(max_length=64)
    shortcut = models.CharField(max_length=4)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return "{} {}".format(self.shortcut, self.name)
