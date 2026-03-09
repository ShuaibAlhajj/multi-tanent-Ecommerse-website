from rest_framework import permissions, viewsets

from apps.common.tenant import StoreScopedQuerysetMixin
from apps.payments.models import Payment
from apps.payments.serializers import PaymentSerializer


class PaymentViewSet(StoreScopedQuerysetMixin, viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Payment.objects.select_related('order', 'store')

    def perform_create(self, serializer):
        serializer.save(store_id=self.get_store_id())
