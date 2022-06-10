
from django.urls import path
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from .views import CreateUserAPIView, LogoutUserAPIView, solve_vrp


urlpatterns = [
    path("solver/", solve_vrp, name="solve_vrp"),
    path("auth/login/", obtain_auth_token, name="login"),
    path("auth/register/", CreateUserAPIView.as_view(), name="register"),
    path("auth/logout/", LogoutUserAPIView.as_view(), name="logout"),
]
