from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, LogViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'logs', LogViewSet, basename='logs')

urlpatterns = router.urls
