from rest_framework.exceptions import ValidationError


class StoreContextMixin:
    def get_store_id(self) -> int:
        header_store = self.request.headers.get('X-Store-ID')
        if header_store:
            try:
                return int(header_store)
            except ValueError as exc:
                raise ValidationError('Invalid X-Store-ID header. Expected integer store id.') from exc

        user = self.request.user
        if user and user.is_authenticated and getattr(user, 'store_id', None):
            return user.store_id

        from apps.stores.models import Store

        default_store = Store.objects.filter(is_active=True).order_by('id').first()
        if default_store:
            return default_store.id

        raise ValidationError('Store context is required. Create a store or pass X-Store-ID header.')


class StoreScopedQuerysetMixin(StoreContextMixin):
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(store_id=self.get_store_id())
