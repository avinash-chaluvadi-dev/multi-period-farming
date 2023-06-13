import json

import fastapi
from fastapi import Depends, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from pandas import read_excel
from sqlalchemy.orm import Session

from app.db.db_setup import get_db
from app.db.models.general_info import PrimaryKey
from app.db.models.produce_period_info import ProducePeriodInfo

from .utils.produce_period_info import create_produce_period_info

router = fastapi.APIRouter()


@router.post(
    "/produce_period_info",
    tags=["Multi Period Farming Produce Period Info"],
)
async def create_new_produce_period_info(
    file: UploadFile = File(...), db: Session = Depends(get_db)
):
    try:
        contents = await file.read()

        latest_record = db.query(PrimaryKey).order_by(PrimaryKey.id.desc()).first()
        produce_period_file = f"input/produce_period_info_{latest_record.id}.xls"

        with open(produce_period_file, "wb") as f:
            f.write(contents)

        create_produce_period_info(
            db=db,
            produce_period_file=produce_period_file,
            primary_key_id=latest_record.id,
        )
        return JSONResponse(
            content={"message": "File uploaded and processed successfully."}
        )

    except Exception as e:
        return JSONResponse(content={"message": f"Error processing file: {str(e)}"})


@router.get(
    "/produce_period_info/{id}",
    tags=["Multi Period Farming Produce Period Info"],
)
async def read_single_produce_period_info(id: int, db: Session = Depends(get_db)):
    produce_period_info_item = (
        db.query(ProducePeriodInfo).filter(ProducePeriodInfo.id == id).first()
    )
    produce_period_file = produce_period_info_item.produce_period_file
    produce_period_dataframe = read_excel(produce_period_file)
    data = json.dumps(produce_period_dataframe.head().to_dict(orient="records"))

    if produce_period_info_item is None:
        raise HTTPException(status_code=404, detail="General Info record not found")
    return data
