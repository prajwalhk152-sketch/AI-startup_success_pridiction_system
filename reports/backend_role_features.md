# Backend Role, Report, and Offer Features

This project now includes additive backend support for role-based project data. Existing prediction, analytics, reports, and frontend localStorage behavior are unchanged.

## Database Tables

- `app_users`: stores username, display name, password, and role mode (`founder`, `investor`, `admin`).
- `saved_reports`: stores saved startup reports as JSON for founders and investors to review.
- `investment_offers`: stores investor offers, founder counter offers, amount, equity, note, and status.

The API creates these tables automatically when `api/startup_api.py` starts.

## API Endpoints

### Users

- `GET /role-users`
- `POST /role-users`

Example body:

```json
{
  "username": "founder1",
  "display_name": "Founder One",
  "password": "pass123",
  "role_mode": "founder"
}
```

### Saved Reports

- `GET /saved-reports`
- `GET /saved-reports?username=Founder%20One`
- `POST /saved-reports`

Example body:

```json
{
  "id": "report-1",
  "username": "Founder One",
  "startup_name": "Demo AI",
  "industry_name": "AI",
  "description": "Demo startup report",
  "report": {
    "success_probability": 78,
    "risk_category": "Low Risk"
  }
}
```

### Investment Offers

- `GET /investment-offers`
- `GET /investment-offers?founder=Founder%20One`
- `GET /investment-offers?investor=Investor%20One`
- `POST /investment-offers`
- `PATCH /investment-offers`

Example create body:

```json
{
  "id": "offer-1",
  "startup_name": "Demo AI",
  "target_founder": "Founder One",
  "investor": "Investor One",
  "amount": 250000,
  "equity": 8,
  "note": "Interested after reviewing the report.",
  "status": "Pending"
}
```

Example update body:

```json
{
  "id": "offer-1",
  "amount": 300000,
  "equity": 6,
  "status": "Counter Offered"
}
```
