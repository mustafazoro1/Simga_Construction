FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements from the subdirectory
COPY artifacts/api-server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend app code from the subdirectory
COPY artifacts/api-server/ .

# Railway provides the PORT environment variable
ENV PORT=8080
EXPOSE 8080

CMD python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
