from django.contrib import admin

from apps.payments.models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'store', 'order', 'provider', 'status', 'amount', 'paid_at')
    list_filter = ('store', 'status', 'provider')
    search_fields = ('provider_reference',)
