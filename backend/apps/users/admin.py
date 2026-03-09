from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from apps.users.models import Customer, User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = ('id', 'email', 'username', 'store', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'store')
    search_fields = ('email', 'username')
    ordering = ('email',)


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name', 'email', 'store')
    search_fields = ('first_name', 'last_name', 'email')
    list_filter = ('store',)
