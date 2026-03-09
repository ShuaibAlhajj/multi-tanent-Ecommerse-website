from rest_framework import serializers

from apps.products.models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            'id',
            'store',
            'name',
            'slug',
            'description',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['store', 'created_at', 'updated_at']


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'store',
            'category',
            'category_name',
            'name',
            'slug',
            'description',
            'sku',
            'price',
            'currency',
            'stock_qty',
            'image',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['store', 'created_at', 'updated_at']
