import pandas as pd
import sqlite3
import os

# Create database folder if it does not exist
os.makedirs("database", exist_ok=True)

# Load final processed data from Module 11
df = pd.read_csv("data/processed/risk_assessment.csv")

# Connect to SQLite database
conn = sqlite3.connect("database/startups.db")

# Store dataframe into database table
df.to_sql("startup_analysis", conn, if_exists="replace", index=False)

print("Startup data stored in database successfully!")

# Read data back from database to verify
query = "SELECT * FROM startup_analysis LIMIT 5"
result = pd.read_sql_query(query, conn)

print("\nFirst 5 records from database:")
print(result)

# Close connection
conn.close()