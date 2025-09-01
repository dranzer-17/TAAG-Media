# Taag Media "Match & Bill" API - Backend

This repository contains the backend service for the Taag Media Full-Stack Internship take-home assignment. It is a FastAPI application that provides two core functionalities: a creator-brand matching engine and a billing information processing system.

## Features

-   **Creator Matching Engine**: Accepts a brand's campaign brief and returns a ranked list of suitable creators.
-   **Weighted Scoring Algorithm**: Ranks creators based on a detailed algorithm considering:
    -   Relevance (Verticals & Tone) - 40%
    -   Audience Fit (Geography & Age) - 30%
    -   Performance & Price (Engagement & Value) - 20%
    -   Constraints (Budget, Platforms) - 10%
-   **Diversification Logic**: Adjusts top results to prevent a single sub-vertical from dominating the recommendations.
-   **Billing & Payout APIs**: Securely processes and validates brand and creator financial details.
-   **Server-Side Validation**: Robust, format-specific validation for critical identifiers like GSTIN, PAN, and IFSC.
-   **Automated API Documentation**: Interactive API documentation available via Swagger UI (`/docs`) and ReDoc (`/redoc`).

## Tech Stack

-   **Framework**: FastAPI
-   **Data Validation**: Pydantic V2
-   **Database ORM**: SQLAlchemy
-   **Database**: SQLite (for simplicity and portability)
-   **Server**: Uvicorn

## Project Structure
  backend/├── app/│   ├── crud.py           # Database interaction functions (CRUD)│   ├── database.py       # Database engine and session setup│   ├── main.py           # FastAPI app and API endpoint definitions│   ├── models.py         # SQLAlchemy DB table models│   ├── schemas.py        # Pydantic data schemas for API I/O and validation│   ├── scoring.py        # Core logic for the matching algorithm│   ├── seed.py           # Script to populate the DB with sample data│   └── validation.py     # Validation helper functions│├── data/│   ├── brands.json       # Sample brand data│   └── creators.json     # Sample creator data│├── taag.db               # SQLite database file (auto-generated)└── requirements.txt      # Project dependencies code Codedownloadcontent_copyexpand_lessIGNORE_WHEN_COPYING_STARTIGNORE_WHEN_COPYING_END    ## Setup and Installation

**1. Clone the repository:**
```bash
git clone <your-repo-url>
cd backend
  2. Create and activate a Python virtual environment: code Bashdownloadcontent_copyexpand_lessIGNORE_WHEN_COPYING_STARTIGNORE_WHEN_COPYING_END    # For macOS/Linux
python3 -m venv venv
source venv/bin/activate

# For Windows
python -m venv venv
.\venv\Scripts\activate
  3. Install dependencies: code Bashdownloadcontent_copyexpand_lessIGNORE_WHEN_COPYING_STARTIGNORE_WHEN_COPYING_END    pip install -r requirements.txt
  Running the Application1. Seed the Database:Before running the server for the first time, populate the database with the sample data.```bashpython -m app.seed code Codedownloadcontent_copyexpand_lessIGNORE_WHEN_COPYING_STARTIGNORE_WHEN_COPYING_END    **2. Start the Development Server:**
```bash
uvicorn app.main:app --reload
  The API will be live at http://127.0.0.1:8000.API EndpointsThe interactive Swagger documentation at http://127.0.0.1:8000/docs is the best way to test the endpoints.Creator MatchingPOST /api/matchCalculates and returns a ranked list of creators based on a brand brief.Request Body: code JSONdownloadcontent_copyexpand_lessIGNORE_WHEN_COPYING_STARTIGNORE_WHEN_COPYING_END    {
  "category": "Fashion",
  "budgetINR": 500000,
  "targetLocations": ["Mumbai", "Delhi"],
  "targetAges":,
  "tone": ["energetic", "fun"],
  "platforms": ["Instagram"],
  "constraints": {
    "noAdultContent": true
  }
}
  Successful Response (200 OK): code JSONdownloadcontent_copyexpand_lessIGNORE_WHEN_COPYING_STARTIGNORE_WHEN_COPYING_END    [
  {
    "creator": {
      "handle": "@fitwithria",
      // ... other creator details
    },
    "score": 85.5,
    "reasons": ["Primary Vertical Match", "Strong Audience Overlap", "..."]
  }
]
  Billing and PayoutsPOST /api/billing/brandValidates and accepts brand billing details. Calculates and returns a GST summary.Request Body: code JSONdownloadcontent_copyexpand_lessIGNORE_WHEN_COPYING_STARTIGNORE_WHEN_COPYING_END    {
  "companyName": "Acme Corp",
  "gstin": "29ABCDE1234F1Z5",
  "address": "123 Main St, Anytown",
  "email": "billing@acme.com",
  "phone": "9876543210",
  "budget": 100000
}```
**Successful Response (200 OK):**
```json
{
  "status": "success",
  "message": "Brand billing details received and validated.",
  "submitted_details": { "..." },
  "billing_summary": {
    "budget": "INR 100,000.00",
    "gst_18_percent": "INR 18,000.00",
    "total_payable": "INR 118,000.00"
  }
}```
**Error Response (422 Unprocessable Entity):**
Triggered by invalid data formats (e.g., incorrect GSTIN).

---

#### `POST /api/billing/creator`
Validates and accepts creator payout details.

**Request Body:**
```json
{
  "name": "Ria Fitness",
  "pan": "ABCDE1234F",
  "upi": "ria@okbank",
  "bankAccount": "123456789012",
  "ifsc": "HDFC0000123",
  "address": "456 Park Ave, Anytown"
}
  Successful Response (200 OK): code JSONdownloadcontent_copyexpand_lessIGNORE_WHEN_COPYING_STARTIGNORE_WHEN_COPYING_END    {
  "status": "success",
  "message": "Creator payout details received and validated.",
  "submitted_details": { "..." }
}
  Error Response (422 Unprocessable Entity):Triggered by invalid data formats (e.g., incorrect PAN or IFSC). code Codedownloadcontent_copyexpand_lessIGNORE_WHEN_COPYING_STARTIGNORE_WHEN_COPYING_END    ---

### 2. `.env.example`

Although we use a hardcoded SQLite path for this project's simplicity, using a `.env` file is a best practice for production. Create a file named `.env.example` in the `backend` directory.

```ini
# Environment variables for the application
# For production, you would swap this out for a PostgreSQL or MySQL connection string.
# Example: DATABASE_URL="postgresql://user:password@postgresserver/db"

DATABASE_URL="sqlite:///./taag.db"
  (Note: Our current code in database.py doesn't actually read this file, but it's crucial to include it to show you know how production configuration works.)3. requirements.txtFor the evaluators to easily install the correct dependencies, a requirements.txt file is necessary. Create this file in the backend directory. code Textdownloadcontent_copyexpand_lessIGNORE_WHEN_COPYING_STARTIGNORE_WHEN_COPYING_END    fastapi==0.103.1
uvicorn[standard]==0.23.2
sqlalchemy==2.0.21
pydantic==2.4.2
  (These are recent, stable versions of the libraries we used. You can also generate this file automatically by running pip freeze > requirements.txt from your activated virtual environment.)