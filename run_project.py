from __future__ import annotations

import subprocess
import sys
import time
import webbrowser
from pathlib import Path


ROOT = Path(__file__).resolve().parent
FRONTEND = ROOT / "ai-startup-frontend"
PYTHON = ROOT / ".venv" / "Scripts" / "python.exe"
VITE = FRONTEND / "node_modules" / ".bin" / "vite.cmd"


def command_exists(path: Path) -> str:
    return str(path) if path.exists() else path.name


def start_process(name: str, args: list[str], cwd: Path) -> subprocess.Popen:
    print(f"Starting {name}...")
    return subprocess.Popen(args, cwd=str(cwd))


def main() -> int:
    open_browser = "--no-browser" not in sys.argv
    python_exe = command_exists(PYTHON)
    vite_exe = command_exists(VITE)

    api = start_process("Flask API", [python_exe, "api/startup_api.py"], ROOT)
    frontend = start_process(
        "React frontend",
        [vite_exe, "--host", "127.0.0.1", "--port", "5173"],
        FRONTEND,
    )

    print()
    print("Project is starting. Keep this window open.")
    print("API:      http://127.0.0.1:5000")
    print("Frontend: http://127.0.0.1:5173")
    print("Press Ctrl+C here to stop both servers.")

    time.sleep(4)
    if open_browser:
        webbrowser.open("http://127.0.0.1:5173")

    try:
        while True:
            if api.poll() is not None:
                print("Flask API stopped. Check the messages above for the error.")
                return api.returncode or 1
            if frontend.poll() is not None:
                print("React frontend stopped. Check the messages above for the error.")
                return frontend.returncode or 1
            time.sleep(1)
    except KeyboardInterrupt:
        print("Stopping servers...")
        api.terminate()
        frontend.terminate()
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
