from rest_framework import serializers

from apps.stores.models import Store


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = [
            'id',
            'name',
            'slug',
            'domain',
            'is_active',
            'settings',
            'created_at',
            'updated_at',
        ]
