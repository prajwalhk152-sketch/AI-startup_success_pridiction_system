import joblib
import pandas as pd

# Load trained model
model = joblib.load("models/success_prediction_model.pkl")

# Sample startup input
sample_startup = pd.DataFrame([{
    "industry": 4,
    "funding_amount": 600000,
    "team_size": 30,
    "revenue": 1500000,
    "market_size": 60000000,
    "founder_experience": 6,
    "business_model": 0,
    "competition_level": 2,
    "customer_growth": 40
}])

# Prediction
prediction = model.predict(sample_startup)
probability = model.predict_proba(sample_startup)

if prediction[0] == 1:
    result = "Successful Startup"
else:
    result = "Not Successful Startup"

print("Prediction Result:", result)
print("Success Probability:", round(probability[0][1] * 100, 2), "%")