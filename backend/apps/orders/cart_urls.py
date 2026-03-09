from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.orders.views import CartViewSet

router = DefaultRouter()
router.register('', CartViewSet, basename='cart-item')

urlpatterns = [
    path('', include(router.urls)),
]
