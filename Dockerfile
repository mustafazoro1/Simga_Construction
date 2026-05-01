FROM python:3.11-slim

WORKDIR /app

COPY artifacts/api-server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install uvicorn

COPY artifacts/api-server/ .

# Hugging Face Spaces expose port 7860
ENV PORT=7860
EXPOSE 7860

# We bind to 0.0.0.0 and port 7860 as expected by HF Spaces
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
