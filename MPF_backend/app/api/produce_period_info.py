import os

import fastapi
from fastapi import Depends, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse
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
        db.query(ProducePeriodInfo)
        .filter(ProducePeriodInfo.primary_key_id == id)
        .first()
    )
    if produce_period_info_item is None:
        raise HTTPException(status_code=404, detail="General Info record not found")
    else:
        produce_period_file = produce_period_info_item.produce_period_file
        return os.path.basename(produce_period_file)


@router.patch(
    "/produce_period_info/{id}",
    tags=["Multi Period Farming Produce Period Info"],
)
async def patch_single_produce_period_info(
    id: int, file: UploadFile = File(...), db: Session = Depends(get_db)
):
    try:
        print("Inside patch")
        contents = await file.read()
        produce_period_file = f"input/produce_period_info_{id}.xls"
        with open(produce_period_file, "wb") as f:
            f.write(contents)

    except Exception as e:
        return JSONResponse(content={"message": f"Error processing file: {str(e)}"})
