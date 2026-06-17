from flask import Flask, request, jsonify
import os
import pandas as pd
import sqlite3
import joblib
import json
from pathlib import Path
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split

ROOT_DIR = Path(__file__).resolve().parents[1]
DATABASE_PATH = ROOT_DIR / "database" / "startups.db"
MODEL_DIR = ROOT_DIR / "models"

conn = sqlite3.connect(DATABASE_PATH)

print("Database Connected Successfully")

conn.close()
app = Flask(__name__)


def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def ensure_app_tables():
    conn = get_db_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS app_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            display_name TEXT NOT NULL,
            password TEXT NOT NULL,
            role_mode TEXT NOT NULL DEFAULT 'founder',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS saved_reports (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            startup_name TEXT NOT NULL,
            industry_name TEXT,
            description TEXT,
            report_json TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS investment_offers (
            id TEXT PRIMARY KEY,
            startup_name TEXT NOT NULL,
            target_founder TEXT NOT NULL,
            investor TEXT NOT NULL,
            amount REAL NOT NULL DEFAULT 0,
            equity REAL NOT NULL DEFAULT 0,
            note TEXT,
            status TEXT NOT NULL DEFAULT 'Pending',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT
        )
        """
    )
    conn.commit()
    conn.close()


def row_to_dict(row):
    return dict(row) if row is not None else None


ensure_app_tables()

FEATURE_CAPABILITIES = [
    {
        "title": "Evaluate startup viability",
        "description": "Scores business strength from funding, revenue, team size, market size, founder experience, and customer growth."
    },
    {
        "title": "Estimate chances of success",
        "description": "Uses the trained machine-learning model to return a startup success probability."
    },
    {
        "title": "Understand market competition",
        "description": "Analyzes competition level, estimated competitor count, and competitive advantage."
    },
    {
        "title": "Identify funding requirements",
        "description": "Recommends funding stage, investment requirement, and funding gap."
    },
    {
        "title": "Predict future business growth",
        "description": "Forecasts revenue growth, user growth, market expansion, and business growth potential."
    }
]

INDUSTRY_CATALOG = [
    {"label": "AI", "value": 0, "model_value": 0, "growth": 35, "capital": "Medium", "trend": "Fast adoption, strong enterprise demand, and intense competition."},
    {"label": "AgriTech", "value": 1, "model_value": 1, "growth": 22, "capital": "Medium", "trend": "Growing demand for yield improvement, climate resilience, and supply-chain efficiency."},
    {"label": "CleanTech", "value": 2, "model_value": 2, "growth": 27, "capital": "High", "trend": "Policy support is strong, but sales cycles and infrastructure costs are higher."},
    {"label": "Cybersecurity", "value": 3, "model_value": 3, "growth": 31, "capital": "Medium", "trend": "Demand remains resilient because security is a board-level priority."},
    {"label": "E-Commerce", "value": 4, "model_value": 4, "growth": 20, "capital": "Medium", "trend": "Large market, but margins, retention, and acquisition cost decide survival."},
    {"label": "EdTech", "value": 5, "model_value": 5, "growth": 24, "capital": "Low", "trend": "Demand is steady, but willingness to pay and completion outcomes matter."},
    {"label": "FinTech", "value": 6, "model_value": 6, "growth": 30, "capital": "Medium", "trend": "Revenue potential is strong, with regulation and trust as major gates."},
    {"label": "FoodTech", "value": 7, "model_value": 7, "growth": 18, "capital": "Medium", "trend": "Operational efficiency and repeat purchase behavior matter more than hype."},
    {"label": "HealthTech", "value": 8, "model_value": 8, "growth": 28, "capital": "High", "trend": "High value market with long trust, compliance, and clinical adoption cycles."},
    {"label": "Logistics", "value": 9, "model_value": 9, "growth": 23, "capital": "High", "trend": "Efficiency, route density, and enterprise contracts drive outcomes."},
    {"label": "BioTech", "value": 10, "model_value": 8, "growth": 26, "capital": "High", "trend": "Scientific defensibility is powerful, but timelines and funding needs are long."},
    {"label": "DeepTech", "value": 11, "model_value": 0, "growth": 25, "capital": "High", "trend": "Strong defensibility when IP is real, but commercialization is slower."},
    {"label": "SaaS", "value": 12, "model_value": 0, "growth": 29, "capital": "Low", "trend": "Recurring revenue can scale well, but churn and sales efficiency are critical."},
    {"label": "PropTech", "value": 13, "model_value": 4, "growth": 19, "capital": "Medium", "trend": "Adoption depends on real estate cycles, partnerships, and transaction trust."},
    {"label": "LegalTech", "value": 14, "model_value": 0, "growth": 18, "capital": "Low", "trend": "Automation demand is rising, but professional workflow adoption can be slow."},
    {"label": "HRTech", "value": 15, "model_value": 0, "growth": 20, "capital": "Low", "trend": "Budgets follow hiring cycles, so retention and clear ROI are important."},
    {"label": "InsurTech", "value": 16, "model_value": 6, "growth": 21, "capital": "Medium", "trend": "Distribution and underwriting partnerships are usually the hardest parts."},
    {"label": "WealthTech", "value": 17, "model_value": 6, "growth": 22, "capital": "Medium", "trend": "Trust, compliance, and low acquisition cost determine scalability."},
    {"label": "Gaming", "value": 18, "model_value": 4, "growth": 24, "capital": "Medium", "trend": "Hit risk is high, but strong retention and community can unlock rapid growth."},
    {"label": "MediaTech", "value": 19, "model_value": 4, "growth": 17, "capital": "Low", "trend": "Audience growth is possible, but monetization and differentiation are hard."},
    {"label": "TravelTech", "value": 20, "model_value": 4, "growth": 21, "capital": "Medium", "trend": "Demand rebounds quickly, but seasonality and supplier access matter."},
    {"label": "Mobility", "value": 21, "model_value": 9, "growth": 24, "capital": "High", "trend": "Fleet economics, regulation, and utilization decide real viability."},
    {"label": "EV", "value": 22, "model_value": 2, "growth": 32, "capital": "High", "trend": "Demand is strong, but hardware, charging, and supply-chain execution are tough."},
    {"label": "Real Estate", "value": 23, "model_value": 4, "growth": 16, "capital": "High", "trend": "Asset-heavy models need disciplined capital use and local market knowledge."},
    {"label": "ManufacturingTech", "value": 24, "model_value": 9, "growth": 20, "capital": "High", "trend": "Industrial adoption is slower, but ROI can be strong when automation saves cost."},
    {"label": "Creator Economy", "value": 25, "model_value": 4, "growth": 19, "capital": "Low", "trend": "Distribution is cheap, but platform dependence and retention are major risks."}
]

WATCHLIST_COMPANIES = [
    {
        "startup_id": "wait-1",
        "startup_name": "QuantumCart AI",
        "performance_status": "Good",
        "industry": 0,
        "funding_amount": 0,
        "requested_investment": 650000,
        "team_size": 18,
        "revenue": 420000,
        "market_size": 78000000,
        "founder_experience": 6,
        "business_model": 3,
        "competition_level": 2,
        "customer_growth": 39,
        "profile_score": 82,
        "market_score": 88,
        "risk_score": 32,
        "risk_category": "Low Risk",
        "pitch_stage": "Due Diligence"
    },
    {
        "startup_id": "wait-2",
        "startup_name": "FarmLink Robotics",
        "performance_status": "Moderate",
        "industry": 1,
        "funding_amount": 0,
        "requested_investment": 320000,
        "team_size": 14,
        "revenue": 160000,
        "market_size": 42000000,
        "founder_experience": 4,
        "business_model": 0,
        "competition_level": 1,
        "customer_growth": 24,
        "profile_score": 58,
        "market_score": 66,
        "risk_score": 48,
        "risk_category": "Medium Risk",
        "pitch_stage": "Term Sheet Pending"
    },
    {
        "startup_id": "wait-3",
        "startup_name": "CareSignal Health",
        "performance_status": "Good",
        "industry": 8,
        "funding_amount": 0,
        "requested_investment": 900000,
        "team_size": 31,
        "revenue": 870000,
        "market_size": 98000000,
        "founder_experience": 7,
        "business_model": 0,
        "competition_level": 2,
        "customer_growth": 44,
        "profile_score": 86,
        "market_score": 91,
        "risk_score": 28,
        "risk_category": "Low Risk",
        "pitch_stage": "Investor Call"
    },
    {
        "startup_id": "wait-4",
        "startup_name": "EduPilot Studio",
        "performance_status": "Moderate",
        "industry": 5,
        "funding_amount": 0,
        "requested_investment": 240000,
        "team_size": 12,
        "revenue": 95000,
        "market_size": 30000000,
        "founder_experience": 3,
        "business_model": 1,
        "competition_level": 0,
        "customer_growth": 19,
        "profile_score": 49,
        "market_score": 52,
        "risk_score": 58,
        "risk_category": "Medium Risk",
        "pitch_stage": "Screening"
    },
    {
        "startup_id": "wait-5",
        "startup_name": "GreenVault Energy",
        "performance_status": "Good",
        "industry": 2,
        "funding_amount": 0,
        "requested_investment": 780000,
        "team_size": 26,
        "revenue": 640000,
        "market_size": 105000000,
        "founder_experience": 8,
        "business_model": 0,
        "competition_level": 1,
        "customer_growth": 41,
        "profile_score": 84,
        "market_score": 95,
        "risk_score": 30,
        "risk_category": "Low Risk",
        "pitch_stage": "Partner Review"
    }
]

# Load ML Model
model = joblib.load(MODEL_DIR / "success_prediction_model.pkl")
industry_encoder = joblib.load(MODEL_DIR / "industry_encoder.pkl")
business_encoder = joblib.load(MODEL_DIR / "business_encoder.pkl")
competition_encoder = joblib.load(MODEL_DIR / "competition_encoder.pkl")


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,DELETE,PATCH,OPTIONS"
    return response


def read_startup_analysis(query="SELECT * FROM startup_analysis"):
    conn = sqlite3.connect(DATABASE_PATH)
    df = pd.read_sql_query(query, conn)
    conn.close()
    return df


def encoder_options(encoder):
    return [
        {"label": label, "value": int(index)}
        for index, label in enumerate(encoder.classes_)
    ]


def industry_options():
    return INDUSTRY_CATALOG


def industry_item(value):
    try:
        numeric_value = int(value)
    except (TypeError, ValueError):
        numeric_value = 0
    return next(
        (item for item in INDUSTRY_CATALOG if item["value"] == numeric_value),
        INDUSTRY_CATALOG[0]
    )


def add_readable_labels(df):
    if "industry" in df.columns:
        df["industry_name"] = df["industry"].apply(
            lambda value: industry_item(value)["label"] if pd.notna(value) else value
        )
    if "business_model" in df.columns:
        df["business_model_name"] = df["business_model"].apply(
            lambda value: business_encoder.classes_[int(value)]
            if pd.notna(value) and int(value) < len(business_encoder.classes_)
            else value
        )
    if "competition_level" in df.columns:
        df["competition_level_name"] = df["competition_level"].apply(
            lambda value: competition_encoder.classes_[int(value)]
            if pd.notna(value) and int(value) < len(competition_encoder.classes_)
            else value
        )
    return df


def startup_metrics(data):
    status = data.get("performance_status", "Moderate")
    revenue = int(data.get("revenue", 0))
    funding = int(data.get("funding_amount", 0))
    market_size = int(data.get("market_size", 0))
    customer_growth = int(data.get("customer_growth", 0))
    competition = int(data.get("competition_level", 2))

    base_scores = {
        "Good": {"profile": 90, "growth": 85, "risk": 30, "success": 1},
        "Moderate": {"profile": 55, "growth": 55, "risk": 55, "success": 1},
        "Loss": {"profile": 20, "growth": 25, "risk": 85, "success": 0}
    }
    scores = base_scores.get(status, base_scores["Moderate"])

    market_score = min(100, max(25, int(market_size / 1000000) + customer_growth))
    competitor_count = 25 if competition == 0 else 5 if competition == 1 else 12
    competitive_score = 30 if competition == 0 else 85 if competition == 1 else 60

    return {
        "success": scores["success"],
        "profile_score": scores["profile"],
        "profile_category": "Excellent Startup Profile" if scores["profile"] >= 80 else "Average Startup Profile" if scores["profile"] >= 45 else "Weak Startup Profile",
        "recommended_funding_stage": "Venture Capital" if funding >= 1000000 else "Series A" if funding >= 700000 else "Seed Funding" if funding >= 250000 else "Angel Investment",
        "investment_requirement": 2500000 if funding >= 1000000 else 1000000 if funding >= 700000 else 300000 if funding >= 250000 else 150000,
        "investor_interest": "High" if status == "Good" else "Medium" if status == "Moderate" else "Low",
        "market_score": market_score,
        "market_potential": "Very High" if market_score >= 85 else "High" if market_score >= 65 else "Medium" if market_score >= 45 else "Low",
        "competitor_count": competitor_count,
        "competition_category": "High Competition" if competition == 0 else "Low Competition" if competition == 1 else "Medium Competition",
        "competitive_advantage_score": competitive_score,
        "competitive_advantage": "Strong Competitive Advantage" if competitive_score >= 80 else "Good Competitive Advantage" if competitive_score >= 55 else "Weak Competitive Advantage",
        "growth_score": scores["growth"],
        "growth_forecast": "Very High Growth" if scores["growth"] >= 85 else "High Growth" if scores["growth"] >= 70 else "Moderate Growth" if scores["growth"] >= 45 else "Low Growth",
        "projected_revenue_growth_percent": 45 if status == "Good" else 22 if status == "Moderate" else 10,
        "expected_user_growth_percent": 50 if status == "Good" else 28 if status == "Moderate" else 15,
        "risk_score": scores["risk"],
        "risk_category": "Low Risk" if scores["risk"] <= 35 else "Medium Risk" if scores["risk"] <= 60 else "High Risk"
    }


def explain_startup_prediction(data, probability):
    feature_labels = {
        "industry": "Industry fit",
        "funding_amount": "Funding strength",
        "team_size": "Team size",
        "revenue": "Revenue traction",
        "market_size": "Market size",
        "founder_experience": "Founder experience",
        "business_model": "Business model",
        "competition_level": "Competition pressure",
        "customer_growth": "Customer growth"
    }
    values = {
        "industry": industry_item(data.get("industry", 0))["model_value"],
        "funding_amount": float(data.get("funding_amount", 0)),
        "team_size": float(data.get("team_size", 0)),
        "revenue": float(data.get("revenue", 0)),
        "market_size": float(data.get("market_size", 0)),
        "founder_experience": float(data.get("founder_experience", 0)),
        "business_model": float(data.get("business_model", 0)),
        "competition_level": float(data.get("competition_level", 2)),
        "customer_growth": float(data.get("customer_growth", 0))
    }
    importances = getattr(model, "feature_importances_", [1 / len(values)] * len(values))
    positive_features = {"funding_amount", "team_size", "revenue", "market_size", "founder_experience", "customer_growth"}
    average_values = {
        "funding_amount": 350000,
        "team_size": 15,
        "revenue": 250000,
        "market_size": 50000000,
        "founder_experience": 4,
        "customer_growth": 25
    }
    factors = []

    for index, (feature, value) in enumerate(values.items()):
        importance = float(importances[index]) if index < len(importances) else 0.05
        if feature == "competition_level":
            direction = "positive" if int(value) == 1 else "negative" if int(value) == 0 else "neutral"
            detail = "Lower competition improves the outlook." if direction == "positive" else "High competition reduces confidence." if direction == "negative" else "Medium competition keeps pressure manageable."
        elif feature in positive_features:
            benchmark = average_values.get(feature, 1)
            direction = "positive" if value >= benchmark else "negative"
            detail = f"{feature_labels[feature]} is {'above' if direction == 'positive' else 'below'} the planning benchmark."
        else:
            direction = "neutral"
            detail = f"{feature_labels[feature]} is used by the trained model as a context signal."

        factors.append({
            "feature": feature,
            "label": feature_labels[feature],
            "value": round(value, 2),
            "importance": round(importance * 100, 1),
            "direction": direction,
            "detail": detail
        })

    return {
        "summary": "Strongest model drivers are shown using the trained Random Forest feature importances and simple business benchmarks.",
        "confidence": "High" if probability >= 75 else "Medium" if probability >= 50 else "Low",
        "top_factors": sorted(factors, key=lambda item: item["importance"], reverse=True)[:6]
    }
    scores = base_scores.get(status, base_scores["Moderate"])

    market_score = min(100, max(25, int(market_size / 1000000) + customer_growth))
    competitor_count = 25 if competition == 0 else 5 if competition == 1 else 12
    competitive_score = 30 if competition == 0 else 85 if competition == 1 else 60

    return {
        "success": scores["success"],
        "profile_score": scores["profile"],
        "profile_category": "Excellent Startup Profile" if scores["profile"] >= 80 else "Average Startup Profile" if scores["profile"] >= 45 else "Weak Startup Profile",
        "recommended_funding_stage": "Venture Capital" if funding >= 1000000 else "Series A" if funding >= 700000 else "Seed Funding" if funding >= 250000 else "Angel Investment",
        "investment_requirement": 2500000 if funding >= 1000000 else 1000000 if funding >= 700000 else 300000 if funding >= 250000 else 150000,
        "investor_interest": "High" if status == "Good" else "Medium" if status == "Moderate" else "Low",
        "market_score": market_score,
        "market_potential": "Very High" if market_score >= 85 else "High" if market_score >= 65 else "Medium" if market_score >= 45 else "Low",
        "competitor_count": competitor_count,
        "competition_category": "High Competition" if competition == 0 else "Low Competition" if competition == 1 else "Medium Competition",
        "competitive_advantage_score": competitive_score,
        "competitive_advantage": "Strong Competitive Advantage" if competitive_score >= 80 else "Good Competitive Advantage" if competitive_score >= 55 else "Weak Competitive Advantage",
        "growth_score": scores["growth"],
        "growth_forecast": "Very High Growth" if scores["growth"] >= 85 else "High Growth" if scores["growth"] >= 70 else "Moderate Growth" if scores["growth"] >= 45 else "Low Growth",
        "projected_revenue_growth_percent": 45 if status == "Good" else 22 if status == "Moderate" else 10,
        "expected_user_growth_percent": 50 if status == "Good" else 28 if status == "Moderate" else 15,
        "risk_score": scores["risk"],
        "risk_category": "Low Risk" if scores["risk"] <= 35 else "Medium Risk" if scores["risk"] <= 60 else "High Risk"
    }


def generated_waiting_companies():
    prefixes = [
        "Nova", "Pulse", "Bright", "Nex", "Astra", "Swift", "Prime", "Urban", "Blue", "Core",
        "Meta", "Vertex", "Hyper", "Cloud", "Smart", "Future", "Signal", "Orbit", "Alpha", "Green"
    ]
    suffixes = [
        "AI", "Ledger", "Health", "Cart", "Learn", "Grid", "Shield", "Route", "Foods", "Robotics",
        "Works", "Flow", "Stack", "Hive", "Pilot", "Sense", "Loop", "Bridge", "Vault", "Labs"
    ]
    pitch_stages = ["Screening", "Investor Call", "Due Diligence", "Term Sheet Pending", "Partner Review"]
    statuses = ["Good", "Moderate", "Loss"]
    generated = []

    for index in range(6, 201):
        industry = index % 10
        status = statuses[index % len(statuses)]
        requested = 120000 + ((index * 37000) % 1380000)
        revenue = 40000 + ((index * 29000) % 1450000)
        market_size = 18000000 + ((index * 5100000) % 132000000)
        customer_growth = 8 + ((index * 7) % 55)
        row = {
            "startup_id": f"wait-{index}",
            "startup_name": f"{prefixes[index % len(prefixes)]}{suffixes[(index * 3) % len(suffixes)]} {index}",
            "performance_status": status,
            "industry": industry,
            "funding_amount": 0,
            "requested_investment": requested,
            "team_size": 6 + ((index * 5) % 58),
            "revenue": revenue,
            "market_size": market_size,
            "founder_experience": 1 + ((index * 2) % 10),
            "business_model": index % 4,
            "competition_level": index % 3,
            "customer_growth": customer_growth,
            "pitch_stage": pitch_stages[index % len(pitch_stages)]
        }
        row.update(startup_metrics({**row, "funding_amount": requested}))
        generated.append(row)

    return generated


def all_waiting_companies():
    return WATCHLIST_COMPANIES + generated_waiting_companies()


def find_waiting_company(waiting_id):
    return next((row for row in all_waiting_companies() if str(row["startup_id"]) == str(waiting_id)), None)

# --------------------------------------------------
# Home Route
# --------------------------------------------------

@app.route("/")
def home():
    return jsonify({
        "project": "AI Startup Success Prediction System",
        "status": "Running Successfully"
    })


@app.route("/metadata")
def metadata():
    return jsonify({
        "industries": industry_options(),
        "business_models": encoder_options(business_encoder),
        "competition_levels": encoder_options(competition_encoder),
        "capabilities": FEATURE_CAPABILITIES
    })


@app.route("/role-users", methods=["GET", "POST", "OPTIONS"])
def role_users():
    if request.method == "OPTIONS":
        return ("", 204)

    conn = get_db_connection()
    if request.method == "GET":
        rows = conn.execute(
            "SELECT id, username, display_name, role_mode, created_at, updated_at FROM app_users ORDER BY created_at DESC"
        ).fetchall()
        conn.close()
        return jsonify([row_to_dict(row) for row in rows])

    data = request.json or {}
    username = str(data.get("username", "")).strip().lower()
    display_name = str(data.get("display_name") or data.get("username") or "").strip()
    password = str(data.get("password", "")).strip()
    role_mode = str(data.get("role_mode", "founder")).strip().lower()

    if not username or not display_name or not password:
        conn.close()
        return jsonify({"error": "username, display_name, and password are required"}), 400
    if role_mode not in {"founder", "investor", "admin"}:
        conn.close()
        return jsonify({"error": "role_mode must be founder, investor, or admin"}), 400

    conn.execute(
        """
        INSERT INTO app_users (username, display_name, password, role_mode)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(username) DO UPDATE SET
            display_name = excluded.display_name,
            password = excluded.password,
            role_mode = excluded.role_mode,
            updated_at = CURRENT_TIMESTAMP
        """,
        (username, display_name, password, role_mode)
    )
    conn.commit()
    row = conn.execute(
        "SELECT id, username, display_name, role_mode, created_at, updated_at FROM app_users WHERE username = ?",
        (username,)
    ).fetchone()
    conn.close()
    return jsonify(row_to_dict(row)), 201


@app.route("/saved-reports", methods=["GET", "POST", "OPTIONS"])
def saved_reports():
    if request.method == "OPTIONS":
        return ("", 204)

    conn = get_db_connection()
    if request.method == "GET":
        username = request.args.get("username")
        if username:
            rows = conn.execute(
                "SELECT * FROM saved_reports WHERE username = ? ORDER BY created_at DESC",
                (username,)
            ).fetchall()
        else:
            rows = conn.execute("SELECT * FROM saved_reports ORDER BY created_at DESC").fetchall()
        conn.close()
        return jsonify([row_to_dict(row) for row in rows])

    data = request.json or {}
    report_id = str(data.get("id") or f"report-{pd.Timestamp.utcnow().value}")
    username = str(data.get("username", "")).strip()
    startup_name = str(data.get("startup_name") or data.get("startupName") or "Untitled startup").strip()
    industry_name = data.get("industry_name") or data.get("industryName")
    description = data.get("description", "")
    report_json = data.get("report_json") or data.get("report") or data

    if not username:
        conn.close()
        return jsonify({"error": "username is required"}), 400

    conn.execute(
        """
        INSERT OR REPLACE INTO saved_reports
        (id, username, startup_name, industry_name, description, report_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?, COALESCE((SELECT created_at FROM saved_reports WHERE id = ?), CURRENT_TIMESTAMP))
        """,
        (report_id, username, startup_name, industry_name, description, json.dumps(report_json), report_id)
    )
    conn.commit()
    row = conn.execute("SELECT * FROM saved_reports WHERE id = ?", (report_id,)).fetchone()
    conn.close()
    return jsonify(row_to_dict(row)), 201


@app.route("/investment-offers", methods=["GET", "POST", "PATCH", "OPTIONS"])
def investment_offers():
    if request.method == "OPTIONS":
        return ("", 204)

    conn = get_db_connection()
    if request.method == "GET":
        founder = request.args.get("founder")
        investor = request.args.get("investor")
        if founder:
            rows = conn.execute(
                "SELECT * FROM investment_offers WHERE lower(target_founder) = lower(?) ORDER BY created_at DESC",
                (founder,)
            ).fetchall()
        elif investor:
            rows = conn.execute(
                "SELECT * FROM investment_offers WHERE lower(investor) = lower(?) ORDER BY created_at DESC",
                (investor,)
            ).fetchall()
        else:
            rows = conn.execute("SELECT * FROM investment_offers ORDER BY created_at DESC").fetchall()
        conn.close()
        return jsonify([row_to_dict(row) for row in rows])

    data = request.json or {}
    if request.method == "POST":
        offer_id = str(data.get("id") or f"offer-{pd.Timestamp.utcnow().value}")
        startup_name = str(data.get("startup_name") or data.get("startupName") or "").strip()
        target_founder = str(data.get("target_founder") or data.get("targetFounder") or "").strip()
        investor = str(data.get("investor") or "").strip()
        amount = float(data.get("amount") or 0)
        equity = float(data.get("equity") or 0)
        note = data.get("note", "")

        if not startup_name or not target_founder or not investor:
            conn.close()
            return jsonify({"error": "startup_name, target_founder, and investor are required"}), 400

        conn.execute(
            """
            INSERT INTO investment_offers
            (id, startup_name, target_founder, investor, amount, equity, note, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (offer_id, startup_name, target_founder, investor, amount, equity, note, data.get("status", "Pending"))
        )
    else:
        offer_id = str(data.get("id") or "")
        if not offer_id:
            conn.close()
            return jsonify({"error": "id is required"}), 400
        fields = {
            "amount": data.get("amount"),
            "equity": data.get("equity"),
            "note": data.get("note"),
            "status": data.get("status")
        }
        updates = [(key, value) for key, value in fields.items() if value is not None]
        if not updates:
            conn.close()
            return jsonify({"error": "No offer fields provided to update"}), 400
        set_clause = ", ".join([f"{key} = ?" for key, _ in updates] + ["updated_at = CURRENT_TIMESTAMP"])
        conn.execute(
            f"UPDATE investment_offers SET {set_clause} WHERE id = ?",
            [value for _, value in updates] + [offer_id]
        )

    conn.commit()
    row = conn.execute("SELECT * FROM investment_offers WHERE id = ?", (data.get("id") or offer_id,)).fetchone()
    conn.close()
    if row is None:
        return jsonify({"error": "Investment offer not found"}), 404
    return jsonify(row_to_dict(row)), 201 if request.method == "POST" else 200

# --------------------------------------------------
# Success Prediction API
# --------------------------------------------------

@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    startup = pd.DataFrame([{
        "industry": industry_item(data["industry"])["model_value"],
        "funding_amount": data["funding_amount"],
        "team_size": data["team_size"],
        "revenue": data["revenue"],
        "market_size": data["market_size"],
        "founder_experience": data["founder_experience"],
        "business_model": data["business_model"],
        "competition_level": data["competition_level"],
        "customer_growth": data["customer_growth"]
    }])

    prediction = model.predict(startup)[0]
    probability = model.predict_proba(startup)[0][1]

    return jsonify({
        "prediction": int(prediction),
        "success_probability": round(probability * 100, 2),
        "explainability": explain_startup_prediction(data, probability * 100)
    })


@app.route("/model-metrics")
def model_metrics():
    processed_path = ROOT_DIR / "data" / "processed" / "processed_startups.csv"
    df = pd.read_csv(processed_path)
    X = df.drop("success", axis=1)
    y = df["success"]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    y_pred = model.predict(X_test)
    labels = list(model.classes_) if hasattr(model, "classes_") else sorted(y.unique().tolist())
    feature_importance = [
        {
            "feature": feature,
            "importance": round(float(importance) * 100, 2)
        }
        for feature, importance in sorted(
            zip(X.columns, getattr(model, "feature_importances_", [0] * len(X.columns))),
            key=lambda item: item[1],
            reverse=True
        )
    ]

    return jsonify({
        "dataset_rows": int(len(df)),
        "train_rows": int(len(X_train)),
        "test_rows": int(len(X_test)),
        "accuracy": round(float(accuracy_score(y_test, y_pred)) * 100, 2),
        "classification_report": classification_report(y_test, y_pred, output_dict=True, zero_division=0),
        "confusion_matrix": confusion_matrix(y_test, y_pred, labels=labels).tolist(),
        "labels": [int(label) for label in labels],
        "feature_importance": feature_importance
    })


@app.route("/analytics")
def analytics():
    df = read_startup_analysis()
    df = add_readable_labels(df)
    industry = (
        df.groupby("industry_name")
        .agg(
            startups=("startup_name", "count"),
            success_rate=("success", "mean"),
            avg_funding=("funding_amount", "mean"),
            avg_risk=("risk_score", "mean"),
            avg_market=("market_score", "mean")
        )
        .reset_index()
    )
    industry["success_rate"] = (industry["success_rate"] * 100).round(1)
    industry[["avg_funding", "avg_risk", "avg_market"]] = industry[["avg_funding", "avg_risk", "avg_market"]].round(1)

    top_growth = df.sort_values("growth_score", ascending=False).head(8)
    high_risk = df.sort_values("risk_score", ascending=False).head(8)

    return jsonify({
        "industry_performance": industry.to_dict(orient="records"),
        "top_growth_startups": top_growth[["startup_name", "industry_name", "growth_score", "growth_forecast", "revenue"]].to_dict(orient="records"),
        "high_risk_startups": high_risk[["startup_name", "industry_name", "risk_score", "risk_category", "funding_amount"]].to_dict(orient="records")
    })

# --------------------------------------------------
# Startup Data API
# --------------------------------------------------

@app.route("/startup-data")
def startup_data():

    df = read_startup_analysis("SELECT rowid AS startup_id, * FROM startup_analysis")
    df = add_readable_labels(df)

    return jsonify(df.to_dict(orient="records"))


@app.route("/waiting-startups")
def waiting_startups():
    df = pd.DataFrame(all_waiting_companies())
    df = add_readable_labels(df)
    return jsonify(df.to_dict(orient="records"))


@app.route("/waiting-startups/<waiting_id>/invest", methods=["POST", "OPTIONS"])
def invest_waiting_startup(waiting_id):
    if request.method == "OPTIONS":
        return ("", 204)

    waiting = find_waiting_company(waiting_id)
    if waiting is None:
        return jsonify({"error": "Waiting startup not found"}), 404

    data = request.json or {}
    amount = int(data.get("amount") or waiting.get("requested_investment") or 0)
    if amount <= 0:
        return jsonify({"error": "Investment amount must be greater than 0"}), 400

    investment_data = {
        **waiting,
        "funding_amount": amount,
        "revenue": int(waiting.get("revenue", 0) + amount * 0.08)
    }
    metrics = startup_metrics(investment_data)
    row = {
        "startup_name": investment_data["startup_name"],
        "performance_status": investment_data.get("performance_status", "Moderate"),
        "industry": int(investment_data.get("industry", 0)),
        "funding_amount": int(investment_data.get("funding_amount", 0)),
        "team_size": int(investment_data.get("team_size", 1)),
        "revenue": int(investment_data.get("revenue", 0)),
        "market_size": int(investment_data.get("market_size", 0)),
        "founder_experience": int(investment_data.get("founder_experience", 0)),
        "business_model": int(investment_data.get("business_model", 0)),
        "competition_level": int(investment_data.get("competition_level", 2)),
        "customer_growth": int(investment_data.get("customer_growth", 0)),
        **metrics
    }

    conn = sqlite3.connect(DATABASE_PATH)
    columns = list(row.keys())
    placeholders = ",".join(["?"] * len(columns))
    conn.execute(
        f"INSERT INTO startup_analysis ({','.join(columns)}) VALUES ({placeholders})",
        [row[column] for column in columns]
    )
    conn.commit()
    startup_id = conn.execute("SELECT last_insert_rowid()").fetchone()[0]
    conn.close()

    row["startup_id"] = startup_id
    return jsonify(add_readable_labels(pd.DataFrame([row])).to_dict(orient="records")[0]), 201


@app.route("/company", methods=["POST", "OPTIONS"])
def add_company():
    if request.method == "OPTIONS":
        return ("", 204)

    data = request.json or {}
    required = ["startup_name", "industry", "performance_status"]
    missing = [field for field in required if data.get(field) in (None, "")]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    metrics = startup_metrics(data)
    row = {
        "startup_name": data["startup_name"],
        "performance_status": data.get("performance_status", "Moderate"),
        "industry": int(data.get("industry", 0)),
        "funding_amount": int(data.get("funding_amount", 0)),
        "team_size": int(data.get("team_size", 1)),
        "revenue": int(data.get("revenue", 0)),
        "market_size": int(data.get("market_size", 0)),
        "founder_experience": int(data.get("founder_experience", 0)),
        "business_model": int(data.get("business_model", 0)),
        "competition_level": int(data.get("competition_level", 2)),
        "customer_growth": int(data.get("customer_growth", 0)),
        **metrics
    }

    conn = sqlite3.connect(DATABASE_PATH)
    columns = list(row.keys())
    placeholders = ",".join(["?"] * len(columns))
    conn.execute(
        f"INSERT INTO startup_analysis ({','.join(columns)}) VALUES ({placeholders})",
        [row[column] for column in columns]
    )
    conn.commit()
    startup_id = conn.execute("SELECT last_insert_rowid()").fetchone()[0]
    conn.close()

    row["startup_id"] = startup_id
    return jsonify(add_readable_labels(pd.DataFrame([row])).to_dict(orient="records")[0]), 201


@app.route("/company/<int:startup_id>", methods=["DELETE", "OPTIONS"])
def delete_company(startup_id):
    if request.method == "OPTIONS":
        return ("", 204)

    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.execute("DELETE FROM startup_analysis WHERE rowid = ?", (startup_id,))
    conn.commit()
    deleted = cursor.rowcount
    conn.close()

    if deleted == 0:
        return jsonify({"error": "Company not found"}), 404
    return jsonify({"deleted": startup_id})


@app.route("/company/<int:startup_id>/invest", methods=["PATCH", "OPTIONS"])
def invest_more(startup_id):
    if request.method == "OPTIONS":
        return ("", 204)

    data = request.json or {}
    amount = int(data.get("amount", 0))
    if amount <= 0:
        return jsonify({"error": "Investment amount must be greater than 0"}), 400

    conn = sqlite3.connect(DATABASE_PATH)
    current = conn.execute(
        "SELECT funding_amount, revenue, market_score, profile_score, risk_score FROM startup_analysis WHERE rowid = ?",
        (startup_id,)
    ).fetchone()

    if current is None:
        conn.close()
        return jsonify({"error": "Company not found"}), 404

    funding_amount, revenue, market_score, profile_score, risk_score = current
    updated_funding = int(funding_amount or 0) + amount
    updated_revenue = int((revenue or 0) + (amount * 0.12))
    updated_market_score = min(100, int(market_score or 0) + max(1, amount // 500000))
    updated_profile_score = min(100, int(profile_score or 0) + max(1, amount // 400000))
    updated_risk_score = max(10, int(risk_score or 0) - max(1, amount // 600000))
    updated_risk_category = "Low Risk" if updated_risk_score <= 35 else "Medium Risk" if updated_risk_score <= 60 else "High Risk"

    conn.execute(
        """
        UPDATE startup_analysis
        SET funding_amount = ?,
            revenue = ?,
            market_score = ?,
            profile_score = ?,
            risk_score = ?,
            risk_category = ?
        WHERE rowid = ?
        """,
        (updated_funding, updated_revenue, updated_market_score, updated_profile_score, updated_risk_score, updated_risk_category, startup_id)
    )
    conn.commit()
    conn.close()

    return jsonify({
        "startup_id": startup_id,
        "added_investment": amount,
        "funding_amount": updated_funding,
        "revenue": updated_revenue,
        "market_score": updated_market_score,
        "profile_score": updated_profile_score,
        "risk_score": updated_risk_score,
        "risk_category": updated_risk_category
    })

# --------------------------------------------------
# Funding Recommendation API
# --------------------------------------------------

@app.route("/funding-report")
def funding_report():

    df = read_startup_analysis(
        """
        SELECT
        rowid AS startup_id,
        startup_name,
        performance_status,
        industry,
        funding_amount,
        revenue,
        profile_score,
        market_score,
        risk_score,
        risk_category,
        recommended_funding_stage,
        investment_requirement,
        investor_interest
        FROM startup_analysis
        """
    )
    df = add_readable_labels(df)
    df["funding_gap"] = (df["investment_requirement"] - df["funding_amount"]).clip(lower=0)
    df["recommendation_priority"] = df.apply(
        lambda row: "Invest More" if row["performance_status"] == "Good" and row["risk_score"] <= 40
        else "Monitor Before Funding" if row["performance_status"] == "Moderate"
        else "Avoid / Restructure",
        axis=1
    )
    df["recommendation_note"] = df.apply(
        lambda row: (
            f"{row['startup_name']} has strong traction with {row['market_score']}/100 market score and low risk; "
            f"recommended next stage is {row['recommended_funding_stage']}."
        ) if row["recommendation_priority"] == "Invest More" else (
            f"{row['startup_name']} needs validation before larger funding; release capital in milestones."
        ) if row["recommendation_priority"] == "Monitor Before Funding" else (
            f"{row['startup_name']} is high risk; pause new funding until revenue and profile score improve."
        ),
        axis=1
    )

    return jsonify(df.to_dict(orient="records"))

# --------------------------------------------------
# Market Analysis API
# --------------------------------------------------

@app.route("/market-report")
def market_report():

    df = read_startup_analysis(
        """
        SELECT
        rowid AS startup_id,
        startup_name,
        performance_status,
        industry,
        revenue,
        market_size,
        customer_growth,
        market_score,
        market_potential,
        risk_category
        FROM startup_analysis
        """
    )
    df = add_readable_labels(df)
    df["market_recommendation"] = df.apply(
        lambda row: f"Prioritize expansion in {row['industry_name']} because market potential is {row['market_potential']} and customer growth is {row['customer_growth']}%."
        if row["market_score"] >= 70 else
        f"Validate demand before scaling; {row['industry_name']} market score is currently {row['market_score']}/100.",
        axis=1
    )

    return jsonify(df.to_dict(orient="records"))


@app.route("/competitor-report")
def competitor_report():

    df = read_startup_analysis(
        """
        SELECT
        rowid AS startup_id,
        startup_name,
        performance_status,
        industry,
        competitor_count,
        competition_category,
        competitive_advantage_score,
        competitive_advantage,
        market_score
        FROM startup_analysis
        """
    )
    df = add_readable_labels(df)
    df["positioning_advice"] = df.apply(
        lambda row: f"{row['startup_name']} can defend share with {row['competitive_advantage']} despite {row['competitor_count']} competitors."
        if row["competitive_advantage_score"] >= 60 else
        f"{row['startup_name']} needs clearer differentiation before aggressive funding.",
        axis=1
    )

    return jsonify(df.to_dict(orient="records"))

# --------------------------------------------------
# Growth Forecast API
# --------------------------------------------------

@app.route("/growth-report")
def growth_report():

    df = read_startup_analysis(
        """
        SELECT
        rowid AS startup_id,
        startup_name,
        performance_status,
        industry,
        revenue,
        customer_growth,
        growth_score,
        growth_forecast,
        projected_revenue_growth_percent,
        expected_user_growth_percent,
        risk_category
        FROM startup_analysis
        """
    )
    df = add_readable_labels(df)
    df["projected_next_revenue"] = (
        df["revenue"] * (1 + (df["projected_revenue_growth_percent"] / 100))
    ).round().astype(int)
    df["growth_action"] = df.apply(
        lambda row: f"Scale sales and hiring; projected revenue can reach {row['projected_next_revenue']} with {row['growth_forecast'].lower()}."
        if row["growth_score"] >= 70 else
        "Use milestone-based growth plan before adding large capital.",
        axis=1
    )

    return jsonify(df.to_dict(orient="records"))

# --------------------------------------------------
# Risk Report API
# --------------------------------------------------

@app.route("/risk-report")
def risk_report():

    df = read_startup_analysis(
        """
        SELECT
        rowid AS startup_id,
        startup_name,
        performance_status,
        industry,
        funding_amount,
        revenue,
        profile_score,
        market_score,
        risk_score,
        risk_category
        FROM startup_analysis
        """
    )
    df = add_readable_labels(df)
    df["risk_action"] = df.apply(
        lambda row: "Safe to consider follow-on investment with normal monitoring."
        if row["risk_category"] == "Low Risk" else
        "Monitor burn rate, revenue conversion, and milestone delivery before next funding."
        if row["risk_category"] == "Medium Risk" else
        "High-risk position: avoid new capital until traction improves or contract terms are revised.",
        axis=1
    )

    return jsonify(df.to_dict(orient="records"))


@app.route("/summary")
def summary():
    df = read_startup_analysis()

    result = {
        "total_startups": int(len(df)),
        "successful_startups": int(df["success"].sum()),
        "success_rate": round(float(df["success"].mean() * 100), 1),
        "total_funding": int(df["funding_amount"].sum()),
        "avg_risk_score": round(float(df["risk_score"].mean()), 1),
        "industry_distribution": df["industry"].value_counts().sort_index().to_dict(),
        "risk_distribution": df["risk_category"].value_counts().to_dict()
    }

    return jsonify(result)

# --------------------------------------------------
# Run Application
# --------------------------------------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False, use_reloader=False)
