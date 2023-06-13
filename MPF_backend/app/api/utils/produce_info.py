from sqlalchemy.orm import Session

from app.db.models.produce_info import ProduceInfo
from app.schemas.produce_info import ProduceInfoCreate


def get_single_produce_info(db: Session, id: int):
    return db.query(ProduceInfo).filter(ProduceInfo.id == id).first()


def get_produce_info(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ProduceInfo).offset(skip).limit(limit).all()


def create_produce_info(
    db: Session, produce_info: ProduceInfoCreate, primary_key_id: int
):
    for produce_item in produce_info:
        produce_info_item = ProduceInfo(
            produce=produce_item.produce,
            time_to_harvest=produce_item.time_to_harvest,
            lead_time_to_purchase=produce_item.lead_time_to_purchase,
            man_hours_required_per_acre=produce_item.man_hours_required_per_acre,
            fraction_lost_per_period=produce_item.fraction_lost_per_period,
            primary_key_id=primary_key_id,
        )
        db.add(produce_info_item)
    db.commit()
    db.refresh(produce_info_item)
    return produce_info_item
