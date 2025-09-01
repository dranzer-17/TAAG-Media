# backend/app/seed.py

import json
# Import the engine and models
from .database import SessionLocal, engine
from . import crud, schemas, models # Add 'models' here

def seed_data():
    """Populates the database with initial data from JSON files."""
    
    # Add this line to create tables if they don't exist
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # --- Seed Creators ---
        print("Seeding creators...")
        with open('data/creators.json', 'r') as f:
            creators_data = json.load(f)
            for creator_data in creators_data:
                # The rest of the file remains exactly the same...
                db_creator = crud.get_creator_by_handle(db, handle=creator_data["handle"])
                if not db_creator:
                    creator = schemas.CreatorCreate(**creator_data)
                    crud.create_creator(db, creator=creator)
                    print(f"  Added creator: {creator.handle}")
                else:
                    print(f"  Skipped existing creator: {creator_data['handle']}")
        
        print("Creators seeded successfully.")

        # --- Seed Brands ---
        print("\nSeeding brands...")
        with open('data/brands.json', 'r') as f:
            brands_data = json.load(f)
            for brand_data in brands_data:
                db_brand = crud.get_brand_by_name(db, name=brand_data["name"])
                if not db_brand:
                    brand = schemas.BrandCreate(**brand_data)
                    crud.create_brand(db, brand=brand)
                    print(f"  Added brand: {brand.name}")
                else:
                    print(f"  Skipped existing brand: {brand_data['name']}")
        
        print("Brands seeded successfully.")

    finally:
        db.close()

if __name__ == "__main__":
    print("Running database seeder...")
    seed_data()
    print("Database seeding complete.")