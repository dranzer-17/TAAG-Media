# backend/app/scoring.py

from . import schemas, models
from typing import List, Tuple

# --- Configuration for Scoring Weights ---
# These match the evaluation criteria.
WEIGHTS = {
    "relevance": 0.40,
    "audience": 0.30,
    "performance": 0.20,
    "constraints": 0.10,
}

def calculate_relevance_score(brief: schemas.BrandBrief, creator: models.Creator) -> Tuple[float, List[str]]:
    """Calculates score based on category/vertical and content tone overlap."""
    score = 0
    reasons = []
    
    # 1. Category/Vertical Match (70% of relevance score)
    # Check if the brand category is in the creator's verticals or past work.
    category_match = False
    if brief.category.lower() in [v.lower() for v in creator.verticals]:
        score += 70
        category_match = True
        reasons.append("Primary Vertical Match")
    elif brief.category.lower() in [p.lower() for p in creator.pastBrandCategories]:
        score += 50 # Lower score for past work match
        category_match = True
        reasons.append("Past Work Match")

    # 2. Tone Match (30% of relevance score)
    # Find how many of the brand's desired tones match the creator's content tones.
    tone_matches = set(t.lower() for t in brief.tone) & set(c.lower() for c in creator.contentTone)
    if tone_matches:
        tone_score = (len(tone_matches) / len(brief.tone)) * 30
        score += tone_score
        reasons.append(f"Tone Fit ({len(tone_matches)}/{len(brief.tone)})")
        
    return score, reasons

def calculate_audience_score(brief: schemas.BrandBrief, creator: models.Creator) -> Tuple[float, List[str]]:
    """Calculates score based on audience geography and age overlap."""
    score = 0
    reasons = []
    
    # 1. Geographic Match (50% of audience score)
    geo_overlap = 0
    for loc in brief.targetLocations:
        geo_overlap += creator.audienceGeo.get(loc, 0) # Sum up the percentages for target locations
    
    if geo_overlap > 0:
        # We scale the score. 100% overlap = 50 points. 50% overlap = 25 points.
        geo_score = min(geo_overlap, 1.0) * 50
        score += geo_score
        reasons.append(f"Geographic Overlap ({geo_overlap:.0%})")
        
    # 2. Age Match (50% of audience score)
    # This is a simplified age range overlap calculation.
    brand_min_age, brand_max_age = brief.targetAges
    age_overlap_percentage = 0
    for age_range, percentage in creator.audienceAge.items():
        try:
            creator_min_age, creator_max_age = map(int, age_range.split('-'))
            # Find the overlapping range
            overlap_min = max(brand_min_age, creator_min_age)
            overlap_max = min(brand_max_age, creator_max_age)
            
            if overlap_max > overlap_min:
                age_overlap_percentage += percentage # Add the creator's audience percentage if there's an overlap
        except ValueError:
            continue # Skip if age range format is unexpected
    
    if age_overlap_percentage > 0:
        age_score = min(age_overlap_percentage, 1.0) * 50
        score += age_score
        reasons.append(f"Target Age Match ({age_overlap_percentage:.0%})")
        
    return score, reasons

def calculate_performance_price_score(brief: schemas.BrandBrief, creator: models.Creator) -> Tuple[float, List[str]]:
    """Calculates score based on engagement and value for money."""
    score = 0
    reasons = []
    
    # 1. Engagement Rate (50% of performance score)
    # Simple scale: >5% is excellent (50pts), >3% is good (30pts)
    if creator.engagementRate > 0.05:
        score += 50
        reasons.append(f"High ER ({creator.engagementRate:.1%})")
    elif creator.engagementRate > 0.03:
        score += 30
        reasons.append(f"Good ER ({creator.engagementRate:.1%})")
        
    # 2. Value for Money (50% of performance score)
    # We use a simplified "Cost per Average View" metric. Lower is better.
    # Let's set a baseline: 1 Rupee per view is average (25pts), <0.5 is great (50pts).
    cost_per_view = creator.basePriceINR / creator.avgViews if creator.avgViews > 0 else float('inf')
    if cost_per_view < 0.5:
        score += 50
        reasons.append("Excellent Value")
    elif cost_per_view < 1.0:
        score += 25
        reasons.append("Good Value")
        
    return score, reasons

def check_constraints(brief: schemas.BrandBrief, creator: models.Creator) -> Tuple[float, List[str]]:
    """Checks hard constraints. Returns 100 if all pass, 0 if any fail."""
    reasons = []
    
    # 1. Budget Constraint
    if creator.basePriceINR > brief.budgetINR:
        return 0, ["Price over budget"]
        
    # 2. Platform Constraint
    platform_match = set(brief.platforms) & set(creator.platforms)
    if not platform_match:
        return 0, ["Does not use required platforms"]
        
    # 3. Safety/Content Constraint
    if brief.constraints.get("noAdultContent") and creator.safetyFlags.get("adult"):
        return 0, ["Violates content safety rules"]
    
    reasons.append("Within Budget")
    reasons.append(f"On Platform ({', '.join(platform_match)})")
    return 100, reasons

def calculate_final_score(brief: schemas.BrandBrief, creator: models.Creator) -> schemas.MatchedCreator:
    """Calculates the final weighted score for a single creator."""
    
    # First, check hard constraints. If they fail, the creator is disqualified (score 0).
    constraints_score, constraints_reasons = check_constraints(brief, creator)
    if constraints_score == 0:
        return schemas.MatchedCreator(
            creator=creator, 
            score=0,
            reasons=constraints_reasons
        )
    
    # Calculate scores for each category (each is out of 100)
    relevance_score, relevance_reasons = calculate_relevance_score(brief, creator)
    audience_score, audience_reasons = calculate_audience_score(brief, creator)
    performance_score, performance_reasons = calculate_performance_price_score(brief, creator)
    
    # Calculate the final weighted score
    final_score = (
        (relevance_score * WEIGHTS["relevance"]) +
        (audience_score * WEIGHTS["audience"]) +
        (performance_score * WEIGHTS["performance"]) +
        (constraints_score * WEIGHTS["constraints"])
    )
    
    # Combine all the reasons for a clear summary
    all_reasons = (
        relevance_reasons + 
        audience_reasons + 
        performance_reasons + 
        constraints_reasons
    )
    
    # Format the creator data using the Pydantic model for consistency
    creator_schema = schemas.Creator.from_orm(creator)

    return schemas.MatchedCreator(
        creator=creator_schema,
        score=round(final_score, 2),
        reasons=list(set(all_reasons)) # Use set to remove duplicate reasons
    )

def apply_diversification(ranked_creators: List[schemas.MatchedCreator]) -> List[schemas.MatchedCreator]:
    """
    Checks if the top 3 QUALIFIED creators are from the same primary vertical 
    and swaps the 3rd one if a suitable replacement is found.
    """
    # Filter out disqualified creators (score of 0)
    qualified_creators = [c for c in ranked_creators if c.score > 0]
    
    # Rule only applies if there are at least 3 qualified results.
    if len(qualified_creators) < 3:
        return ranked_creators # Return the original list, including the 0-score ones

    top_three = qualified_creators[:3]

    # (The rest of the function remains the same)
    primary_verticals = [
        c.creator.verticals[0] for c in top_three if c.creator.verticals
    ]

    if len(primary_verticals) == 3 and len(set(primary_verticals)) == 1:
        dominating_vertical = primary_verticals[0]
        print(f"INFO: Top 3 dominated by '{dominating_vertical}'. Applying diversification.")

        # Search for a replacement starting from the 4th qualified creator.
        replacement_found = False
        for i in range(3, len(qualified_creators)):
            candidate = qualified_creators[i]
            
            # A good candidate must have a different primary vertical.
            if not candidate.creator.verticals or candidate.creator.verticals[0] != dominating_vertical:
                
                # We need to find the original index of the items we're swapping
                # in the main ranked_creators list.
                original_third_place_index = ranked_creators.index(top_three[2])
                candidate_index = ranked_creators.index(candidate)

                print(f"INFO: Found replacement: {candidate.creator.handle}. Swapping with {ranked_creators[original_third_place_index].creator.handle}.")
                
                # Swap the candidate with the original 3rd place creator.
                ranked_creators[original_third_place_index], ranked_creators[candidate_index] = \
                    ranked_creators[candidate_index], ranked_creators[original_third_place_index]
                
                ranked_creators[original_third_place_index].reasons.append("Promoted for Diversity")
                replacement_found = True
                break

        if not replacement_found:
            print("INFO: Diversification needed, but no suitable replacement found.")

    return ranked_creators