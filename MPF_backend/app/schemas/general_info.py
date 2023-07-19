from typing import List

from pydantic import BaseModel


class PrimaryKeyBase(BaseModel):
    produce: List[str]
    time_periods: int
    instance_name: str
    total_land_area_available: int


class GeneralInfoCreate(BaseModel):
    id: int
    produce: List[str]
    time_periods: int


class GeneralInfo(BaseModel):
    id: int
    produce: str

    class Config:
        orm_mode = True
