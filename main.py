from fastapi import FastAPI
import psycopg2
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

# Allow frontend requests (adjust origin if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redshift connection details from .env
conn_params = {
    "host": os.getenv("REDSHIFT_HOST"),
    "port": os.getenv("REDSHIFT_PORT"),
    "dbname": os.getenv("REDSHIFT_DB"),
    "user": os.getenv("REDSHIFT_USER"),
    "password": os.getenv("REDSHIFT_PASSWORD"),
}

def get_data_from_redshift(view_name: str):
    try:
        conn = psycopg2.connect(**conn_params)
        cursor = conn.cursor()
        cursor.execute(f"SELECT * FROM {view_name}")
        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        result = [dict(zip(columns, row)) for row in rows]
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        return {"error": str(e)}

@app.get("/contacts")
def get_contacts():
    return get_data_from_redshift("vw_monitoring_tool_hs_contact")

@app.get("/deals")
def get_deals():
    return get_data_from_redshift("vw_monitoring_tool_hs_deals")
