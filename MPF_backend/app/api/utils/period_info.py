from typing import List

from sqlalchemy.orm import Session

from app.db.models.period_info import PeriodInfo
from app.schemas.period_info import PeriodInfoCreate


def get_single_period_info(db: Session, id: int):
    return db.query(PeriodInfo).filter(PeriodInfo.primary_key_id == id).all()


def get_period_info(db: Session, skip: int = 0, limit: int = 100):
    return db.query(PeriodInfo).offset(skip).limit(limit).all()


def create_period_info(
    db: Session, period_info: List[PeriodInfoCreate], primary_key_id: int
):
    for period_item in period_info:
        period_info_item = PeriodInfo(
            time_period=period_item.time_period,
            inventory_holding_cost=period_item.inventory_holding_cost,
            water_available_in_litres=period_item.water_available_in_litres,
            water_cost_per_litre=period_item.water_cost_per_litre,
            available_man_hours=period_item.available_man_hours,
            labour_cost_per_man_hour=period_item.labour_cost_per_man_hour,
            fertilizer_cost_per_kg=period_item.fertilizer_cost_per_kg,
            energy_cost_per_unit=period_item.energy_cost_per_unit,
            fertilizer_required_per_acre=period_item.fertilizer_required_per_acre,
            primary_key_id=primary_key_id,
        )
        db.add(period_info_item)

    db.commit()
    db.refresh(period_info_item)
    return period_info_item
