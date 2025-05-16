from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
import hashlib

@api_view(['POST'])
@parser_classes([MultiPartParser])
def upload_certificate(request):
    file_obj = request.FILES.get('certificate')
    if not file_obj:
        return Response({'error': 'No certificate file provided'}, status=400)

    file_content = file_obj.read()
    file_hash = hashlib.sha256(file_content).hexdigest()

    return Response({'file_hash': file_hash})
