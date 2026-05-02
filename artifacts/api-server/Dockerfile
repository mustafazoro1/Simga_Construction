FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for postgres/psycopg
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Port is provided by Railway/hosting via the PORT env var
ENV PORT=8080
EXPOSE 8080

CMD python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
