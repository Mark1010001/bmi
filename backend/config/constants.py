"""
config/constants.py
═══════════════════
All threshold tables, color maps, race options, risk probability table,
and BAI category ranges used throughout the BMI Health Risk Classifier.
"""

# ─────────────────────────────────────────────
# BMI CLASSIFICATION THRESHOLDS
# ─────────────────────────────────────────────

STANDARD_THRESHOLDS = {
    "Underweight": (0,    18.5),
    "Normal":      (18.5, 25.0),
    "Overweight":  (25.0, 30.0),
    "Obese":       (30.0, float("inf")),
}

ASIAN_THRESHOLDS = {
    "Underweight": (0,    18.5),
    "Normal":      (18.5, 23.0),
    "Overweight":  (23.0, 27.5),
    "Obese":       (27.5, float("inf")),
}

ADJUSTED_ETHNICITIES = {"Asian", "Black"}

# ─────────────────────────────────────────────
# DISPLAY / UI CONFIG
# ─────────────────────────────────────────────

CATEGORY_COLORS = {
    "Underweight": "#378ADD",
    "Normal":      "#639922",
    "Overweight":  "#BA7517",
    "Obese":       "#E24B4A",
}

RACE_OPTIONS = ["White/Other", "Asian", "Black"]

STANDARD_GLOBAL = "Global WHO Standard"
STANDARD_ASIAN  = "Asian Clinical Standard"

# ─────────────────────────────────────────────
# BAI HEALTHY RANGES BY GENDER (body fat %)
# Source: Bergman et al. (2011), Obesity Journal
# ─────────────────────────────────────────────

BAI_CATEGORIES = {
    "Male": {
        "Underweight": (0,    8.0),
        "Normal":      (8.0,  21.0),
        "Overweight":  (21.0, 26.0),
        "Obese":       (26.0, float("inf")),
    },
    "Female": {
        "Underweight": (0,    21.0),
        "Normal":      (21.0, 33.0),
        "Overweight":  (33.0, 39.0),
        "Obese":       (39.0, float("inf")),
    },
}

# ─────────────────────────────────────────────
# RISK PROBABILITY TABLE  (2026 Clinical Data)
# Keys: (age_band, bmi_category) → risk metadata
# ─────────────────────────────────────────────

RISK_PROBABILITY = {
    ("Young",  "Underweight"): {"prob": 0.22, "level": "Moderate", "color": "#BA7517"},
    ("Young",  "Normal"):      {"prob": 0.05, "level": "Low",      "color": "#639922"},
    ("Young",  "Overweight"):  {"prob": 0.18, "level": "Low-Mod",  "color": "#BA7517"},
    ("Young",  "Obese"):       {"prob": 0.35, "level": "Moderate", "color": "#E24B4A"},
    ("Middle", "Underweight"): {"prob": 0.30, "level": "Moderate", "color": "#BA7517"},
    ("Middle", "Normal"):      {"prob": 0.10, "level": "Low",      "color": "#639922"},
    ("Middle", "Overweight"):  {"prob": 0.40, "level": "Moderate", "color": "#BA7517"},
    ("Middle", "Obese"):       {"prob": 0.60, "level": "High",     "color": "#E24B4A"},
    ("Senior", "Underweight"): {"prob": 0.50, "level": "High",     "color": "#E24B4A"},
    ("Senior", "Normal"):      {"prob": 0.15, "level": "Low",      "color": "#639922"},
    ("Senior", "Overweight"):  {"prob": 0.55, "level": "High",     "color": "#E24B4A"},
    ("Senior", "Obese"):       {"prob": 0.80, "level": "CRITICAL", "color": "#FF0000"},
}

# ─────────────────────────────────────────────
# PLOTLY DARK THEME BASE
# ─────────────────────────────────────────────

PLOTLY_DARK = dict(
    paper_bgcolor="#0e1117",
    plot_bgcolor="#0e1117",
    font=dict(color="#ccc"),
    xaxis=dict(gridcolor="#222", zerolinecolor="#333"),
    yaxis=dict(gridcolor="#222", zerolinecolor="#333"),
)
