FROM gurobi/optimizer:latest

RUN mkdir -p /code

WORKDIR /code

COPY ./requirements.txt ./requirements.txt

COPY ./alembic ./alembic

RUN apt-get update && \
    apt-get install -y pkg-config libmariadb-dev build-essential && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir model

RUN pip install --upgrade --trusted-host pypi.python.org --trusted-host pypi.org --trusted-host files.pythonhosted.org -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
