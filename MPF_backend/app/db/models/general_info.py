from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from ..db_setup import Base
from .mixins import Timestamp


class PrimaryKey(Timestamp, Base):
    __tablename__ = "primary_keys"

    id = Column(Integer, primary_key=True, index=True)
    time_periods = Column(Integer)
    total_land_area_available = Column(Integer)

    general_info = relationship("GeneralInfo", back_populates="primary_key")
    produce_info = relationship(
        "ProduceInfo", back_populates="primary_key_produce", uselist=False
    )
    produce_period_info = relationship(
        "ProducePeriodInfo", back_populates="produce_primary_key"
    )
    period_info = relationship("PeriodInfo", back_populates="period_primary_key")


class GeneralInfo(Timestamp, Base):
    __tablename__ = "general_info"

    id = Column(Integer, primary_key=True, index=True)
    produce = Column(String)
    primary_key_id = Column(Integer, ForeignKey("primary_keys.id"), nullable=False)

    primary_key = relationship("PrimaryKey", back_populates="general_info")
