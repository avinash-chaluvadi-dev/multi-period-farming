from typing import List

import fastapi
from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.db_setup import get_db
from app.db.models.general_info import PrimaryKey
from app.schemas.instance_history import InstanceHistory, InstanceHistoryPrimary

from .utils.general_info import get_instance_history

router = fastapi.APIRouter()


@router.get(
    "/instance_history",
    tags=["Multi Period Farming Instance History"],
    response_model=List[InstanceHistory],
)
async def read_instance_history(db: Session = Depends(get_db)):
    instance_history = get_instance_history(db=db)
    return instance_history


@router.get(
    "/instance_history/primary_key",
    tags=["Multi Period Farming Instance History"],
    response_model=InstanceHistoryPrimary
)
async def read_primary_key(instance_name: str, db: Session = Depends(get_db)):
    return (
        db.query(PrimaryKey).filter(PrimaryKey.instance_name == instance_name).first()
    )
