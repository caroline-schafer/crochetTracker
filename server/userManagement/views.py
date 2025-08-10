from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
import traceback

User = get_user_model()

class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print("Request data:", request.data)
        try:
            username = request.data.get("username")
            email = request.data.get("email")
            password = request.data.get("password")
            preferences = request.data.get("preferences", {})

            if not username or not email or not password:
                error_msg = "username, email, and password are required."
                print("Validation error:", error_msg)
                return Response({"error": error_msg}, status=400)

            if User.objects.filter(username=username).exists():
                error_msg = "Username already taken."
                print("Validation error:", error_msg)
                return Response({"error": error_msg}, status=400)

            user = User.objects.create_user(
                username=username,
                email=email,
                preferences=preferences,
                password=password
            )

            # Automatically return JWT tokens on signup
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "User created successfully",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=201)

        except Exception as e:
            # Print full traceback to server console
            print("Exception during signup:")
            traceback.print_exc()
            # Return the error message to client for debugging
            return Response({"error": str(e)}, status=400)
