# backend/app/schemas.py

from typing import List, Dict, Union
import re
from pydantic import BaseModel, Field, EmailStr, field_validator
from . import validation

class CreatorBase(BaseModel):
    handle: str
    verticals: List[str]
    platforms: List[str]
    audienceGeo: Dict[str, float]
    audienceAge: Dict[str, float]
    avgViews: int
    engagementRate: float
    pastBrandCategories: List[str]
    contentTone: List[str]
    safetyFlags: Dict[str, bool]
    basePriceINR: int

class CreatorCreate(CreatorBase):
    pass

class Creator(CreatorBase):
    id: int

    class Config:
        from_attributes = True # <-- CHANGE THIS LINE

# --- Brand Schemas ---

class BrandBase(BaseModel):
    name: str
    category: str
    budgetINR: int
    targetLocations: List[str]
    targetAges: List[int]
    goals: List[str]
    tone: List[str]
    platforms: List[str]
    constraints: Dict[str, Union[bool, int]]

class BrandCreate(BrandBase):
    pass

class Brand(BrandBase):
    id: int

    class Config:
        from_attributes = True # <-- AND CHANGE THIS LINE

class BrandBrief(BaseModel):
    # This schema defines the data we expect to receive in the POST request.
    # It's similar to a brand, but tailored for a campaign brief.
    category: str
    budgetINR: int
    targetLocations: List[str]
    targetAges: List[int]
    tone: List[str]
    platforms: List[str]
    constraints: Dict[str, Union[bool, int]] = Field(default_factory=dict) # Optional constraints


class MatchedCreator(BaseModel):
    # This schema defines the structure of each item in our response.
    # It includes the full creator details, plus the score and reasons.
    creator: Creator # Nest the original Creator schema
    score: float = Field(..., ge=0, le=100) # Score must be between 0 and 100
    reasons: List[str]
    
    
    

class BrandBillingDetails(BaseModel):
    companyName: str
    gstin: str
    address: str
    email: EmailStr
    phone: str
    budget: float = Field(..., gt=0)

    # Change the decorator to @field_validator
    @field_validator('gstin')
    @classmethod # Recommended to add @classmethod for clarity
    def gstin_must_be_valid(cls, v: str) -> str:
        return validation.validate_gstin(v)

class CreatorPayoutDetails(BaseModel):
    name: str
    pan: str
    upi: str
    bankAccount: str
    ifsc: str
    address: str

    # Change the decorator to @field_validator
    @field_validator('pan')
    @classmethod
    def pan_must_be_valid(cls, v: str) -> str:
        return validation.validate_pan(v)

    # Change the decorator to @field_validator
    @field_validator('ifsc')
    @classmethod
    def ifsc_must_be_valid(cls, v: str) -> str:
        return validation.validate_ifsc(v)
    
class BillingSummary(BaseModel):
    # (This schema remains the same)
    status: str
    message: str
    submitted_details: dict
    billing_summary: dict = None