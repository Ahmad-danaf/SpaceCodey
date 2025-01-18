from rest_framework.views import APIView
from rest_framework import status, permissions
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.tokens import default_token_generator
from django.shortcuts import get_object_or_404
from django.utils.http import urlsafe_base64_decode
from .models import CustomUser, Profile
from .serializers import UserSerializer, ProfileSerializer, LoginSerializer
from .utils.send_verification_email import send_verification_email
from django.http import JsonResponse


class RegisterAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_active = False  # Deactivate account until email is confirmed
            user.save()

            # Send verification email
            send_verification_email(request, user)

            return JsonResponse(
                {"message": "Please confirm your email address to complete the registration."},
                status=status.HTTP_201_CREATED,
            )
        return JsonResponse({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data.get("username")
            password = serializer.validated_data.get("password")
            user = authenticate(username=username, password=password)

            if user:
                if not user.is_active:
                    return JsonResponse(
                        {"error": "Your account is inactive. Please contact support."},
                        status=status.HTTP_401_UNAUTHORIZED,
                    )

                if not user.email_verified:  # Check email verification
                    return JsonResponse(
                        {"error": "Please verify your email address."},
                        status=status.HTTP_401_UNAUTHORIZED,
                    )

                login(request, user)
                return JsonResponse({"message": f"Welcome back, {user.username}!"}, status=status.HTTP_200_OK)

            return JsonResponse({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

        return JsonResponse({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class LogoutAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return JsonResponse({"message": "You have successfully logged out."}, status=status.HTTP_200_OK)


class ActivateAccountAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            return JsonResponse(
                {"error": "Invalid activation link or user does not exist."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.email_verified = True
            user.save()
            login(request, user)
            return JsonResponse({"message": "Your account has been activated successfully."}, status=status.HTTP_200_OK)

        return JsonResponse({"error": "The activation link is invalid or expired."}, status=status.HTTP_400_BAD_REQUEST)


class ProfileAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        serializer = ProfileSerializer(profile)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        return JsonResponse({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class ResendVerificationEmailAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return JsonResponse({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(email=email)

            if user.email_verified:
                return JsonResponse({"message": "Your email is already verified."}, status=status.HTTP_200_OK)

            # Resend verification email
            send_verification_email(request, user)
            return JsonResponse({"message": "Verification email has been resent."}, status=status.HTTP_200_OK)

        except CustomUser.DoesNotExist:
            return JsonResponse({"error": "No account found with this email address."}, status=status.HTTP_404_NOT_FOUND)
