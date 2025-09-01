# backend/app/models.py

from sqlalchemy import Column, Integer, String, Float, JSON
from .database import Base

# SQLAlchemy's JSON type is perfect for storing our dictionary and list fields.

class Creator(Base):
    __tablename__ = "creators"

    id = Column(Integer, primary_key=True, index=True)
    handle = Column(String, unique=True, index=True)
    verticals = Column(JSON)
    platforms = Column(JSON)
    audienceGeo = Column(JSON)
    audienceAge = Column(JSON)
    avgViews = Column(Integer)
    engagementRate = Column(Float)
    pastBrandCategories = Column(JSON)
    contentTone = Column(JSON)
    safetyFlags = Column(JSON)
    basePriceINR = Column(Integer)

class Brand(Base):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String)
    budgetINR = Column(Integer)
    targetLocations = Column(JSON)
    targetAges = Column(JSON)
    goals = Column(JSON)
    tone = Column(JSON)
    platforms = Column(JSON)
    constraints = Column(JSON)