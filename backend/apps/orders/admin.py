from django.contrib import admin

from apps.orders.models import CartItem, Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'store', 'customer', 'status', 'total', 'created_at')
    list_filter = ('store', 'status')
    search_fields = ('id', 'customer__email')
    inlines = [OrderItemInline]


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'store', 'user', 'product', 'quantity', 'updated_at')
    list_filter = ('store',)
