import pandas as pd

# Load market analysis data
df = pd.read_csv("data/processed/market_analysis.csv")

def analyze_competitors(row):
    score = 0

    # Competition level encoded:
    # Low = usually 1, Medium = 2, High = 0 depending on LabelEncoder
    competition = row["competition_level"]

    if competition == 1:
        competitor_count = 5
        competition_category = "Low Competition"
        score += 30

    elif competition == 2:
        competitor_count = 12
        competition_category = "Medium Competition"
        score += 20

    else:
        competitor_count = 25
        competition_category = "High Competition"
        score += 10

    if row["funding_amount"] >= 700000:
        score += 25
    elif row["funding_amount"] >= 300000:
        score += 15
    else:
        score += 5

    if row["revenue"] >= 1500000:
        score += 25
    elif row["revenue"] >= 700000:
        score += 15
    else:
        score += 5

    if row["customer_growth"] >= 35:
        score += 20
    elif row["customer_growth"] >= 20:
        score += 10
    else:
        score += 5

    if score >= 80:
        advantage = "Strong Competitive Advantage"
    elif score >= 60:
        advantage = "Good Competitive Advantage"
    elif score >= 40:
        advantage = "Average Competitive Advantage"
    else:
        advantage = "Weak Competitive Advantage"

    return competitor_count, competition_category, score, advantage


competitor_counts = []
competition_categories = []
competitive_scores = []
competitive_advantages = []

for index, row in df.iterrows():
    count, category, score, advantage = analyze_competitors(row)

    competitor_counts.append(count)
    competition_categories.append(category)
    competitive_scores.append(score)
    competitive_advantages.append(advantage)

df["competitor_count"] = competitor_counts
df["competition_category"] = competition_categories
df["competitive_advantage_score"] = competitive_scores
df["competitive_advantage"] = competitive_advantages

print("Competitor Analysis Completed\n")

print(df[[
    "competition_level",
    "funding_amount",
    "revenue",
    "customer_growth",
    "competitor_count",
    "competition_category",
    "competitive_advantage_score",
    "competitive_advantage"
]])

df.to_csv("data/processed/competitor_analysis.csv", index=False)

print("\nCompetitor analysis saved successfully!")