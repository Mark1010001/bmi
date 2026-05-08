import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_data():
    response = client.get("/api/data")
    assert response.status_code == 200
    data = response.json()
    assert "patterns" in data
    assert "sample" in data
    assert "chart_data" in data
    assert data["patterns"]["total_users"] == 50

def test_calculate_normal():
    response = client.post("/api/calculate", json={
        "gender": "Male",
        "age": 30,
        "weight": 70,
        "height": 175,
        "hip_cm": 90,
        "active_standard": "Global WHO Standard"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["bmi"] == 22.9
    assert data["bmi_category"] == "Normal"
    assert data["age_band"] == "Young"

def test_calculate_asian_standard():
    # BMI 24.0 is Normal in WHO but Overweight in Asian
    response = client.post("/api/calculate", json={
        "gender": "Male",
        "age": 30,
        "weight": 73.5,
        "height": 175,
        "hip_cm": 90,
        "active_standard": "Asian Clinical Standard"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["bmi"] == 24.0
    assert data["bmi_category"] == "Overweight"

def test_bai_calculation():
    # Formula: (Hip / Height^1.5) - 18
    # (100 / 1.7^1.5) - 18 = (100 / 2.215) - 18 = 45.14 - 18 = 27.14
    response = client.post("/api/calculate", json={
        "gender": "Female",
        "age": 25,
        "weight": 60,
        "height": 170,
        "hip_cm": 100,
        "active_standard": "Global WHO Standard"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["bai"] == 27.1
    # For Female, Normal is 21-33
    assert data["bai_category"] == "Normal"
