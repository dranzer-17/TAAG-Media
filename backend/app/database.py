# backend/app/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Define the database URL. For SQLite, it's a file path.
# This will create a file named 'taag.db' in the main 'backend' directory.
SQLALCHEMY_DATABASE_URL = "sqlite:///./taag.db"

# Create the SQLAlchemy engine.
# The 'connect_args' is needed only for SQLite to allow multithreading.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create a SessionLocal class. Each instance of this class will be a database session.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a Base class. Our ORM models will inherit from this class.
Base = declarative_base()