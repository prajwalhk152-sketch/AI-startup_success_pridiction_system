from pathlib import Path
import sys


ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from api.startup_api import app


REPORT_PATH = ROOT_DIR / "reports" / "module13_api_integration_report.txt"

REQUIRED_STARTUP_FIELDS = {
    "startup_name",
    "performance_status",
    "industry",
    "funding_amount",
    "team_size",
    "revenue",
    "market_size",
    "founder_experience",
    "business_model",
    "competition_level",
    "customer_growth",
    "success",
    "profile_score",
    "profile_category",
    "recommended_funding_stage",
    "investment_requirement",
    "investor_interest",
    "market_score",
    "market_potential",
    "competitor_count",
    "competition_category",
    "competitive_advantage_score",
    "competitive_advantage",
    "growth_score",
    "growth_forecast",
    "projected_revenue_growth_percent",
    "expected_user_growth_percent",
    "risk_score",
    "risk_category",
}


def check_status(client, method, path, expected=200, json=None):
    response = getattr(client, method)(path, json=json)
    passed = response.status_code == expected
    return {
        "name": f"{method.upper()} {path}",
        "passed": passed,
        "status": response.status_code,
        "expected": expected,
        "json": response.get_json(silent=True),
    }


def run_api_integration_checks():
    checks = []

    with app.test_client() as client:
        checks.append(check_status(client, "get", "/"))
        checks.append(check_status(client, "get", "/metadata"))
        checks.append(check_status(client, "get", "/startup-data"))
        checks.append(check_status(client, "get", "/summary"))
        checks.append(check_status(client, "get", "/funding-report"))
        checks.append(check_status(client, "get", "/market-report"))
        checks.append(check_status(client, "get", "/competitor-report"))
        checks.append(check_status(client, "get", "/growth-report"))
        checks.append(check_status(client, "get", "/risk-report"))
        checks.append(check_status(client, "get", "/waiting-startups"))
        checks.append(check_status(client, "get", "/role-users"))
        checks.append(check_status(client, "get", "/saved-reports"))
        checks.append(check_status(client, "get", "/investment-offers"))

        prediction_payload = {
            "industry": 6,
            "funding_amount": 500000,
            "team_size": 18,
            "revenue": 750000,
            "market_size": 65000000,
            "founder_experience": 5,
            "business_model": 0,
            "competition_level": 2,
            "customer_growth": 32,
        }
        checks.append(check_status(client, "post", "/predict", json=prediction_payload))

    startup_data = next((item["json"] for item in checks if item["name"] == "GET /startup-data"), [])
    metadata = next((item["json"] for item in checks if item["name"] == "GET /metadata"), {})
    prediction = next((item["json"] for item in checks if item["name"] == "POST /predict"), {})

    field_check = {
        "name": "startup-data required analysis fields",
        "passed": bool(startup_data) and REQUIRED_STARTUP_FIELDS.issubset(set(startup_data[0].keys())),
        "status": "checked",
        "expected": "all module 3-12 fields",
        "json": None,
    }
    checks.append(field_check)

    metadata_check = {
        "name": "metadata encoder options",
        "passed": all(metadata.get(key) for key in ["industries", "business_models", "competition_levels"]),
        "status": "checked",
        "expected": "industries, business_models, competition_levels",
        "json": None,
    }
    checks.append(metadata_check)

    prediction_check = {
        "name": "prediction response contract",
        "passed": isinstance(prediction, dict)
        and "prediction" in prediction
        and "success_probability" in prediction,
        "status": "checked",
        "expected": "prediction and success_probability",
        "json": None,
    }
    checks.append(prediction_check)

    return checks


def write_report(checks):
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    passed_count = sum(1 for check in checks if check["passed"])
    lines = [
        "Module 13 - API Integration Report",
        "=" * 36,
        f"Checks passed: {passed_count}/{len(checks)}",
        "",
        "Endpoint and contract checks:",
    ]

    for check in checks:
        result = "PASS" if check["passed"] else "FAIL"
        lines.append(
            f"- {result}: {check['name']} "
            f"(status: {check['status']}, expected: {check['expected']})"
        )

    lines.extend(
        [
            "",
            "Integrated project modules:",
            "- 3 Startup Dataset Collection",
            "- 4 Startup Data Processing",
            "- 5 Startup Profile Analysis",
            "- 6 Startup Success Prediction Engine",
            "- 7 Funding Recommendation System",
            "- 8 Market Analysis Engine",
            "- 9 Competitor Analysis System",
            "- 10 Growth Forecasting Engine",
            "- 11 Startup Risk Assessment",
            "- 12 Database & Startup Storage",
            "- 13 API Integration",
        ]
    )
    REPORT_PATH.write_text("\n".join(lines), encoding="utf-8")
    return REPORT_PATH


if __name__ == "__main__":
    results = run_api_integration_checks()
    report_path = write_report(results)
    passed = sum(1 for item in results if item["passed"])
    print(f"API integration checks passed: {passed}/{len(results)}")
    print(f"Report saved: {report_path}")
    if passed != len(results):
        raise SystemExit(1)
