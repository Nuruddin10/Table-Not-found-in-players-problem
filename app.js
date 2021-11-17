const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
app.use(express.json());
const DBpath = path.join(__dirname, "cricketTeam.db");
let db = null;

const initializingDbAndServer = async () => {
  try {
    db = await open({
      filename: DBpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server initialized successfully");
    });
  } catch (e) {
    console.log(`DbError: ${e.message}`);
    process.exit(1);
  }
};

initializingDbAndServer();

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `SELECT * FROM cricket_team ORDER BY player_id;`;
  const playersList = await db.all(getPlayersQuery);
  response.send(playersList);
});

app.post("/players/", async (request, response) => {
  let playerDetailsBody = request.body;
  let { playerName, jerseyNumber, role } = playerDetailsBody;
  const createNewPlayerQuery = `INSERT INTO cricket_team(player_name,jersey_number,role)
    VALUES('${playerName}',${jerseyNumber},'${role}');`;
  const dbResponse = await db.run(createNewPlayerQuery);
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  const getPlayerQuery = `SELECT * FROM cricket_team WHERE player_id = ${playerId} ORDER BY player_id;`;
  const dbResponse = await db.get(getPlayerQuery);
  response.send(dbResponse);
});

app.put("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerQuery = `
  UPDATE 
  cricket_team
   SET
   player_name = '${playerName}',
   jersey_number = ${jerseyNumber},
   role = '${role}' 
   WHERE player_id = ${playerId};`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  const deletePlayerQuery = `DELETE  FROM cricket_team 
    WHERE player_id = ${playerId} ;`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
