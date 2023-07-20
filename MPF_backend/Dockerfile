FROM python:3.9

RUN mkdir -p /code

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

COPY ./alembic /code/alembic

RUN pip install --upgrade --trusted-host pypi.python.org --trusted-host pypi.org --trusted-host files.pythonhosted.org -r requirements.txt

RUN grbgetkey c9ec1980-bd2b-11ed-81b2-0242ac120003

COPY ./app /code/app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
