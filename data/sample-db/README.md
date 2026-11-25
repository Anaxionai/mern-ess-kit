# Sample database: 40 Indian railway stations

`stations.json` holds one small collection, `stations`: 40 real Indian railway stations, one document each.
You use it in P2 (week 4) for your first MongoDB queries, before you design RailSeat's own collections.

## One document

```json
{
  "code": "NDLS",
  "name": "New Delhi",
  "city": "New Delhi",
  "state": "Delhi",
  "zone": "NR",
  "platforms": 16,
  "openedYear": 1926,
  "location": { "lat": 28.6428, "lng": 77.2191 }
}
```

| Field | Type | Meaning | Example |
|---|---|---|---|
| `code` | string | The Indian Railways station code: unique | `"NDLS"` |
| `name` | string | The station's name | `"New Delhi"` |
| `city` | string | The city the station serves | `"New Delhi"` |
| `state` | string | The state or union territory | `"Delhi"` |
| `zone` | string | The railway zone, as a short code | `"NR"` |
| `platforms` | number | The number of platforms | `16` |
| `openedYear` | number | The year the station opened | `1926` |
| `location` | embedded document | Latitude (`lat`, north) and longitude (`lng`, east), in degrees | `{ "lat": 28.6428, "lng": 77.2191 }` |

`location` is an **embedded document**: a document inside a document. Reach its fields with a dot and quotes, such as `{ "location.lat": { $gt: 25 } }`.
MongoDB adds an `_id` (an `ObjectId`) to every document when you import the file.

The zone codes:

| Code | Zone | Code | Zone | Code | Zone |
|---|---|---|---|---|---|
| `NR` | Northern | `NER` | North Eastern | `NFR` | Northeast Frontier |
| `ER` | Eastern | `SER` | South Eastern | `ECR` | East Central |
| `ECoR` | East Coast | `NCR` | North Central | `NWR` | North Western |
| `WCR` | West Central | `WR` | Western | `CR` | Central |
| `SECR` | South East Central | `SR` | Southern | `SWR` | South Western |
| `SCR` | South Central | `SCoR` | South Coast | | |

The codes, names, cities, states and zones are real.
The platform counts, opening years and coordinates come from each station's English Wikipedia page, read in November 2026.
Stations change over time, so treat the numbers as practice data, not as travel information.

## Load it into the cloud lab's MongoDB

Run every command in Git Bash. The cloud lab's MongoDB has no user and no password. `mongoimport` is a tool inside the MongoDB container, so you install nothing.

**1. Start the cloud lab's `mongo` profile:**

```bash
cd ~/mern-ess-kit/cloudlab
docker compose --profile mongo up -d
docker compose --profile mongo ps
```

Wait until the `mongo` line says `(healthy)`. The container is named `cloudlab-mongo-1`.

**2. Import the file.** Use one of these two ways.

In one command: `docker exec -i` passes the file to `mongoimport` through its input, so no path goes into the container:

```bash
cd ~/mern-ess-kit
docker exec -i cloudlab-mongo-1 mongoimport --db railseat --collection stations --jsonArray --drop < data/sample-db/stations.json
```

Or copy the file into the container first, then import it there. Stay in the `cloudlab` folder:

```bash
MSYS_NO_PATHCONV=1 docker cp ../data/sample-db/stations.json cloudlab-mongo-1:/tmp/stations.json
MSYS_NO_PATHCONV=1 docker exec cloudlab-mongo-1 mongoimport --db railseat --collection stations --jsonArray --drop --file /tmp/stations.json
```

`MSYS_NO_PATHCONV=1` stops Git Bash from rewriting `/tmp/stations.json` into a Windows path, such as `C:/Users/you/AppData/Local/Temp/stations.json`.
Without it, `mongoimport` says it cannot open the file.

What the options mean:

| Option | Meaning |
|---|---|
| `--db railseat` | The database. MongoDB makes it on the first write. |
| `--collection stations` | The collection to fill |
| `--jsonArray` | The file is one JSON array of documents, `[ {...}, {...} ]` |
| `--drop` | Delete the collection first, so running the command twice never gives 80 documents |

Both ways end with:

```text
40 document(s) imported successfully. 0 document(s) failed to import.
```

**3. Check it:**

```bash
docker exec cloudlab-mongo-1 mongosh railseat --quiet --eval "db.stations.countDocuments()"
```

The count is 40.

**4. Open `mongosh` to type your own queries:**

```bash
docker exec -it cloudlab-mongo-1 mongosh railseat
```

The prompt ends with `railseat>`. Try these, then leave with `exit`:

```js
db.stations.findOne({ code: "NDLS" })
db.stations.find({ zone: "NR" }, { _id: 0, code: 1, name: 1 })
db.stations.countDocuments({ platforms: { $gte: 10 } })
db.stations.aggregate([{ $group: { _id: "$zone", stations: { $sum: 1 } } }, { $sort: { stations: -1 } }])
```

Run this in VS Code's terminal. In the separate Git Bash window, `-it` can fail with `the input device is not a TTY`; then put `winpty` at the front: `winpty docker exec -it cloudlab-mongo-1 mongosh railseat`.

## Start again

Run the import in step 2 again: `--drop` empties the collection first, so you get the 40 documents back as they were.

## Before you build RailSeat's models: remove this collection

Later in P2 you design RailSeat's own `stations` collection with Mongoose, in the same `railseat` database.
Remove this practice collection first, so your seed script starts from an empty collection with your own fields:

```bash
docker exec cloudlab-mongo-1 mongosh railseat --quiet --eval "db.stations.drop()"
```

It prints `true`.
