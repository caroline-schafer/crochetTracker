from django.urls import path
from .views import SignupView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', TokenObtainPairView.as_view(), name='login'),       # POST: username + password
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # POST: refresh token
]
