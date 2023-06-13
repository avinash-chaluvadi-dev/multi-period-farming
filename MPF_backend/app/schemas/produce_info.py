from typing import List

from pydantic import BaseModel


class ProduceInfoBase(BaseModel):
    produce: str
    time_to_harvest: int
    lead_time_to_purchase: int
    man_hours_required_per_acre: float
    fraction_lost_per_period: float


class ProduceInfoCreate(ProduceInfoBase):
    ...


class ProduceInfo(ProduceInfoBase):
    id: int

    class Config:
        orm_mode = True
