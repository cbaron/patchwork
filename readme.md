# Patchwork Gardens

## Quick Start with Docker
_(You need to have Docker and docker-compose installed)_

```
$ git clone https://github.com/cbaron/patchwork
$ cd patchwork
$ docker-compose up -d                                                         
    Recreating patchwork_postgres_1 ... done 
    Recreating patchwork_web_1 ... done
```

Now you can load a database dump into the postgres database:
```
$ docker cp /path/to/sqldumpfile patchwork_postgres_1:/sqldumpfile
$ docker-compose exec postgres pg_restore -d patchwork -x -O /sqldumpfile -U patchwork
```

You might need to restart the node app at this point if it has died from looking for missing db tables.  You can check its status:
`$ docker-compose ps`

...and you might see that the `patchwork_web_1` container has Exited.
```
$ docker-compose ps
        Name                      Command               State      Ports  
--------------------------------------------------------------------------
patchwork_postgres_1   docker-entrypoint.sh postgres   Up         5432/tcp
patchwork_web_1        node ./app.js                   Exit 1 
```

If this is the case, just re-run `docker-compose up -d`!

Now you should be able to see the website in your browser at `http://localhost:4000`.


