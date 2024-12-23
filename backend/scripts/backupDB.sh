# !/bin/bash

if [ -f ../.env ]; then
    echo "Found .env file"
    export $(grep -v '^#' ../.env | xargs)
else
    echo "No .env file found"
fi

sudo mongodump --uri ${MONGO_URI} --out ./backup