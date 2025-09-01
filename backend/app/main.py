# backend/app/main.py

from fastapi import FastAPI, Depends, Body
from sqlalchemy.orm import Session
from typing import List
# Add the new validation import
from . import models, schemas, crud, scoring, validation
from .database import engine, SessionLocal


models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Taag Media Match & Bill API",
    description="Backend service for the Match & Bill take-home assignment.",
    version="1.0.0"
)

# --- Dependency ---
def get_db():
    """Dependency to get a database session for each request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- API Endpoints ---

@app.get("/")
def read_root():
    """A simple endpoint to confirm the API is running."""
    return {"status": "ok", "message": "Welcome to the Match & Bill API!"}

@app.post("/api/match", response_model=List[schemas.MatchedCreator])
def get_matches(brief: schemas.BrandBrief, db: Session = Depends(get_db)):
    """
    Takes a brand brief and returns a ranked list of matched creators.
    """
    # 1. Fetch all creators from the database
    all_creators = crud.get_creators(db, limit=1000) # Get all creators
    
    # 2. Score each creator against the brief
    scored_creators = [
        scoring.calculate_final_score(brief, creator) for creator in all_creators
    ]
    
    # 3. Sort creators by score in descending order
    sorted_creators = sorted(scored_creators, key=lambda c: c.score, reverse=True)

    # 4. TODO: Implement the diversification rule
    
    return sorted_creators

@app.post("/api/match", response_model=List[schemas.MatchedCreator])
def get_matches(brief: schemas.BrandBrief, db: Session = Depends(get_db)):
    """
    Takes a brand brief and returns a ranked list of matched creators.
    """
    # 1. Fetch all creators from the database
    all_creators = crud.get_creators(db, limit=1000)
    
    # 2. Score each creator against the brief
    scored_creators = [
        scoring.calculate_final_score(brief, creator) for creator in all_creators
    ]
    
    # 3. Sort creators by score in descending order
    sorted_creators = sorted(scored_creators, key=lambda c: c.score, reverse=True)

    # 4. Apply the diversification rule
    diversified_results = scoring.apply_diversification(sorted_creators)
    
    return diversified_results


@app.post("/api/billing/brand", response_model=schemas.BillingSummary)
def process_brand_billing(details: schemas.BrandBillingDetails): # <-- SIGNATURE IS NOW CLEAN
    """
    Receives and validates brand billing details and returns a summary with GST.
    """
    # Calculate GST (assuming 18%)
    gst_amount = details.budget * 0.18
    total_amount = details.budget + gst_amount
    
    return {
        "status": "success",
        "message": "Brand billing details received and validated.",
        "submitted_details": details.dict(),
        "billing_summary": {
            "budget": f"INR {details.budget:,.2f}",
            "gst_18_percent": f"INR {gst_amount:,.2f}",
            "total_payable": f"INR {total_amount:,.2f}"
        }
    }

@app.post("/api/billing/creator", response_model=schemas.BillingSummary)
def process_creator_payout(details: schemas.CreatorPayoutDetails): # <-- SIGNATURE IS NOW CLEAN
    """
    Receives and validates creator payout details.
    """
    return {
        "status": "success",
        "message": "Creator payout details received and validated.",
        "submitted_details": details.dict()
    }