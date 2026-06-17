import pandas as pd

df = pd.read_csv("data/processed/processed_startups.csv")

def analyze_startup(row):
    score = 0

    if row["funding_amount"] >= 500000:
        score += 20

    if row["revenue"] >= 1000000:
        score += 20

    if row["team_size"] >= 20:
        score += 15

    if row["market_size"] >= 50000000:
        score += 20

    if row["founder_experience"] >= 5:
        score += 15

    if row["customer_growth"] >= 30:
        score += 10

    if score >= 80:
        profile = "Excellent Startup Profile"
    elif score >= 60:
        profile = "Good Startup Profile"
    elif score >= 40:
        profile = "Average Startup Profile"
    else:
        profile = "Weak Startup Profile"

    return score, profile


scores = []
profiles = []

for index, row in df.iterrows():
    score, profile = analyze_startup(row)
    scores.append(score)
    profiles.append(profile)

df["profile_score"] = scores
df["profile_category"] = profiles

print("Startup Profile Analysis Completed")
print(df[["funding_amount", "revenue", "team_size", "profile_score", "profile_category"]])

df.to_csv("data/processed/startup_profile_analysis.csv", index=False)

print("\nProfile analysis saved successfully!")