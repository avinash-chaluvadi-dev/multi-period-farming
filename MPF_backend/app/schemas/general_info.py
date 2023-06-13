from typing import List

from pydantic import BaseModel


class PrimaryKeyBase(BaseModel):
    produce: List[str]
    time_periods: int
    total_land_area_available: int


class GeneralInfoCreate(PrimaryKeyBase):
    ...


class GeneralInfo(BaseModel):
    id: int
    produce: str

    class Config:
        orm_mode = True
