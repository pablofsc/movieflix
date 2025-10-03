FROM python:3.11-slim

WORKDIR /etl

RUN pip install --no-cache-dir pandas sqlalchemy psycopg2-binary

COPY load.py /etl/load.py
COPY data_mart.sql /etl/data_mart.sql

CMD ["python", "load.py"]
