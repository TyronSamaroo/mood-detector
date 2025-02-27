"""
Helper script to run the Mood Detector API.
This makes it easier to run with Poetry.
"""
import os
import sys

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

if __name__ == "__main__":
    import uvicorn
    from mood_detector.app import app
    
    print("Starting Mood Detector API...")
    print("API will be available at http://localhost:8000")
    print("Press Ctrl+C to exit")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
