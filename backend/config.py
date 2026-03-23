import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    FACEBOOK_APP_ID: str = os.getenv("FACEBOOK_APP_ID", "")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost")
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "")

    # Demo Mode - bypasses OAuth for testing
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "true").lower() == "true"

    DATABASE_URL: str = "sqlite:///./data/chord_manager.db"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_DAYS: int = 7

settings = Settings()
