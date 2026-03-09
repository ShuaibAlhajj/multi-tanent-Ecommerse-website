from rest_framework import serializers

from apps.payments.models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id',
            'store',
            'order',
            'provider',
            'provider_reference',
            'status',
            'amount',
            'currency',
            'paid_at',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['store', 'created_at', 'updated_at']
