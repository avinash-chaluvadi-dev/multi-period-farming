from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from ..db_setup import Base
from .mixins import Timestamp


class ProducePeriodInfo(Timestamp, Base):
    __tablename__ = "produce_period_info"

    id = Column(Integer, primary_key=True, index=True)
    produce_period_file = Column(String)
    primary_key_id = Column(Integer, ForeignKey("primary_keys.id"), nullable=False)

    produce_primary_key = relationship(
        "PrimaryKey", back_populates="produce_period_info"
    )
