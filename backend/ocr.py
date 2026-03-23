from PIL import Image, ImageEnhance, ImageFilter
import pytesseract
import io
from fastapi import UploadFile, HTTPException
import tempfile
import os
from typing import Optional

# Google Vision API (optional, for better handwriting recognition)
try:
    from google.cloud import vision
    GOOGLE_VISION_AVAILABLE = True
except ImportError:
    GOOGLE_VISION_AVAILABLE = False

# Word document support
try:
    from docx import Document
    DOCX_AVAILABLE = True
except ImportError:
    DOCX_AVAILABLE = False

# Supported formats
SUPPORTED_IMAGE_FORMATS = {'image/jpeg', 'image/png', 'image/jpg', 'image/webp'}
SUPPORTED_DOC_FORMATS = {
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',  # .docx
    'application/msword'  # .doc
}
SUPPORTED_FORMATS = SUPPORTED_IMAGE_FORMATS | SUPPORTED_DOC_FORMATS
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def preprocess_image(image: Image.Image) -> Image.Image:
    """
    Enhanced preprocessing for better OCR accuracy.
    Steps: grayscale, sharpening, contrast, adaptive threshold, denoise, resize
    """
    # Convert to grayscale
    image = image.convert('L')

    # Resize first for better processing (if too small)
    width, height = image.size
    if width < 1500:
        scale_factor = 1500 / width
        new_size = (int(width * scale_factor), int(height * scale_factor))
        image = image.resize(new_size, Image.Resampling.LANCZOS)

    # Sharpen image to make text clearer
    image = image.filter(ImageFilter.SHARPEN)

    # Enhance contrast more aggressively
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(2.5)

    # Enhance brightness
    enhancer = ImageEnhance.Brightness(image)
    image = enhancer.enhance(1.2)

    # Apply adaptive threshold for better text detection
    # This works better than simple threshold for varied lighting
    image = image.point(lambda x: 0 if x < 130 else 255, '1')
    image = image.convert('L')

    # Slight denoise to clean up artifacts
    image = image.filter(ImageFilter.MedianFilter(size=3))

    return image

def extract_text_from_docx(content: bytes) -> Optional[str]:
    """
    Extract text from Word document (.docx).
    Returns None if not available or fails.
    """
    if not DOCX_AVAILABLE:
        return None

    try:
        # Load document from bytes
        doc = Document(io.BytesIO(content))

        # Extract all paragraphs
        text_lines = []
        for paragraph in doc.paragraphs:
            text = paragraph.text.strip()
            if text:  # Skip empty paragraphs
                text_lines.append(text)

        return '\n'.join(text_lines) if text_lines else None

    except Exception as e:
        print(f"Word document extraction error: {str(e)}")
        return None

def extract_text_with_google_vision(image_content: bytes) -> Optional[str]:
    """
    Extract text using Google Cloud Vision API (better for handwriting).
    Returns None if not configured or fails.
    """
    if not GOOGLE_VISION_AVAILABLE:
        return None

    try:
        # Initialize Vision API client
        client = vision.ImageAnnotatorClient()

        # Create image object
        image = vision.Image(content=image_content)

        # Perform document text detection (best for structured documents)
        response = client.document_text_detection(image=image)

        if response.error.message:
            raise Exception(response.error.message)

        # Extract text
        text = response.full_text_annotation.text if response.full_text_annotation else ""

        return text.strip() if text else None

    except Exception as e:
        # If Google Vision fails, return None to fall back to Tesseract
        print(f"Google Vision API error: {str(e)}")
        return None

async def extract_text_from_image(file: UploadFile) -> str:
    """
    Extract text from uploaded image using Tesseract OCR.

    Args:
        file: Uploaded image file

    Returns:
        Extracted text

    Raises:
        HTTPException: If file is invalid or OCR fails
    """
    # Validate file type
    if file.content_type not in SUPPORTED_FORMATS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Supported: JPEG, PNG, WEBP, DOCX"
        )

    # Read file content
    content = await file.read()

    # Validate file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: 10MB"
        )

    # Handle Word documents
    if file.content_type in SUPPORTED_DOC_FORMATS:
        docx_text = extract_text_from_docx(content)
        if docx_text:
            return docx_text
        else:
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from Word document"
            )

    # For images: Try Google Vision API first (better for handwriting)
    google_text = extract_text_with_google_vision(content)
    if google_text:
        # Normalize line breaks
        google_text = google_text.replace('\r\n', '\n').replace('\r', '\n')

        # Remove excessive blank lines
        while '\n\n\n' in google_text:
            google_text = google_text.replace('\n\n\n', '\n\n')

        return google_text

    # Fallback to Tesseract OCR
    temp_file = None
    try:
        # Load image
        image = Image.open(io.BytesIO(content))

        # Preprocess image
        processed_image = preprocess_image(image)

        # Save to temporary file (Tesseract works better with file paths)
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp_file:
            processed_image.save(temp_file.name, 'PNG')
            temp_file_path = temp_file.name

        # Run Tesseract OCR with optimized settings
        # PSM 6 = assume uniform block of text
        # OEM 1 = neural nets LSTM engine only (more accurate)
        # Whitelist common chord characters for better accuracy
        custom_config = r'--oem 1 --psm 6 -c tessedit_char_whitelist=ABCDEFGabcdefg#bmajinsu0123456789/-:()[]|. '
        text = pytesseract.image_to_string(
            temp_file_path,
            lang='eng',
            config=custom_config
        )

        # Post-process text
        text = text.strip()

        # Normalize line breaks
        text = text.replace('\r\n', '\n').replace('\r', '\n')

        # Remove excessive blank lines (more than 2 consecutive)
        while '\n\n\n' in text:
            text = text.replace('\n\n\n', '\n\n')

        if not text:
            raise HTTPException(
                status_code=400,
                detail="No text detected in image. Please try a clearer image."
            )

        return text

    except Image.UnidentifiedImageError:
        raise HTTPException(
            status_code=400,
            detail="Invalid or corrupted image file"
        )
    except Exception as e:
        # Generic OCR failure
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=500,
            detail=f"OCR processing failed. Please try a clearer image with better lighting."
        )
    finally:
        # Clean up temporary file
        if temp_file and os.path.exists(temp_file_path):
            try:
                os.unlink(temp_file_path)
            except:
                pass  # Best effort cleanup
