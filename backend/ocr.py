from PIL import Image, ImageEnhance, ImageFilter
import pytesseract
import io
from fastapi import UploadFile, HTTPException
import tempfile
import os

# Supported image formats
SUPPORTED_FORMATS = {'image/jpeg', 'image/png', 'image/jpg', 'image/webp'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def preprocess_image(image: Image.Image) -> Image.Image:
    """
    Preprocess image for better OCR results.
    Steps: grayscale, contrast enhancement, thresholding, resize
    """
    # Convert to grayscale
    image = image.convert('L')

    # Enhance contrast
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(2.0)

    # Apply threshold to make text crisp (black text on white background)
    # Values below 140 become black, above become white
    image = image.point(lambda x: 0 if x < 140 else 255, '1')

    # Convert back to grayscale for better Tesseract results
    image = image.convert('L')

    # Resize to optimal DPI (300 DPI is ideal for OCR)
    # If image is too small, scale up
    width, height = image.size
    if width < 1000:
        scale_factor = 1000 / width
        new_size = (int(width * scale_factor), int(height * scale_factor))
        image = image.resize(new_size, Image.Resampling.LANCZOS)

    return image

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
            detail=f"Invalid file type. Supported formats: JPEG, PNG, WEBP"
        )

    # Read file content
    content = await file.read()

    # Validate file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: 10MB"
        )

    # Create temporary file for processing
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

        # Run Tesseract OCR
        # PSM 6 = assume uniform block of text (good for chord sheets)
        # OEM 3 = default OCR engine mode
        # lang = eng+tgl for English + Tagalog support
        custom_config = r'--oem 3 --psm 6'
        text = pytesseract.image_to_string(
            temp_file_path,
            lang='eng+tgl',
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
