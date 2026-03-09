from django.shortcuts import get_object_or_404
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.response import Response

from apps.common.tenant import StoreContextMixin
from apps.orders.models import CartItem, Order
from apps.orders.serializers import (
    CartItemSerializer,
    CartMutationSerializer,
    OrderCreateSerializer,
    OrderSerializer,
)
from apps.products.models import Product


class CartViewSet(
    StoreContextMixin,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [permissions.IsAuthenticated]
    queryset = CartItem.objects.select_related('product', 'store', 'user')

    def get_queryset(self):
        return CartItem.objects.select_related('product').filter(
            store_id=self.get_store_id(),
            user=self.request.user,
        )

    def get_serializer_class(self):
        if self.action == 'create':
            return CartMutationSerializer
        return CartItemSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        store_id = self.get_store_id()
        product = get_object_or_404(
            Product,
            id=serializer.validated_data['product_id'],
            store_id=store_id,
            is_active=True,
        )

        cart_item, created = CartItem.objects.get_or_create(
            store_id=store_id,
            user=request.user,
            product=product,
            defaults={'quantity': serializer.validated_data['quantity']},
        )
        if not created:
            cart_item.quantity += serializer.validated_data['quantity']
            cart_item.save(update_fields=['quantity', 'updated_at'])

        output = CartItemSerializer(cart_item)
        return Response(output.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        quantity = int(request.data.get('quantity', instance.quantity))
        if quantity < 1:
            return Response({'detail': 'Quantity must be at least 1.'}, status=status.HTTP_400_BAD_REQUEST)

        instance.quantity = quantity
        instance.save(update_fields=['quantity', 'updated_at'])
        return Response(CartItemSerializer(instance).data)


class OrderViewSet(
    StoreContextMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Order.objects.select_related('customer', 'store', 'user').prefetch_related('items')

    def get_queryset(self):
        queryset = Order.objects.select_related('customer', 'store', 'user').prefetch_related('items').filter(
            store_id=self.get_store_id()
        )
        user = self.request.user
        if user.role in {'admin', 'staff'} or user.is_superuser:
            return queryset
        return queryset.filter(user=user)

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data,
            context={
                'store_id': self.get_store_id(),
                'request_user': request.user,
            },
        )
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
