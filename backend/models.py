from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    provider = Column(String, nullable=False)  # 'google' or 'facebook'
    provider_user_id = Column(String, nullable=False, index=True)
    role = Column(String, nullable=False, default="pending")  # 'pending', 'viewer', 'admin'
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    songs = relationship("Song", back_populates="uploaded_by")

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "provider": self.provider,
            "role": self.role,
            "avatar_url": self.avatar_url,
            "created_at": self.created_at.isoformat()
        }

class Song(Base):
    __tablename__ = "songs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    chords = Column(Text, nullable=False)
    original_key = Column(String, nullable=False)
    language = Column(String, nullable=False)  # 'Tagalog' or 'English'
    category = Column(String, nullable=False)  # 'Praise' or 'Worship'
    uploaded_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    uploaded_by = relationship("User", back_populates="songs")

    def to_dict(self, include_uploader=True):
        result = {
            "id": self.id,
            "title": self.title,
            "chords": self.chords,
            "original_key": self.original_key,
            "language": self.language,
            "category": self.category,
            "created_at": self.created_at.isoformat()
        }
        if include_uploader and self.uploaded_by:
            result["uploaded_by"] = {
                "id": self.uploaded_by.id,
                "name": self.uploaded_by.name
            }
        return result
