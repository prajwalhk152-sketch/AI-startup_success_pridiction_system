from pathlib import Path
import subprocess
import sys


ROOT_DIR = Path(__file__).resolve().parents[1]
PYTHON = sys.executable

PIPELINE_MODULES = [
    "modules/module_3_dataset_collection.py",
    "modules/module_4_data_processing.py",
    "modules/module_5_profile_analysis.py",
    "modules/module_6_success_prediction.py",
    "modules/module_7_funding_recommendation.py",
    "modules/module_8_market_analysis.py",
    "modules/module_9_competitor_analysis.py",
    "modules/module_10_growth_forecasting.py",
    "modules/module_11_risk_assessment.py",
    "modules/module_12_database_storage.py",
    "modules/module_13_api_integration.py",
]


def main():
    for module_path in PIPELINE_MODULES:
        print(f"\nRunning {module_path}")
        result = subprocess.run([PYTHON, module_path], cwd=ROOT_DIR)
        if result.returncode != 0:
            print(f"Pipeline stopped: {module_path} failed.")
            return result.returncode

    print("\nAll project modules completed successfully.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
