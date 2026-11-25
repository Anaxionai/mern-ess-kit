# RailSeat seed data

RailSeat is the train-booking product you build in P2 (the API, weeks 4 and 5) and P4 (the web app, week 7).
**RailSeat is a training product.** It is not Indian Railways or IRCTC, and its trains and timetables are made up.

This folder holds the seed data (the starting data) for RailSeat as four CSV files.
You design your own collections and Mongoose models in P2, then load these files into them with your own seed script (`npm run seed`).

## What is in this folder

| File | What it is |
|---|---|
| `stations.csv` | 62 real Indian railway stations |
| `trains.csv` | 120 trains: 60 routes, each run in both directions |
| `coaches.csv` | 1,480 coaches: each train's coaches, with their class and number of seats |
| `schedules.csv` | 596 stops: one row for each station where a train stops |
| `make_seed.py` | The generator that wrote the four files: a small Python program with no packages. You never need to run it. |
| `test_make_seed.py` | Tests for the generator (Python's `pytest`), for the kit's maintainers. |

Your seed script creates the seats from `coaches.csv`: the normal set gives **103,884 seats**.

## Make the files again

Run these commands in Git Bash. The output is always the same, so the files in the kit do not change.

The files are already in the kit. To make them again, Docker Desktop runs the generator in the official `python:3.12-alpine` image, so you install nothing:

```bash
cd ~/mern-ess-kit/data/railseat
MSYS_NO_PATHCONV=1 docker run --rm -v "$PWD":/work -w /work python:3.12-alpine python make_seed.py
```

`MSYS_NO_PATHCONV=1` stops Git Bash from rewriting `/work` into a Windows path; `-v "$PWD":/work` lets the script write into this folder. If you have uv, `uv run make_seed.py` does the same.
The script prints the full path of every file it writes, and the number of rows in each.

### A big set: `--scale` (optional)

```bash
cd ~/mern-ess-kit/data/railseat
MSYS_NO_PATHCONV=1 docker run --rm -v "$PWD":/work -w /work python:3.12-alpine python make_seed.py --scale
```

No task in this course needs it. It is there if you want to see how your search endpoint copes with far more data.
This writes **10,000 trains** to the `scale/` folder inside this folder, and prints each file's path.
The first 120 trains are the same as the normal set.
Git ignores the `scale/` folder, so `git pull` keeps working.

| Set | Trains | Coaches | Stops | Seats your seed script creates | Size of the 4 files |
|---|---|---|---|---|---|
| Normal | 120 | 1,480 | 596 | 103,884 | 52 KB |
| `--scale` | 10,000 | 130,816 | 42,440 | 9,181,092 | 3.9 MB |

To make another size, use `--trains` (2 to 50,000) and choose the folder with `--out-dir`:

```bash
MSYS_NO_PATHCONV=1 docker run --rm -v "$PWD":/work -w /work python:3.12-alpine python make_seed.py --trains 2000 --out-dir big
```

## The columns

### `stations.csv`

| Column | Meaning | Example |
|---|---|---|
| `code` | The station code that Indian Railways uses: 1 to 4 capital letters. Unique. | `NDLS` |
| `name` | The station's name | `New Delhi` |
| `city` | The city the station serves | `New Delhi` |
| `state` | The state or union territory | `Delhi` |
| `zone` | The railway zone, as a short code (see the list below) | `NR` |
| `latitude` | North of the equator, in degrees, with 4 decimal places | `28.6428` |
| `longitude` | East of Greenwich, in degrees, with 4 decimal places | `77.2191` |

The zone codes:

| Code | Zone | Code | Zone | Code | Zone |
|---|---|---|---|---|---|
| `NR` | Northern | `NER` | North Eastern | `NFR` | Northeast Frontier |
| `ER` | Eastern | `SER` | South Eastern | `ECR` | East Central |
| `ECoR` | East Coast | `NCR` | North Central | `NWR` | North Western |
| `WCR` | West Central | `WR` | Western | `CR` | Central |
| `SECR` | South East Central | `SR` | Southern | `SWR` | South Western |
| `SCR` | South Central | `SCoR` | South Coast | | |

`KR` is Konkan Railway, a separate railway company that runs Madgaon (`MAO`).

### `trains.csv`

| Column | Meaning | Example |
|---|---|---|
| `number` | The train number: 5 digits, unique. A route's two trains have neighbouring numbers: the odd number one way, the next even number back. | `12333` |
| `name` | The train's name. Two trains can have the same name; the number is what tells them apart. | `New Delhi Mumbai Rajdhani Express` |
| `type` | One of 13 train types: Rajdhani, Duronto, Shatabdi, Vande Bharat, Tejas, Jan Shatabdi, Intercity, Superfast, Mail, Express, Garib Rath, Humsafar, Sampark Kranti | `Rajdhani` |
| `from_station` | The code of the first station. It is the same as stop 1 in `schedules.csv`. | `NDLS` |
| `to_station` | The code of the last station | `BCT` |
| `runs_on` | The days of the week the train leaves its first station, separated by spaces | `Mon Tue Wed Thu Fri Sat Sun` |

The normal set has 64 trains that run every day. Your P2 seed script may run every train every day.

### `coaches.csv`

| Column | Meaning | Example |
|---|---|---|
| `train_number` | The train this coach belongs to | `12333` |
| `coach_code` | The coach's code: a letter for the class and a number. Unique within a train. | `B4` |
| `class` | The travel class: `1A`, `2A`, `3A`, `SL` or `CC` | `3A` |
| `seats` | The number of seats or berths in the coach | `72` |

| Class | Name | Coach letter | Seats per coach |
|---|---|---|---|
| `1A` | First AC | `H` | 24 |
| `2A` | AC 2-tier | `A` | 54 |
| `3A` | AC 3-tier | `B` | 72 |
| `SL` | Sleeper | `S` | 72 |
| `CC` | AC Chair Car | `C` | 78 |

Number the seats of each coach from 1 to its `seats` value. In `SL` and `3A`, the berths repeat in groups of 8:
1 lower, 2 middle, 3 upper, 4 lower, 5 middle, 6 upper, 7 side lower, 8 side upper.
In `2A`, they repeat in groups of 6: 1 lower, 2 upper, 3 lower, 4 upper, 5 side lower, 6 side upper.
In `CC`, RailSeat uses rows of 5 seats. The first and last seats of each row are by a window, such as seats 1, 5, 6 and 10.

### `schedules.csv`

| Column | Meaning | Example |
|---|---|---|
| `train_number` | The train | `12333` |
| `stop_seq` | The stop's order on the route: 1 is the first station | `3` |
| `station_code` | The station | `BRC` |
| `arrival` | Arrival time, as `HH:MM` on a 24-hour clock. Empty at the first station. | `04:10` |
| `departure` | Departure time, as `HH:MM`. Empty at the last station. | `04:20` |
| `day_offset` | The day of this stop, counted from the day the train leaves its first station: 0 is that day, 1 is the next day | `1` |
| `km` | The distance from the first station along the route, in kilometres | `976` |

A train never waits at a station across midnight, so `arrival` and `departure` at one stop are always on the same day.
To find the date of a stop, add `day_offset` days to the date the train leaves its first station.

Here is train 12333, New Delhi to Mumbai Central, from `schedules.csv`:

| stop_seq | station_code | arrival | departure | day_offset | km |
|---|---|---|---|---|---|
| 1 | NDLS | | 16:30 | 0 | 0 |
| 2 | KOTA | 22:10 | 22:15 | 0 | 475 |
| 3 | BRC | 04:10 | 04:20 | 1 | 976 |
| 4 | ST | 06:05 | 06:10 | 1 | 1127 |
| 5 | BCT | 09:20 | | 1 | 1420 |

If this train leaves New Delhi on 1 December 2026, it reaches Mumbai Central at 09:20 on 2 December 2026.

## Load the data

Your seed script reads the CSV files with a CSV parser and writes documents with your Mongoose models. Load them in this order, because later documents point at earlier ones:
stations, then trains (with their stops and coaches), then seats, then journeys.

- How you shape the documents is your P2 design: for example, a train's stops can be **embedded** in the train document (they are always read with it), while seats and bookings are **separate collections that reference** the train by its `_id` (there are many of them, and they change on their own).
- Search tasks need trains between two stations. Three daily trains run from New Delhi (`NDLS`) to Mumbai Central (`BCT`), and a fourth passes through both.
- Your seed script creates the seats of each coach from its `seats` value, and the journeys (one train on one date) for the dates you need.
- Run it twice and you must not get twice the data: empty the collections first (`deleteMany({})`), or use `bulkWrite` with `updateOne` and `upsert: true`.

### Writing many documents fast

`insertMany` with one array writes thousands of documents in one round trip to the database. Calling `create` or `save` once per seat sends one request per seat: fine for 100 seats, far too slow for 103,884.
Build the seats of one train (or of all trains) as an array, then call `Seat.insertMany(array, { ordered: false })` once. With `ordered: false` MongoDB writes the rest of the batch even if one document breaks a unique index, and reports the failures at the end.

The `--scale` set (9 million seats, about 3.9 MB of CSV) is optional: if you try it, write the seats in batches of 10,000 with `insertMany`, create your indexes after the insert, and check that you have at least 3 GB of free disk space first.

## What is real and what is made up

- **Real:** the station codes, names, cities, states, zones and coordinates. The coordinates come from each station's English Wikipedia page, read in November 2026.
- **Made up:** every train number, name and timetable, and the coach plans. They follow Indian Railways' style, but they do not describe real trains.
- Distances are estimates: the straight-line distance between two stations times 1.18.

## Run the tests

For the kit's maintainers; students never need them. Docker Desktop must be running:

```bash
cd ~/mern-ess-kit/data/railseat
MSYS_NO_PATHCONV=1 docker run --rm -v "$PWD":/work -w /work -e PYTHONDONTWRITEBYTECODE=1 python:3.12-alpine sh -c "pip install -q --root-user-action=ignore pytest && python -m pytest -q -p no:cacheprovider"
```
