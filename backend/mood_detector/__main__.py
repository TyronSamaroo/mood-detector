"""
Main entry point for the Mood Detector application.
This file allows running the package directly with:
poetry run python -m mood_detector
"""
import uvicorn
from mood_detector.app import app

if __name__ == "__main__":
    print("Starting Mood Detector API...")
    print("API will be available at http://localhost:8000")
    print("Press Ctrl+C to exit")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
