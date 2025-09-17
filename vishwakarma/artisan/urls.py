from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('api/projects/', views.api_projects, name='api_projects'),
    path('api/projects/<int:project_id>/', views.api_project_detail, name='api_project_detail'),
]