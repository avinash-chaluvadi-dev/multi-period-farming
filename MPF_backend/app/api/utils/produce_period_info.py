from sqlalchemy.orm import Session

from app.db.models.produce_period_info import ProducePeriodInfo
from app.schemas.produce_period_info import ProducePeriodCreate


def create_produce_period_info(
    db: Session, produce_period_file: ProducePeriodCreate, primary_key_id: int
):

    produce_period_info_item = ProducePeriodInfo(
        produce_period_file=produce_period_file, primary_key_id=primary_key_id
    )
    db.add(produce_period_info_item)
    db.commit()
    db.refresh(produce_period_info_item)
    return produce_period_info_item
