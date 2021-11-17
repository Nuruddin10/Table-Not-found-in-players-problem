const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

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

app.get("/path/", async (request, response) => {
  const getBooksQuery = `SELECT player_id,player_name,jersey_no,role FROM cricket_team ;`;
  const playersList = await db.all(getBooksQuery);
  response.send(playersList);
});
