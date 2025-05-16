from django.urls import path
from .views import upload_certificate

urlpatterns = [
    path('upload/', upload_certificate, name='upload_certificate'),
]
