from django.db import models

from apps.common.models import TimeStampedModel


class Store(TimeStampedModel):
    name = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    domain = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    settings = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = 'stores'
        ordering = ['name']

    def __str__(self) -> str:
        return self.name
