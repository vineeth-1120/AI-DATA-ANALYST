import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key or api_key == "your_gemini_api_key_here":
    print("Error: GEMINI_API_KEY is not set or is still the default placeholder.")
    print("Please set your real API key in the .env file.")
    exit(1)

genai.configure(api_key=api_key)

try:
    model = genai.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content("Hello, this is a test to verify API connectivity.")
    print("Gemini API Connection Successful!")
    print("Response:", response.text)
except Exception as e:
    print("Gemini API Error:", str(e))
