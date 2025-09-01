# backend/app/crud.py

from sqlalchemy.orm import Session
from . import models, schemas

# --- Creator CRUD Functions ---

def get_creator_by_handle(db: Session, handle: str):
    """Fetch a single creator by their handle."""
    return db.query(models.Creator).filter(models.Creator.handle == handle).first()

def get_creators(db: Session, skip: int = 0, limit: int = 100):
    """Fetch all creators with pagination."""
    return db.query(models.Creator).offset(skip).limit(limit).all()

def create_creator(db: Session, creator: schemas.CreatorCreate):
    """Create a new creator in the database."""
    db_creator = models.Creator(**creator.dict())
    db.add(db_creator)
    db.commit()
    db.refresh(db_creator)
    return db_creator

# --- Brand CRUD Functions ---

def get_brand_by_name(db: Session, name: str):
    """Fetch a single brand by its name."""
    return db.query(models.Brand).filter(models.Brand.name == name).first()

def get_brands(db: Session, skip: int = 0, limit: int = 100):
    """Fetch all brands with pagination."""
    return db.query(models.Brand).offset(skip).limit(limit).all()

def create_brand(db: Session, brand: schemas.BrandCreate):
    """Create a new brand in the database."""
    db_brand = models.Brand(**brand.dict())
    db.add(db_brand)
    db.commit()
    db.refresh(db_brand)
    return db_brand