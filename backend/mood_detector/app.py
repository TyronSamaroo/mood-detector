from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from textblob import TextBlob
import nltk
import os

# Download NLTK data if not already downloaded
try:
    nltk.data.find('corpora/brown')
    nltk.data.find('tokenizers/punkt')
except LookupError:
    # Create directory for NLTK data if it doesn't exist
    nltk_data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'nltk_data')
    os.makedirs(nltk_data_path, exist_ok=True)
    nltk.data.path.append(nltk_data_path)
    
    # Download required NLTK data
    nltk.download('punkt', download_dir=nltk_data_path)
    nltk.download('brown', download_dir=nltk_data_path)
    nltk.download('averaged_perceptron_tagger', download_dir=nltk_data_path)

app = FastAPI(title="Mood Detector API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextInput(BaseModel):
    text: str

class MoodResponse(BaseModel):
    text: str
    mood: str
    confidence: float

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/mood", response_model=MoodResponse)
async def analyze_mood(input_data: TextInput):
    if not input_data.text:
        raise HTTPException(status_code=400, detail="No text provided")
    
    # Use TextBlob for sentiment analysis
    analysis = TextBlob(input_data.text)
    
    # Determine mood based on polarity
    polarity = analysis.sentiment.polarity
    subjectivity = analysis.sentiment.subjectivity
    
    # Enhanced mood detection logic
    if polarity > 0.5:
        mood = "very happy"
    elif polarity > 0.1:
        mood = "happy"
    elif polarity > -0.1:
        mood = "neutral"
    elif polarity > -0.5:
        mood = "sad"
    else:
        mood = "very sad"
    
    # Add nuance based on subjectivity
    if subjectivity > 0.7 and mood in ["very happy", "happy"]:
        mood = "excited"
    elif subjectivity > 0.7 and mood in ["sad", "very sad"]:
        mood = "angry"
    
    # Calculate simple confidence based on subjectivity
    # Higher subjectivity often means more emotional content to detect
    confidence = 0.5 + (subjectivity * 0.5)
    
    return MoodResponse(
        text=input_data.text,
        mood=mood,
        confidence=confidence
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
