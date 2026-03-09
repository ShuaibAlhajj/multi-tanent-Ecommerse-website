from rest_framework import permissions, viewsets

from apps.common.tenant import StoreContextMixin, StoreScopedQuerysetMixin
from apps.products.models import Category, Product
from apps.products.serializers import CategorySerializer, ProductSerializer


class IsAuthenticatedOrReadOnlyCreate(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated)


class CategoryViewSet(StoreScopedQuerysetMixin, viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnlyCreate]
    queryset = Category.objects.select_related('store')

    def perform_create(self, serializer):
        serializer.save(store_id=self.get_store_id())


class ProductViewSet(StoreScopedQuerysetMixin, viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnlyCreate]
    queryset = Product.objects.select_related('category', 'store')

    def get_queryset(self):
        queryset = super().get_queryset()
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        active = self.request.query_params.get('active')
        if active in {'1', 'true', 'True'}:
            queryset = queryset.filter(is_active=True)
        return queryset

    def perform_create(self, serializer):
        serializer.save(store_id=self.get_store_id())
