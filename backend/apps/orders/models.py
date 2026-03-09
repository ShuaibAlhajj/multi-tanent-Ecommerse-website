from django.db import models

from apps.common.models import TimeStampedModel


class Order(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        SHIPPED = 'shipped', 'Shipped'
        DELIVERED = 'delivered', 'Delivered'
        CANCELLED = 'cancelled', 'Cancelled'

    store = models.ForeignKey('stores.Store', on_delete=models.CASCADE, related_name='orders')
    customer = models.ForeignKey('users.Customer', on_delete=models.SET_NULL, null=True, related_name='orders')
    user = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    shipping_address = models.JSONField(default=dict, blank=True)
    billing_address = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = 'orders'
        indexes = [
            models.Index(fields=['store', 'status']),
            models.Index(fields=['store', 'created_at']),
        ]
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'Order #{self.id}'


class OrderItem(TimeStampedModel):
    store = models.ForeignKey('stores.Store', on_delete=models.CASCADE, related_name='order_items')
    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('products.Product', on_delete=models.SET_NULL, null=True, blank=True, related_name='order_items')
    product_name = models.CharField(max_length=180)
    sku = models.CharField(max_length=64)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    line_total = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        db_table = 'order_items'
        indexes = [models.Index(fields=['store', 'order'])]

    def __str__(self) -> str:
        return f'{self.product_name} x {self.quantity}'


class CartItem(TimeStampedModel):
    store = models.ForeignKey('stores.Store', on_delete=models.CASCADE, related_name='cart_items')
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='cart_items')
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE, related_name='cart_items')
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = 'cart_items'
        unique_together = [('store', 'user', 'product')]
        indexes = [models.Index(fields=['store', 'user'])]

    def __str__(self) -> str:
        return f'CartItem<{self.user_id}-{self.product_id}>'
