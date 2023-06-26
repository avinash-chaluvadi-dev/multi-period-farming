from sqlalchemy.orm import Session

from app.db.models.general_info import GeneralInfo
from app.schemas.general_info import GeneralInfoCreate


def get_single_general_info(db: Session, id: int):
    return db.query(GeneralInfo).filter(GeneralInfo.primary_key_id == id).all()


def get_general_info(db: Session, skip: int = 0, limit: int = 100):
    return db.query(GeneralInfo).offset(skip).limit(limit).all()


def create_general_info(
    db: Session, general_info: GeneralInfoCreate, primary_key_id: int
):
    for produce_item in general_info:
        general_info_item = GeneralInfo(
            produce=produce_item, primary_key_id=primary_key_id
        )
        db.add(general_info_item)
    db.commit()
    db.refresh(general_info_item)
    return general_info_item
