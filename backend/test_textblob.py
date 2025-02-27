from textblob import TextBlob

# Test sentences
sentences = [
    "I am feeling very happy today!",
    "I am so excited about this project!",
    "This is a neutral statement about the weather.",
    "I'm feeling a bit sad today.",
    "I'm extremely angry about what happened!"
]

for sentence in sentences:
    analysis = TextBlob(sentence)
    polarity = analysis.sentiment.polarity
    subjectivity = analysis.sentiment.subjectivity
    
    print(f"Text: {sentence}")
    print(f"Polarity: {polarity} (Range: -1 to 1, negative to positive)")
    print(f"Subjectivity: {subjectivity} (Range: 0 to 1, objective to subjective)")
    
    # Determine mood
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
    
    print(f"Detected mood: {mood}")
    print("---")
