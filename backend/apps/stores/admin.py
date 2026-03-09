from django.contrib import admin

from apps.stores.models import Store


@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'slug', 'domain', 'is_active')
    search_fields = ('name', 'slug', 'domain')
    list_filter = ('is_active',)
