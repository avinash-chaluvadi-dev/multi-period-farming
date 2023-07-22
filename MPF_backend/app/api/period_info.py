from typing import List

import fastapi
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.db_setup import get_db
from app.db.models.general_info import GeneralInfo, PrimaryKey
from app.db.models.period_info import PeriodInfo as PeriodInfoModel
from app.schemas.period_info import PeriodInfo, PeriodInfoCreate

from .utils.period_info import (
    create_period_info,
    get_period_info,
    get_single_period_info,
)

router = fastapi.APIRouter()


@router.get(
    "/period_info",
    tags=["Multi Period Farming Period Info"],
    response_model=List[PeriodInfo],
)
async def read_period_info(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    produce_info_items = get_period_info(db=db, skip=skip, limit=limit)
    return produce_info_items


@router.post(
    "/period_info",
    response_model=List[PeriodInfoCreate],
    tags=["Multi Period Farming Period Info"],
)
async def create_new_period_info(
    period_info: List[PeriodInfoCreate], db: Session = Depends(get_db)
):
    latest_record = db.query(PrimaryKey).order_by(PrimaryKey.id.desc()).first()

    create_period_info(db=db, period_info=period_info, primary_key_id=latest_record.id)
    return period_info


@router.get(
    "/period_info/{id}",
    response_model=List[PeriodInfo],
    tags=["Multi Period Farming Period Info"],
)
async def read_single_period_info(id: int, db: Session = Depends(get_db)):
    produce_info_item = get_single_period_info(db=db, id=id)
    if produce_info_item is None:
        raise HTTPException(status_code=404, detail="Period Info record not found")
    return produce_info_item


@router.patch(
    "/period_info/{id}",
    tags=["Multi Period Farming Period Info"],
)
async def patch_period_info(
    id: int, period_info: List[PeriodInfoCreate], db: Session = Depends(get_db)
):
    db.query(PeriodInfoModel).filter(PeriodInfoModel.primary_key_id == id).delete()
    create_period_info(db=db, period_info=period_info, primary_key_id=id)
    db.commit()
