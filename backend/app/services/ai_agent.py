import pandas as pd
from typing import Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from app.core.config import settings

# Initialize Gemini LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",
    google_api_key=settings.GEMINI_API_KEY,
    temperature=0.2
)

def get_dataset_summary(df: pd.DataFrame) -> str:
    """Generate a summary of the dataset to provide context to the LLM."""
    buffer = []
    buffer.append(f"Number of rows: {len(df)}")
    buffer.append(f"Number of columns: {len(df.columns)}")
    buffer.append("Columns and data types:")
    for col, dtype in df.dtypes.items():
        buffer.append(f"- {col}: {dtype}")
    return "\n".join(buffer)

def process_query(df: pd.DataFrame, query: str) -> Dict[str, Any]:
    """Process a user query against the dataframe."""
    summary = get_dataset_summary(df)
    
    prompt = PromptTemplate.from_template(
        "You are an expert AI data analyst. You have a dataset with the following schema:\n"
        "{summary}\n\n"
        "User query: {query}\n\n"
        "Analyze the query and provide a response in two parts:\n"
        "1. 'text': A detailed, plain english explanation of the insights.\n"
        "2. 'chart_data': If the query implies a visualization (e.g., trends, comparisons, distributions), provide the exact JSON structure for Recharts. If no chart is needed, return null for chart_data.\n"
        "JSON structure for Recharts should have 'type' (bar, line, pie), 'xAxisKey', and 'data' (array of objects).\n\n"
        "Return ONLY a valid JSON object with 'text' and 'chart_data' keys. Do not include markdown formatting or backticks."
    )
    
    chain = prompt | llm
    
    try:
        response = chain.invoke({"summary": summary, "query": query})
        import json
        
        # Clean up response if it contains markdown JSON blocks
        response_text = response.content.strip()
        if response_text.startswith('```json'):
            response_text = response_text[7:-3]
        elif response_text.startswith('```'):
            response_text = response_text[3:-3]
            
        result = json.loads(response_text)
        return result
    except Exception as e:
        print(f"Gemini API Error: {str(e)}")
        raise Exception(f"Gemini API Error: {str(e)}")
