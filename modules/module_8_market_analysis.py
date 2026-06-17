import pandas as pd

df = pd.read_csv("data/processed/funding_recommendations.csv")

def analyze_market(row):
    score = 0

    if row["market_size"] >= 80000000:
        score += 30
    elif row["market_size"] >= 50000000:
        score += 20
    else:
        score += 10

    if row["customer_growth"] >= 40:
        score += 30
    elif row["customer_growth"] >= 25:
        score += 20
    else:
        score += 10

    if row["revenue"] >= 2000000:
        score += 20
    elif row["revenue"] >= 1000000:
        score += 15
    else:
        score += 5

    if row["competition_level"] == 1:
        score += 20
    elif row["competition_level"] == 2:
        score += 15
    else:
        score += 10

    if score >= 80:
        potential = "Very High"
    elif score >= 60:
        potential = "High"
    elif score >= 40:
        potential = "Medium"
    else:
        potential = "Low"

    return score, potential


market_scores = []
market_potentials = []

for index, row in df.iterrows():
    score, potential = analyze_market(row)
    market_scores.append(score)
    market_potentials.append(potential)

df["market_score"] = market_scores
df["market_potential"] = market_potentials

print("Market Analysis Completed\n")

print(df[[
    "market_size",
    "customer_growth",
    "revenue",
    "competition_level",
    "market_score",
    "market_potential"
]])

df.to_csv("data/processed/market_analysis.csv", index=False)

print("\nMarket analysis saved successfully!")