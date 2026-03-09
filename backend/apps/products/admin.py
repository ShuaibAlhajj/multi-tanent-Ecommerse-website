from django.contrib import admin

from apps.products.models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'store', 'is_active')
    search_fields = ('name', 'slug')
    list_filter = ('store', 'is_active')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'store', 'category', 'price', 'stock_qty', 'is_active')
    search_fields = ('name', 'slug', 'sku')
    list_filter = ('store', 'category', 'is_active')
