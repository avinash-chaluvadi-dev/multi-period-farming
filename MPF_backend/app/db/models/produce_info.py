from sqlalchemy import Column, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from ..db_setup import Base


class ProduceInfo(Base):
    __tablename__ = "produce_info"

    id = Column(Integer, primary_key=True, index=True)
    produce = Column(String)
    time_to_harvest = Column(Integer)
    lead_time_to_purchase = Column(Integer)
    man_hours_required_per_acre = Column(Float)
    fraction_lost_per_period = Column(Float)

    primary_key_id = Column(
        Integer, ForeignKey("primary_keys.id"), nullable=False, index=True
    )
    primary_key_produce = relationship("PrimaryKey", back_populates="produce_info")
