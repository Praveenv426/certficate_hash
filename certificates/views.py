from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
import hashlib
import pytesseract
from PIL import Image
import fitz  # PyMuPDF for PDFs

# Path to tesseract.exe (Update this if needed)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

@api_view(['POST'])
@parser_classes([MultiPartParser])
def upload_certificate(request):
    file_obj = request.FILES.get('certificate')
    if not file_obj:
        return Response({'error': 'No certificate file provided'}, status=400)

    # Calculate SHA-256 hash (unchanged)
    file_content = file_obj.read()
    file_hash = hashlib.sha256(file_content).hexdigest()

    # Rewind file pointer after reading
    file_obj.seek(0)

    extracted_text = ''
    try:
        # Check if file is PDF or image
        if file_obj.name.lower().endswith('.pdf'):
            # PDF Handling with fitz (PyMuPDF)
            doc = fitz.open(stream=file_obj.read(), filetype="pdf")
            for page in doc:
                extracted_text += page.get_text()
        else:
            # Image Handling with PIL & pytesseract
            image = Image.open(file_obj)
            extracted_text = pytesseract.image_to_string(image)

        # Basic extraction logic (same as yours)
        lines = extracted_text.split('\n')
        lines = [line.strip() for line in lines if line.strip()]

        name = ''
        certificate_name = ''
        organization_name = ''

        if len(lines) >= 3:
            organization_name = lines[0]
            certificate_name = lines[1]
            name = lines[2]

    except Exception as e:
        return Response({'error': f'OCR failed: {str(e)}'}, status=500)

    return Response({
        'file_hash': file_hash,
        'name': name,
        'certificate_name': certificate_name,
        'organization_name': organization_name,
    })
