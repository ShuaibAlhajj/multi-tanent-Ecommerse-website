from django.db import models

from apps.common.models import TimeStampedModel


class Category(TimeStampedModel):
    store = models.ForeignKey('stores.Store', on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=120)
    slug = models.SlugField()
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'categories'
        unique_together = [('store', 'slug')]
        indexes = [models.Index(fields=['store', 'slug'])]
        ordering = ['name']

    def __str__(self) -> str:
        return self.name


class Product(TimeStampedModel):
    store = models.ForeignKey('stores.Store', on_delete=models.CASCADE, related_name='products')
    category = models.ForeignKey('products.Category', on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    name = models.CharField(max_length=180)
    slug = models.SlugField()
    description = models.TextField(blank=True)
    sku = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    stock_qty = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='products/', blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'products'
        unique_together = [('store', 'slug'), ('store', 'sku')]
        indexes = [
            models.Index(fields=['store', 'slug']),
            models.Index(fields=['store', 'sku']),
            models.Index(fields=['store', 'is_active']),
        ]
        ordering = ['-created_at']

    def __str__(self) -> str:
        return self.name
