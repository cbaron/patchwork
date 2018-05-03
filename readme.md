# Patchwork Gardens

##Using the Collection Manager

###Create a New Group Drop-off

1) Navigate to `admin-plus/collection-manager` and choose the `Group Drop-Off` collection. Click on the Add button. Enter the drop-off details (now including price) and click Submit.

2) Next you need to associate the group with the seasons for which it will be available. Click on the `Share Group Drop-offs` collection. You will need to create one new entry for each season. For the `groupdropoff` and `share` fields, start typing the name of the group or the share/season until a dropdown appears, then select it. Enter the rest of the fields normally.

3) Go to the `Delivery Routes` collection and create a route for the new group with day of week and start and end times.

4) Go to `Zip Code => Route` to associate a zip code with the route you just created. For `deliveryroute` start typing the label of the delivery route until a dropdown appears, then select.

That should do it! The group will now appear as an option in the sign up as well as on the Locations page.


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

In order to re-Gulp your js bundle when you modify the code, you'll need to run `npm watch:js` inside the `web` container:
`$ docker-compose exec web npm run watch:js`


## A few helpful Docker commands

### Start a `psql` session inside the postgres container

`$ docker-compose exec postgres psql patchwork patchwork`

### View the server logs from a running container

`$ docker-compose logs web`
or
`$ docker-compose logs postgres`

...or to stream the log continuously:
`$ docker-compose logs --follow web`

