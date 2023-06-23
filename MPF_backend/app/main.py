from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import (
    general_info,
    optimize,
    period_info,
    produce_info,
    produce_period_info,
)
from app.db.db_setup import engine
from app.db.models import general_info as db_general_info
from app.db.models import period_info as db_period_info
from app.db.models import produce_info as db_produce_info
from app.db.models import produce_period_info as db_produce_period_info

db_general_info.Base.metadata.create_all(bind=engine)
db_period_info.Base.metadata.create_all(bind=engine)
db_produce_info.Base.metadata.create_all(bind=engine)
db_produce_period_info.Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Multi Period Farming",
    description="Optimization for Multi Period Farming",
    version="0.0.1",
    contact={
        "name": "Avinash, Chaluvadi",
        "email": "acfy8@umsystem.edu",
    },
    license_info={
        "name": "MIT",
    },
)

origins = ["*"]

# Add the CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
app.include_router(general_info.router)
app.include_router(produce_info.router)
app.include_router(produce_period_info.router)
app.include_router(period_info.router)
app.include_router(optimize.router)


@app.get("/ping", tags=["Status Check"])
async def ping():
    return {"status": "Alive"}
