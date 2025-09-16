from django.conf import settings
import requests
import time

HUGGINGFACE_API_URL = settings.HUGGINGFACE_API
API_TOKEN = settings.HF_API_TOKEN

headers = {"Authorization": f"Bearer {API_TOKEN}"}


def summarize_text(text: str) -> str:
    payload = {"inputs": text}
    
    for attempt in range(3): 
        try:
            response = requests.post(HUGGINGFACE_API_URL, headers=headers, json=payload, timeout=30)
            response.raise_for_status()
            result = response.json()

            if isinstance(result, list) and "summary_text" in result[0]:
                return result[0]["summary_text"]

        except requests.RequestException as e:
            if attempt < 2:  
                time.sleep(2)  
                continue
            return f"Request failed after 3 attempts: {e}"

    return "Summary could not be generated."
