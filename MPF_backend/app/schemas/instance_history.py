from datetime import datetime
from typing import List

from pydantic import BaseModel


class InstanceHistory(BaseModel):
    instance_name: str
    created_at: datetime

    class Config:
        orm_mode = True


class InstanceHistoryPrimary(BaseModel):
    id: int
    time_periods: int
    total_land_area_available: int

    class Config:
        orm_mode = True


# class InstanceHistory(BaseModel):
#     id: int
#     class Config:
#         orm_mode = True
