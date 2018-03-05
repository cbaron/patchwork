#!/usr/bin/env bash

## Set root path
DIR="$(dirname "$(readlink -f "$0")")/.."

USAGE="\nStart a dev environment inside a docker container

Usage:
$(basename "$0") --dump /path/to/dbdumpfile

Flags:
    -d, --dump 		The path (relative or absolute) to a Postgres database dump file
     				that will be loaded into the docker container using pg_restore.
    -h, --help		Print these usage instructions."

## Process flags and options
SHORTOPTS="d:,h"
LONGOPTS="dump:,help"
ARGS=$(getopt -s bash --options ${SHORTOPTS} --longoptions ${LONGOPTS} -- "$@" )
eval set -- ${ARGS}

while true; do
    case ${1} in
        -d | --dump)
            shift
            PATH_TO_DB_DUMP=$1
            ;;
        -h | --help)
            shift
		    printf "$USAGE"
		    exit 0
            ;;
        -- )
            shift
            break
            ;;
        * )
            shift
            break
            ;;
    esac
done

if [[ -z ${STACK_NAME} || -z ${COMPOSE_FILE} ]] && [[ ! ( -z ${STACK_NAME} && -z ${COMPOSE_FILE} ) ]]; then
    printf "\nThe \'--stack-name\' and \'--compose-file\' arguments must be used together (you can\'t just provide one or the other)\n\n" 1>&2
    exit 1
fi

# Build the docker image and then start the containers
echo "Starting the Docker containers..."
docker-compose up -d

# Load the db dump into the database (if specified)
if [[ -n ${PATH_TO_DB_DUMP} ]]; then
	echo "Waiting for postgres service to start..."
	sleep 5

	echo "Restoring your database image..."
	docker cp ${PATH_TO_DB_DUMP} patchwork_postgres_1:/sqldumpfile
	docker-compose exec postgres pg_restore -d patchwork -x -O /sqldumpfile -U patchwork
fi

# Run gulp watch:js
echo "Starting gulp watch:js"
docker-compose exec web npm run watch:js
