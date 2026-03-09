from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.stores.views import StoreViewSet

router = DefaultRouter()
router.register('', StoreViewSet, basename='store')

urlpatterns = [
    path('', include(router.urls)),
]
