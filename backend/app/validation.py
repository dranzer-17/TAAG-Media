# backend/app/validation.py

import re

# NOTE: We are no longer raising HTTPException here. We will raise ValueError.
# This makes the functions more reusable.

def validate_gstin(gstin: str) -> str:
    """Validates the format of a GSTIN. Returns the value if valid, else raises ValueError."""
    pattern = re.compile(r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")
    if not pattern.match(gstin):
        raise ValueError(f"Invalid GSTIN format for '{gstin}'")
    return gstin

def validate_pan(pan: str) -> str:
    """Validates the format of a PAN card number. Returns the value if valid, else raises ValueError."""
    pattern = re.compile(r"^[A-Z]{5}[0-9]{4}[A-Z]{1}$")
    if not pattern.match(pan):
        raise ValueError(f"Invalid PAN format for '{pan}'")
    return pan

def validate_ifsc(ifsc: str) -> str:
    """Validates the format of an IFSC code. Returns the value if valid, else raises ValueError."""
    pattern = re.compile(r"^[A-Z]{4}0[A-Z0-9]{6}$")
    if not pattern.match(ifsc):
        raise ValueError(f"Invalid IFSC format for '{ifsc}'")
    return ifsc