from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Tip, Article
from .serializers import TipSerializer, ArticleSerializer
from django.core.mail import send_mail
from django.conf import settings
from .utils.sessionhub import sessionhub_request
from rest_framework.permissions import AllowAny

class TipsListAPIView(APIView):
    """
    API endpoint to list all tips.
    """
    permission_classes = [AllowAny]
    def get(self, request):
        tips = Tip.objects.all().order_by('-created_at')
        serializer = TipSerializer(tips, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TipDetailAPIView(APIView):
    """
    API endpoint to retrieve a specific tip by its ID.
    """
    permission_classes = [AllowAny]
    def get(self, request, pk):
        tip = get_object_or_404(Tip, pk=pk)
        serializer = TipSerializer(tip)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ArticlesListAPIView(APIView):
    """
    API endpoint to list all articles.
    """
    permission_classes = [AllowAny]
    def get(self, request):
        articles = Article.objects.all().order_by('-created_at')
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ArticleDetailAPIView(APIView):
    """
    API endpoint to retrieve a specific article by its ID.
    """
    permission_classes = [AllowAny]
    def get(self, request, pk):
        article = get_object_or_404(Article, pk=pk)
        serializer = ArticleSerializer(article)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ContactUsAPIView(APIView):
    """
    API endpoint to handle 'Contact Us' form submissions.
    """
    permission_classes = [AllowAny]
    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        subject = request.data.get('subject')
        message = request.data.get('message')

        if not all([name, email, subject, message]):
            return Response(
                {"error": "All fields (name, email, subject, message) are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Construct the email message
        full_message = f"Message from {name} ({email}):\n\n{message}"

        try:
            # Send the email
            send_mail(
                subject,
                full_message,
                settings.DEFAULT_FROM_EMAIL,
                [settings.CONTACT_EMAIL],
            )
            return Response({"success": "Your message has been sent successfully!"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": f"An error occurred while sending the email: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

############### SessionHub API endpoints ####################


class SessionListAPIView(APIView):
    """
    API endpoint to list all sessions for a user.
    """
    permission_classes = [AllowAny]
    def get(self, request):
        user_id = request.headers.get('User-Id')  # Extract User ID from headers
        if not user_id:
            return Response({"error": "User-Id header is required"}, status=status.HTTP_400_BAD_REQUEST)

        sessions = sessionhub_request('GET', data={'userId': user_id})

        if sessions:
            for session in sessions:
                session['id'] = session.pop('_id', None)  # Rename `_id` to `id` if it exists

        return Response(sessions, status=status.HTTP_200_OK)


class AddSessionAPIView(APIView):
    """
    API endpoint to add a new session.
    """
    permission_classes = [AllowAny]
    def post(self, request):
        user_id = request.headers.get('User-Id')  # Extract User ID from headers
        if not user_id:
            return Response({"error": "User-Id header is required"}, status=status.HTTP_400_BAD_REQUEST)

        session_data = {
            'userId': user_id,
            'date': request.data.get('date'),
            'location': request.data.get('location'),
            'notes': request.data.get('notes'),
            'sessionType': 'log',
            'status': 'upcoming',
        }

        response = sessionhub_request('POST', data=session_data)
        if response:
            return Response({"message": "Session added successfully"}, status=status.HTTP_201_CREATED)
        return Response({"error": "Failed to add session"}, status=status.HTTP_400_BAD_REQUEST)


class EditSessionAPIView(APIView):
    """
    API endpoint to edit an existing session.
    """
    permission_classes = [AllowAny]
    def put(self, request, session_id):
        user_id = request.headers.get('User-Id')  # Extract User ID from headers
        if not user_id:
            return Response({"error": "User-Id header is required"}, status=status.HTTP_400_BAD_REQUEST)

        updated_data = {
            'userId': user_id,
            'date': request.data.get('date'),
            'location': request.data.get('location'),
            'notes': request.data.get('notes'),
            'status': request.data.get('status'),
        }

        response = sessionhub_request('PUT', f'{session_id}', data=updated_data)
        if response:
            return Response({"message": "Session updated successfully"}, status=status.HTTP_200_OK)
        return Response({"error": "Failed to update session"}, status=status.HTTP_400_BAD_REQUEST)


class DeleteSessionAPIView(APIView):
    """
    API endpoint to delete a session.
    """
    permission_classes = [AllowAny]
    def delete(self, request, session_id):
        user_id = request.headers.get('User-Id')  # Extract User ID from headers
        if not user_id:
            return Response({"error": "User-Id header is required"}, status=status.HTTP_400_BAD_REQUEST)

        response = sessionhub_request('DELETE', f'{session_id}', data={'userId': user_id})
        if response and response.get('message') == 'Session deleted successfully':
            return Response({"message": "Session deleted successfully"}, status=status.HTTP_200_OK)
        return Response({"error": "Failed to delete session"}, status=status.HTTP_400_BAD_REQUEST)