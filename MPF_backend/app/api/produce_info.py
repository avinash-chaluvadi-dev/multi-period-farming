from typing import List

import fastapi
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.db_setup import get_db
from app.db.models.general_info import GeneralInfo, PrimaryKey
from app.schemas.produce_info import ProduceInfo, ProduceInfoBase

from .utils.produce_info import (
    create_produce_info,
    get_produce_info,
    get_single_produce_info,
)

router = fastapi.APIRouter()


@router.get(
    "/produce_info",
    tags=["Multi Period Farming Produce Info"],
    response_model=List[ProduceInfo],
)
async def read_produce_info(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    produce_info_items = get_produce_info(db=db, skip=skip, limit=limit)
    return produce_info_items


@router.post(
    "/produce_info",
    response_model=List[ProduceInfoBase],
    tags=["Multi Period Farming Produce Info"],
)
async def create_new_produce_info(
    produce_info: List[ProduceInfoBase], db: Session = Depends(get_db)
):
    latest_record = db.query(PrimaryKey).order_by(PrimaryKey.id.desc()).first()
    general_info_relation = db.query(GeneralInfo).filter(
        GeneralInfo.primary_key_id == latest_record.id
    )
    create_produce_info(
        db=db, produce_info=produce_info, primary_key_id=latest_record.id
    )
    return produce_info


@router.get(
    "/produce_info/{id}",
    response_model=ProduceInfo,
    tags=["Multi Period Farming Produce Info"],
)
async def read_single_produce_info(id: int, db: Session = Depends(get_db)):
    produce_info_item = get_single_produce_info(db=db, id=id)
    if produce_info_item is None:
        raise HTTPException(status_code=404, detail="Produce Info record not found")
    return produce_info_item
