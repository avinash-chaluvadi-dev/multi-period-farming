from typing import List

import fastapi
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.db_setup import get_db
from app.db.models.general_info import PrimaryKey
from app.schemas.general_info import GeneralInfo, GeneralInfoCreate, PrimaryKeyBase

from .utils.general_info import (
    create_general_info,
    get_general_info,
    get_single_general_info,
)

router = fastapi.APIRouter()


@router.get(
    "/general_info",
    tags=["Multi Period Farming General Info"],
    response_model=List[GeneralInfo],
)
async def read_general_info(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    general_info_items = get_general_info(db=db, skip=skip, limit=limit)
    return general_info_items


@router.post(
    "/general_info",
    response_model=GeneralInfoCreate,
    tags=["Multi Period Farming General Info"],
)
async def create_new_general_info(
    general_info: PrimaryKeyBase, db: Session = Depends(get_db)
):
    parent_item = PrimaryKey(
        time_periods=general_info.time_periods,
        total_land_area_available=general_info.total_land_area_available,
    )
    db.add(parent_item)
    db.flush()

    create_general_info(
        db=db, general_info=general_info.produce, primary_key_id=parent_item.id
    )
    return general_info


@router.get(
    "/general_info{id}",
    response_model=List[GeneralInfo],
    tags=["Multi Period Farming General Info"],
)
async def read_single_general_info(id: int, db: Session = Depends(get_db)):
    general_info_item = get_single_general_info(db=db, id=id)
    if general_info_item is None:
        raise HTTPException(status_code=404, detail="General Info record not found")
    return general_info_item
