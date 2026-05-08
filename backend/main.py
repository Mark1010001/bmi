from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import pandas as pd
import numpy as np

from data.generator import generate_dataset, transform_dataset, mine_patterns
from models.classifier import (
    calculate_bmi,
    calculate_bai,
    classify_with_thresholds,
    classify_bai,
    get_age_band,
)
from config.constants import (
    STANDARD_THRESHOLDS,
    ASIAN_THRESHOLDS,
    RISK_PROBABILITY,
    BAI_CATEGORIES,
    STANDARD_GLOBAL,
)
from utils.advice import HEALTH_ADVICE

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserMetrics(BaseModel):
    gender: str
    age: int
    weight: float
    height: float
    hip_cm: float
    active_standard: str

class CalculationResult(BaseModel):
    bmi: float
    bai: float
    bmi_category: str
    bai_category: str
    global_bmi_category: str
    asian_bmi_category: str
    advice: Dict[str, Any]
    risk_data: Dict[str, Any]
    age_band: str

@app.get("/api/data")
async def get_population_data():
    raw_df = generate_dataset(50)
    df = transform_dataset(raw_df)
    patterns = mine_patterns(df)

    # Convert series/dataframes to serializable formats
    patterns_serializable = {
        "avg_bmi_by_age": patterns["avg_bmi_by_age"].to_dict(),
        "category_counts": patterns["category_counts"].to_dict(),
        "most_common_cat": patterns["most_common_cat"],
        "overall_avg_bmi": float(patterns["overall_avg_bmi"]),
        "overall_avg_bai": float(patterns["overall_avg_bai"]),
        "bmi_std": float(patterns["bmi_std"]),
        "total_users": int(patterns["total_users"]),
        "disparity_count": int(patterns["disparity_count"]),
        "agreement_count": int(patterns["agreement_count"]),
        "disparity_by_race": patterns["disparity_by_race"].to_dict(orient="records")
    }

    # Also return a sample of the data
    sample_data = df.head(15).to_dict(orient="records")

    # For charts, we might need more data or specific formats
    chart_data = df[["Age", "BMI", "BAI", "Risk_Category", "Gender", "Race"]].to_dict(orient="records")

    return {
        "patterns": patterns_serializable,
        "sample": sample_data,
        "chart_data": chart_data
    }

@app.post("/api/calculate", response_model=CalculationResult)
async def calculate_metrics(metrics: UserMetrics):
    height_m = metrics.height / 100
    active_thresholds = (
        STANDARD_THRESHOLDS if metrics.active_standard == STANDARD_GLOBAL else ASIAN_THRESHOLDS
    )

    bmi = calculate_bmi(metrics.weight, height_m)
    bai = calculate_bai(metrics.hip_cm, height_m)
    bmi_cat = classify_with_thresholds(bmi, active_thresholds)
    bai_cat = classify_bai(bai, metrics.gender)

    global_bmi_cat = classify_with_thresholds(bmi, STANDARD_THRESHOLDS)
    asian_bmi_cat = classify_with_thresholds(bmi, ASIAN_THRESHOLDS)

    age_band = get_age_band(metrics.age)
    risk_key = (age_band, bmi_cat)
    # Default risk if not found (though it should be)
    default_risk = {"prob": 0.10, "level": "Low", "color": "#639922"}

    # Pydantic/FastAPI might have trouble with tuple keys in dicts
    risk_data = next((v for k, v in RISK_PROBABILITY.items() if k == risk_key), default_risk)

    return CalculationResult(
        bmi=bmi,
        bai=bai,
        bmi_category=bmi_cat,
        bai_category=bai_cat,
        global_bmi_category=global_bmi_cat,
        asian_bmi_category=asian_bmi_cat,
        advice=HEALTH_ADVICE[bmi_cat],
        risk_data=risk_data,
        age_band=age_band
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
