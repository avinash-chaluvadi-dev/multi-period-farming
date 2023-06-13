from pydantic import BaseModel


class PeriodInfoBase(BaseModel):
    time_period: int
    inventory_holding_cost: float
    water_available_in_litres: int
    water_cost_per_litre: float
    available_man_hours: int
    labour_cost_per_man_hour: float
    fertilizer_cost_per_kg: int
    energy_cost_per_unit: int
    fertilizer_required_per_acre: int


class PeriodInfoCreate(PeriodInfoBase):
    ...


class PeriodInfo(PeriodInfoBase):
    id: int

    class Config:
        orm_mode = True
