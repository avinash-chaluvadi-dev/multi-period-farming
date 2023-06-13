from fastapi import UploadFile
from pydantic import BaseModel


class ProducePeriodBase(BaseModel):
    produce_period_file: str


class ProducePeriodCreate(ProducePeriodBase):
    ...
