import pandas as pd

# Load growth forecasting data
df = pd.read_csv("data/processed/growth_forecasting.csv")

def calculate_risk(row):
    risk_score = 0

    # Financial Risk
    if row["revenue"] < 300000:
        risk_score += 25
    elif row["revenue"] < 1000000:
        risk_score += 15
    else:
        risk_score += 5

    # Funding Risk
    if row["funding_amount"] < 100000:
        risk_score += 20
    elif row["funding_amount"] < 500000:
        risk_score += 10
    else:
        risk_score += 5

    # Market Risk
    if row["market_score"] < 40:
        risk_score += 20
    elif row["market_score"] < 70:
        risk_score += 10
    else:
        risk_score += 5

    # Competition Risk
    if row["competition_category"] == "High Competition":
        risk_score += 20
    elif row["competition_category"] == "Medium Competition":
        risk_score += 10
    else:
        risk_score += 5

    # Operational Risk
    if row["team_size"] < 10:
        risk_score += 15
    elif row["team_size"] < 25:
        risk_score += 10
    else:
        risk_score += 5

    if risk_score <= 30:
        risk_category = "Low Risk"
    elif risk_score <= 60:
        risk_category = "Medium Risk"
    else:
        risk_category = "High Risk"

    return risk_score, risk_category


risk_scores = []
risk_categories = []

for index, row in df.iterrows():
    score, category = calculate_risk(row)
    risk_scores.append(score)
    risk_categories.append(category)

df["risk_score"] = risk_scores
df["risk_category"] = risk_categories

print("Startup Risk Assessment Completed\n")

print(df[[
    "revenue",
    "funding_amount",
    "market_score",
    "competition_category",
    "team_size",
    "risk_score",
    "risk_category"
]])

df.to_csv("data/processed/risk_assessment.csv", index=False)

print("\nRisk assessment saved successfully!")