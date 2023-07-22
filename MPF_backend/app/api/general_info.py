from typing import List

import fastapi
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.db_setup import get_db
from app.db.models.general_info import GeneralInfo as GeneralInfoModel
from app.db.models.general_info import PrimaryKey
from app.db.models.produce_info import ProduceInfo as ProduceInfoModel
from app.schemas.general_info import GeneralInfo, GeneralInfoCreate, PrimaryKeyBase

from .utils.general_info import (
    create_general_info,
    get_general_info,
    get_single_general_info,
)

router = fastapi.APIRouter()


@router.get(
    "/general_info",
    response_model=List[GeneralInfo],
    tags=["Multi Period Farming General Info"],
)
async def read_general_info(skip: int = 0, db: Session = Depends(get_db)):
    general_info_items = get_general_info(db=db, skip=skip)
    return general_info_items


@router.post(
    "/general_info",
    response_model=GeneralInfoCreate,
    tags=["Multi Period Farming General Info"],
)
async def create_new_general_info(
    general_info: PrimaryKeyBase, db: Session = Depends(get_db)
):
    general_info_response = {}
    parent_item = PrimaryKey(
        instance_name=general_info.instance_name,
        time_periods=general_info.time_periods,
        total_land_area_available=general_info.total_land_area_available,
    )
    db.add(parent_item)
    db.flush()

    create_general_info(
        db=db, general_info=general_info.produce, primary_key_id=parent_item.id
    )
    general_info_response["id"] = parent_item.id
    general_info_response["produce"] = general_info.produce
    general_info_response["time_periods"] = general_info.time_periods
    return general_info_response


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


@router.patch(
    "/general_info/{id}",
    tags=["Multi Period Farming General Info"],
)
async def patch_general_info(
    id: int, general_info: PrimaryKeyBase, db: Session = Depends(get_db)
):
    db.query(GeneralInfoModel).filter(GeneralInfoModel.primary_key_id == id).delete()
    primary_key_item = db.query(PrimaryKey).filter(PrimaryKey.id == id).first()
    primary_key_item.time_periods = general_info.time_periods
    primary_key_item.total_land_area_available = general_info.total_land_area_available
    db.commit()

    create_general_info(db=db, general_info=general_info.produce, primary_key_id=id)

    produce_items = (
        db.query(ProduceInfoModel).filter(ProduceInfoModel.primary_key_id == id).all()
    )
    existing_produce = [item.produce for item in produce_items]
    print(produce_items)
    for produce in general_info.produce:
        if produce not in existing_produce:
            new_produce = ProduceInfoModel(
                produce=produce,
                primary_key_id=id,
                time_to_harvest=0,
                lead_time_to_purchase=0,
                man_hours_required_per_acre=0,
                fraction_lost_per_period=0,
            )
            db.add(new_produce)
    db.commit()
