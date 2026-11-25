// The search query, written and run in mongosh first (task 18, steps 2 to 6).
// Run it inside: docker exec -it cloudlab-mongo-1 mongosh railseat
// Then paste the pipeline, or load this file from mongosh.

// TODO(task 18): db.trains.aggregate([
//   1. $match trains whose stops.station has both codes ($all);
//   2. $addFields fromIdx and toIdx with $indexOfArray on "$stops.station";
//   3. $match with $expr: fromIdx less than toIdx;
//   4. $lookup the journeys of that date, then $unwind;
//   5. $project journey_id, train_number, train_name, departs, arrives and free_seats.
// ])
// TODO(task 21): $sort by departs and train_number, then $skip and $limit.
