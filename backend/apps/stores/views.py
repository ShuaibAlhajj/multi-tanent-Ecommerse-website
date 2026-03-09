from rest_framework import permissions, viewsets

from apps.stores.models import Store
from apps.stores.serializers import StoreSerializer


class StoreViewSet(viewsets.ModelViewSet):
    serializer_class = StoreSerializer
    queryset = Store.objects.all()

    def get_permissions(self):
        if self.action in {'list', 'retrieve'}:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Store.objects.all()
        if user.is_authenticated and user.store_id:
            return Store.objects.filter(id=user.store_id)
        return Store.objects.none()
