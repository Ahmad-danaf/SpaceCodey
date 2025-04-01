from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings

User = get_user_model()


class UserManagementTests(APITestCase):

    def setUp(self):
        self.api_key = settings.X_API_KEY  # From your settings.py
        self.client.credentials(HTTP_X_API_KEY=self.api_key)

        self.register_url = reverse('account:register')
        self.login_url = reverse('account:token_obtain_pair')
        self.logout_url = reverse('account:logout')
        self.resend_url = reverse('account:resend_verification')

        self.user_data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'TestPass123',
        }

    def create_unverified_user(self):
        user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='TestPass123',
            is_active=True,
            email_verified=False
        )
        return user

    def create_verified_user(self):
        user = User.objects.create_user(
            username='verifieduser',
            email='verified@example.com',
            password='TestPass123',
            is_active=True,
            email_verified=True
        )
        return user

    def test_register_user(self):
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email='testuser@example.com').exists())
        user = User.objects.get(email='testuser@example.com')
        self.assertFalse(user.is_active)
        self.assertFalse(user.email_verified)

    def test_login_unverified_user(self):
        self.create_unverified_user()
        response = self.client.post(self.login_url, {
            'username': 'testuser',
            'password': 'TestPass123',
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('Email not verified', response.json()['detail'])

    def test_login_verified_user(self):
        self.create_verified_user()
        response = self.client.post(self.login_url, {
            'username': 'verifieduser',
            'password': 'TestPass123',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_logout(self):
        # Create and log in a verified user
        user = self.create_verified_user()
        
        # Perform login to get real JWT tokens
        login_response = self.client.post(self.login_url, {
            'username': 'verifieduser',
            'password': 'TestPass123'
        }, HTTP_X_API_KEY=self.api_key)

        self.assertEqual(login_response.status_code, status.HTTP_200_OK)

        refresh_token = login_response.data['refresh']
        access_token = login_response.data['access']

        # Set both Bearer and API key headers
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {access_token}',
            HTTP_X_API_KEY=self.api_key
        )

        # Attempt logout
        response = self.client.post(self.logout_url, {'refresh': refresh_token})
        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)


    def test_resend_verification(self):
        self.create_unverified_user()
        response = self.client.post(self.resend_url, {
            'email': 'testuser@example.com'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Verification email has been resent', response.data['message'])

    def test_resend_verification_already_verified(self):
        self.create_verified_user()
        response = self.client.post(self.resend_url, {
            'email': 'verified@example.com'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('already verified', response.data['message'])

    def test_email_verification_link(self):
        user = self.create_unverified_user()
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        url = reverse('account:activate', kwargs={'uidb64': uid, 'token': token})

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)  # Redirect to home
        user.refresh_from_db()
        self.assertTrue(user.email_verified)
        self.assertTrue(user.is_active)
