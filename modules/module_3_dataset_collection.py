"""Collect Startup Data
        ↓
Create CSV Dataset
        ↓
Load Dataset
        ↓
Check Dataset
        ↓
Verify Missing Values
        ↓
Generate Statistics
        ↓
Visualize Dataset
        ↓
Save Dataset Report"""
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
# Load Dataset
df = pd.read_csv("data/raw/startups.csv")

print("Dataset Loaded Successfully")
print("\nFirst 5 Records:\n")
print(df.head())

print("\nDataset Shape:")
print(df.shape)

print("\nColumn Names:")
print(df.columns)

print("\nDataset Information:")
print(df.info())

print("\nMissing Values:")
print(df.isnull().sum())

print("\nDataset Statistics:")
print(df.describe())

sns.countplot(x='success', data=df)

plt.title("Startup Success Distribution")
plt.show()