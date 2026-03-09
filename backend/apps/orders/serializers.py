from decimal import Decimal

from django.db import transaction
from rest_framework import serializers

from apps.orders.models import CartItem, Order, OrderItem
from apps.products.models import Product
from apps.users.models import Customer


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    unit_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    product_image = serializers.ImageField(source='product.image', read_only=True)

    class Meta:
        model = CartItem
        fields = [
            'id',
            'store',
            'user',
            'product',
            'product_name',
            'product_image',
            'unit_price',
            'quantity',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['store', 'user', 'created_at', 'updated_at']


class CartMutationSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            'id',
            'product',
            'product_name',
            'sku',
            'unit_price',
            'quantity',
            'line_total',
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'store',
            'customer',
            'user',
            'status',
            'subtotal',
            'tax_amount',
            'total',
            'shipping_address',
            'billing_address',
            'created_at',
            'updated_at',
            'items',
        ]
        read_only_fields = [
            'store',
            'customer',
            'user',
            'status',
            'subtotal',
            'tax_amount',
            'total',
            'created_at',
            'updated_at',
            'items',
        ]


class OrderCreateItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderCreateSerializer(serializers.Serializer):
    items = OrderCreateItemSerializer(many=True)
    shipping_address = serializers.JSONField(required=False)
    billing_address = serializers.JSONField(required=False)
    tax_rate = serializers.DecimalField(max_digits=5, decimal_places=4, required=False, default=Decimal('0.0000'))

    def create(self, validated_data):
        store_id = self.context['store_id']
        request_user = self.context['request_user']

        items_payload = validated_data['items']
        product_ids = [item['product_id'] for item in items_payload]
        products = Product.objects.select_for_update().filter(
            store_id=store_id,
            is_active=True,
            id__in=product_ids,
        )
        products_map = {product.id: product for product in products}

        missing = [pid for pid in product_ids if pid not in products_map]
        if missing:
            raise serializers.ValidationError({'items': f'Products not found in store: {missing}'})

        customer = getattr(request_user, 'customer_profile', None)
        if customer is None or customer.store_id != store_id:
            customer, _ = Customer.objects.get_or_create(
                store_id=store_id,
                email=request_user.email,
                defaults={
                    'user': request_user,
                    'first_name': request_user.first_name or request_user.username,
                    'last_name': request_user.last_name,
                    'phone': request_user.phone,
                },
            )

        shipping_address = validated_data.get('shipping_address', {})
        billing_address = validated_data.get('billing_address', shipping_address)
        tax_rate = validated_data.get('tax_rate', Decimal('0.0000'))

        with transaction.atomic():
            order = Order.objects.create(
                store_id=store_id,
                customer=customer,
                user=request_user,
                shipping_address=shipping_address,
                billing_address=billing_address,
                status=Order.Status.PENDING,
            )

            subtotal = Decimal('0.00')
            for item in items_payload:
                product = products_map[item['product_id']]
                quantity = item['quantity']

                if product.stock_qty < quantity:
                    raise serializers.ValidationError(
                        {'items': f'Insufficient stock for {product.name}. Available: {product.stock_qty}'}
                    )

                product.stock_qty -= quantity
                product.save(update_fields=['stock_qty', 'updated_at'])

                line_total = Decimal(product.price) * quantity
                subtotal += line_total

                OrderItem.objects.create(
                    store_id=store_id,
                    order=order,
                    product=product,
                    product_name=product.name,
                    sku=product.sku,
                    unit_price=product.price,
                    quantity=quantity,
                    line_total=line_total,
                )

            tax_amount = (subtotal * Decimal(tax_rate)).quantize(Decimal('0.01'))
            order.subtotal = subtotal
            order.tax_amount = tax_amount
            order.total = subtotal + tax_amount
            order.save(update_fields=['subtotal', 'tax_amount', 'total', 'updated_at'])

            CartItem.objects.filter(store_id=store_id, user=request_user).delete()

        return order
