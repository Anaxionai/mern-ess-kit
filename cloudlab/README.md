# Cloud lab

The cloud lab runs the course's database on your laptop, in Docker Desktop. Nothing here costs money, and nothing leaves your laptop.

It is one Compose file, `docker-compose.yml`, with one profile (a named group of services), `mongo`. You use it from P2 (week 4) to the end of the course.

## Before you start

- Docker Desktop is running, with the WSL 2 backend. `setup/windows.md` in this kit shows how to install it.
- You use Git Bash in the VS Code terminal for every command.
- Go to this folder first. Every command in this file runs from here:

```bash
cd ~/mern-ess-kit/cloudlab
docker compose version
```

The second command prints `Docker Compose version v...`. If it prints an error, start Docker Desktop and wait until it says "Engine running".

## What `mongo` starts

| Service | What it is | Used in |
|---|---|---|
| `mongo` | MongoDB 8.0 as a **one-node replica set** called `rs0`: the database for RailSeat and your capstone | P2, P4, CP1, CP2 |
| `mailpit` | Mailpit, which catches every email your app sends | only if your app sends email |

**Why a replica set?** MongoDB runs a transaction (several changes that succeed or fail together) only on a replica set. A real replica set has three servers that copy each other's data. One server is enough on a laptop: it is the set's only member and always its primary (the member that takes writes). The lab starts the set by itself, so you never type `rs.initiate()`.

## Start the lab

```bash
docker compose --profile mongo up -d
```

The first start downloads the images once (about 350 MB). On a slow connection this can take 10 minutes.

Check that it runs:

```bash
docker compose --profile mongo ps
```

Both lines should say `Up`, and after about 15 seconds `(healthy)`. The containers are named `cloudlab-mongo-1` and `cloudlab-mailpit-1`.

`mongo` says `(healthy)` only when the replica set exists and this server is its primary. Its health check makes the set the first time: it runs every 5 seconds, sees that no set exists yet, and runs `rs.initiate()` with one member, `localhost:27017`.

Check MongoDB answers:

```bash
docker exec cloudlab-mongo-1 mongosh --quiet --eval "db.runCommand({ ping: 1 }).ok"
docker exec cloudlab-mongo-1 mongosh --quiet --eval "rs.status().members.map(m => m.name + ' ' + m.stateStr)"
```

The first prints `1`. The second prints `[ 'localhost:27017 PRIMARY' ]`.

## The connection string

| From | Connection string |
|---|---|
| Your Node app or tests on the laptop | `mongodb://localhost:27017/railseat?replicaSet=rs0` |
| MongoDB Compass or the VS Code MongoDB extension | the same string |
| Your own container, in your capstone's Compose file | `mongodb://host.docker.internal:27017/railseat?directConnection=true` (see below) |

- `railseat` after the `/` is the **database name**. MongoDB makes a database the first time you write to it, so there is no `createdb` step. Your capstone uses its own name: `mongodb://localhost:27017/capstone?replicaSet=rs0`. Your API's tests use none of these: they start their own MongoDB in memory (`mongodb-memory-server`).
- `replicaSet=rs0` tells the driver to join the set `rs0` and send writes to its primary. Transactions need it.
- The lab has **no user and no password**. It listens only on your laptop, and its data is practice data. Never run a database without a password on a real server: `deploy/README.md` keeps the server's MongoDB off the internet instead.

Put the string in your project's `.env` file as `MONGODB_URI=...`, never in your code. Commit a `.env.example` with the same line.

## Open a MongoDB shell

```bash
docker exec -it cloudlab-mongo-1 mongosh railseat
```

The prompt becomes `rs0 [direct: primary] railseat>`. Try `show collections` and `db.stations.findOne()`. Leave with `exit`.
Run this in VS Code's terminal. In the separate Git Bash window, `-it` can fail with `the input device is not a TTY`; then put `winpty` at the front.

## Stop the lab

| To stop | Command |
|---|---|
| The lab, keeping its data | `docker compose --profile mongo down` |
| One service | `docker compose --profile mongo stop mailpit` |
| The same service again | `docker compose --profile mongo start mailpit` |

Always name the profile. `docker compose down` on its own stops nothing here, because every service belongs to the `mongo` profile.

## Reset the lab (delete its data)

```bash
docker compose --profile mongo down -v
```

The `-v` flag deletes the volumes (storage that Docker keeps between runs): `mongo-data` holds your databases, and `mongo-config` holds the replica set's settings. After `down -v`, the next `up -d` starts empty and makes the replica set again. Mailpit keeps nothing.

To empty one database and keep the rest: `docker exec cloudlab-mongo-1 mongosh railseat --quiet --eval "db.dropDatabase()"`.

## Ports

| Service | Address from your laptop | User and password |
|---|---|---|
| MongoDB 8.0 | `mongodb://localhost:27017/<database>?replicaSet=rs0` | none |
| Mailpit SMTP | `localhost:1025` | any user name and password, or none; no TLS |
| Mailpit web page | http://localhost:8025 | none |

## RAM advice for 8 GB laptops

The lab is small: about 200 MB with MongoDB idle and 10 MB for Mailpit. The Compose file caps MongoDB's memory cache at 0.5 GB (`--wiredTigerCacheSizeGB 0.5`). Your editor, browser and own app need far more.

- Stop the lab when you finish for the day: `docker compose --profile mongo down`.
- Check live use with `docker stats --no-stream`.
- Docker Desktop's total memory is capped in `.wslconfig` (see `setup/windows.md`).
- Your API's tests start one more MongoDB in memory while they run (about 150 MB), then stop it.
- In the capstone you run your own Compose file too. Stop the lab first if your own file publishes port 27017.

## Reaching the lab from your own containers

Inside a container, `localhost` is the container itself, not your laptop. Use `host.docker.internal`, and add this to the service in your own `compose.yml`:

```yaml
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

Use `directConnection=true` there, not `replicaSet=rs0`. The set tells every client that its member is `localhost:27017`, which inside your container is the wrong place. `directConnection=true` makes the driver talk to the one server you named, and transactions still work, because that server is the primary.

In the capstone your Compose file starts its own MongoDB service instead (`deploy/README.md`, "The `db` service for compose.yml"), so you need this only to try something quickly.

## Git Bash and paths inside containers

Git Bash changes any argument that starts with `/` into a Windows path. That breaks a Docker command that names a path inside a container. Put `MSYS_NO_PATHCONV=1` in front of that one command:

```bash
MSYS_NO_PATHCONV=1 docker exec cloudlab-mongo-1 ls /data/db
```

Commands with no such path need nothing extra, for example `docker compose --profile mongo ps`. Never `export` the variable for the whole terminal: it breaks other commands.

## Troubleshooting

- **`mongo` stays `(health: starting)` or says `unhealthy`**: read its last log lines with `docker compose --profile mongo logs --tail 30 mongo`, and run the health check by hand: `docker exec cloudlab-mongo-1 mongosh --quiet --eval "rs.status().ok"`. If the set is broken, reset the lab with `down -v`.
- **`MongoServerSelectionError` or `connect ECONNREFUSED 127.0.0.1:27017`** from your app: the lab is not running, or not healthy yet. Run `docker compose --profile mongo ps`.
- **`getaddrinfo ENOTFOUND` with a name such as `mongo` or `db`**: your connection string names a container. From the laptop, use `localhost`.
- **`Transaction numbers are only allowed on a replica set member or mongos`**: the string has no `replicaSet=rs0` (or `directConnection=true`), or you started your own MongoDB without `--replSet`.
- **`port is already allocated`** or **`address already in use`**: another program uses that port. Find it with `docker ps --format "table {{.Names}}\t{{.Ports}}"`. A MongoDB installed on Windows also takes port 27017: stop the `MongoDB` service in the Windows Services app.
- **`docker compose down` did nothing**: name the profile: `docker compose --profile mongo down`.
- **The laptop is slow**: run `docker stats --no-stream`, and stop what you are not using.
- **`Cannot connect to the Docker daemon`**: start Docker Desktop and wait until it says "Engine running".

## Image versions

The images are pinned in `docker-compose.yml`, and listed in the kit's `VERSIONS.md`:

| Service | Image |
|---|---|
| MongoDB | `mongo:8.0.38` (it includes `mongosh`, `mongoimport` and `mongoexport`) |
| Mailpit | `axllent/mailpit:v1.34.0` |
