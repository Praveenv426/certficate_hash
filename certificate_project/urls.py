from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse  # <- Import this

def home(request):
    return HttpResponse("Welcome to the Certificate Hash Creator. Go to /api/certificates/upload/ to upload a certificate.")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),  # <- This handles /
    path('api/certificates/', include('certificates.urls')),
]
