import pandas as pd

# Load profile analysis dataset
df = pd.read_csv("data/processed/startup_profile_analysis.csv")

def recommend_funding(row):
    funding = row["funding_amount"]
    revenue = row["revenue"]
    team_size = row["team_size"]
    growth = row["customer_growth"]
    profile_score = row["profile_score"]

    if funding < 100000 and revenue < 200000:
        stage = "Bootstrapping"
        requirement = 50000

    elif funding < 300000 and team_size <= 15:
        stage = "Angel Investment"
        requirement = 150000

    elif funding < 700000 and growth >= 20:
        stage = "Seed Funding"
        requirement = 300000

    elif funding < 1200000 and revenue >= 1000000:
        stage = "Series A"
        requirement = 1000000

    else:
        stage = "Venture Capital"
        requirement = 2500000

    if profile_score >= 80:
        investor_interest = "High"
    elif profile_score >= 60:
        investor_interest = "Medium"
    else:
        investor_interest = "Low"

    return stage, requirement, investor_interest


funding_stages = []
investment_requirements = []
investor_interests = []

for index, row in df.iterrows():
    stage, requirement, interest = recommend_funding(row)
    funding_stages.append(stage)
    investment_requirements.append(requirement)
    investor_interests.append(interest)

df["recommended_funding_stage"] = funding_stages
df["investment_requirement"] = investment_requirements
df["investor_interest"] = investor_interests

print("Funding Recommendation Completed\n")

print(df[[
    "funding_amount",
    "revenue",
    "team_size",
    "customer_growth",
    "profile_score",
    "recommended_funding_stage",
    "investment_requirement",
    "investor_interest"
]])

df.to_csv("data/processed/funding_recommendations.csv", index=False)

print("\nFunding recommendations saved successfully!")