import boto3
import requests
import time
from django.conf import settings

HUGGINGFACE_API_URL = settings.HUGGINGFACE_API


def get_huggingface_token() -> str:
    """Read Hugging Face token from AWS Parameter Store (with decryption)."""
    aws_client = boto3.client("ssm", region_name="us-east-1")
    response = aws_client.get_parameter(
        Name="/summarize/post", 
        WithDecryption=True
    )
    return response["Parameter"]["Value"]

def summarize_text(text: str) -> str:
    """Summarize text using Hugging Face API with retries."""
    token = get_huggingface_token()
    headers = {"Authorization": f"Bearer {token}"}
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