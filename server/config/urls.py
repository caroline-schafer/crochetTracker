from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('userManagement.urls')),
    path('api/', include('projectManagement.urls')),
    path('api/', include('goalsManagement.urls')),  # ✅ Add this line
]
