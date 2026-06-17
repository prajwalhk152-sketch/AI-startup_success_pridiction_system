import pandas as pd

# Load competitor analysis data
df = pd.read_csv("data/processed/competitor_analysis.csv")

def forecast_growth(row):
    score = 0

    # Revenue growth strength
    if row["revenue"] >= 2500000:
        score += 25
    elif row["revenue"] >= 1000000:
        score += 20
    elif row["revenue"] >= 500000:
        score += 10
    else:
        score += 5

    # Customer growth strength
    if row["customer_growth"] >= 45:
        score += 25
    elif row["customer_growth"] >= 30:
        score += 20
    elif row["customer_growth"] >= 15:
        score += 10
    else:
        score += 5

    # Funding strength
    if row["funding_amount"] >= 900000:
        score += 20
    elif row["funding_amount"] >= 500000:
        score += 15
    elif row["funding_amount"] >= 200000:
        score += 10
    else:
        score += 5

    # Market strength
    if row["market_score"] >= 80:
        score += 15
    elif row["market_score"] >= 60:
        score += 10
    else:
        score += 5

    # Competitive advantage
    if row["competitive_advantage_score"] >= 80:
        score += 15
    elif row["competitive_advantage_score"] >= 60:
        score += 10
    else:
        score += 5

    if score >= 85:
        forecast = "Very High Growth"
        projected_revenue_growth = 45
        expected_user_growth = 50
    elif score >= 70:
        forecast = "High Growth"
        projected_revenue_growth = 35
        expected_user_growth = 40
    elif score >= 50:
        forecast = "Moderate Growth"
        projected_revenue_growth = 22
        expected_user_growth = 28
    else:
        forecast = "Low Growth"
        projected_revenue_growth = 10
        expected_user_growth = 15

    return score, forecast, projected_revenue_growth, expected_user_growth


growth_scores = []
growth_forecasts = []
projected_revenue_growths = []
expected_user_growths = []

for index, row in df.iterrows():
    score, forecast, revenue_growth, user_growth = forecast_growth(row)

    growth_scores.append(score)
    growth_forecasts.append(forecast)
    projected_revenue_growths.append(revenue_growth)
    expected_user_growths.append(user_growth)

df["growth_score"] = growth_scores
df["growth_forecast"] = growth_forecasts
df["projected_revenue_growth_percent"] = projected_revenue_growths
df["expected_user_growth_percent"] = expected_user_growths

print("Growth Forecasting Completed\n")

print(df[[
    "revenue",
    "customer_growth",
    "funding_amount",
    "market_score",
    "competitive_advantage_score",
    "growth_score",
    "growth_forecast",
    "projected_revenue_growth_percent",
    "expected_user_growth_percent"
]])

df.to_csv("data/processed/growth_forecasting.csv", index=False)

print("\nGrowth forecasting saved successfully!")