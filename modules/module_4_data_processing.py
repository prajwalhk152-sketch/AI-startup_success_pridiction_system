import pandas as pd
from sklearn.preprocessing import LabelEncoder
import joblib


# Load Dataset
df = pd.read_csv("data/raw/startups.csv")

print("Original Dataset Shape:")
print(df.shape)

# -----------------------------
# Remove Duplicate Records
# -----------------------------
df.drop_duplicates(inplace=True)

# -----------------------------
# Handle Missing Values
# -----------------------------
df.fillna(0, inplace=True)

# -----------------------------
# Encode Industry
# -----------------------------
industry_encoder = LabelEncoder()
df["industry"] = industry_encoder.fit_transform(df["industry"])

# -----------------------------
# Encode Business Model
# -----------------------------
business_encoder = LabelEncoder()
df["business_model"] = business_encoder.fit_transform(df["business_model"])

# -----------------------------
# Encode Competition Level
# -----------------------------
competition_encoder = LabelEncoder()
df["competition_level"] = competition_encoder.fit_transform(
    df["competition_level"]
)

# -----------------------------
# Remove Startup Name
# -----------------------------
df.drop("startup_name", axis=1, inplace=True)

print("\nProcessed Dataset Shape:")
print(df.shape)

print("\nProcessed Data Preview:")
print(df.head())

# -----------------------------
# Save Processed Dataset
# -----------------------------
df.to_csv(
    "data/processed/processed_startups.csv",
    index=False
)

print("\nProcessed Dataset Saved Successfully")

# Save encoders
joblib.dump(industry_encoder,"models/industry_encoder.pkl")

joblib.dump(business_encoder,"models/business_encoder.pkl")

joblib.dump(competition_encoder,"models/competition_encoder.pkl")

print("Encoders Saved Successfully")