from sqlalchemy import Column, Float, ForeignKey, Integer
from sqlalchemy.orm import relationship

from ..db_setup import Base


class PeriodInfo(Base):
    __tablename__ = "period_info"

    id = Column(Integer, primary_key=True, index=True)
    time_period = Column(Integer)
    inventory_holding_cost = Column(Float)
    water_available_in_litres = Column(Integer)
    water_cost_per_litre = Column(Float)
    available_man_hours = Column(Integer)
    labour_cost_per_man_hour = Column(Float)
    fertilizer_cost_per_kg = Column(Integer)
    energy_cost_per_unit = Column(Integer)
    fertilizer_required_per_acre = Column(Integer)

    primary_key_id = Column(Integer, ForeignKey("primary_keys.id"), nullable=False)
    period_primary_key = relationship("PrimaryKey", back_populates="period_info")
