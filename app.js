const express = require("express");
const { open } = require("sqlite");
const dbDriver = require("sqlite3");
const path = require("path");
const app = express();
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
app.use(express.json());
const intialzeServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: dbDriver.Database,
    });
    app.listen(3000, () => {
      console.log("server running");
    });
  } catch (e) {
    console.log(`error message: ${e.message}`);
    process.exit(1);
  }
};
intialzeServer();

app.get("/players/", async (request, response) => {
  const dbQuery = `
    SELECT
    *
    FROM
    cricket_team
    ORDER BY
    player_id;`;
  const result = await db.all(dbQuery);

  response.send(result);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  console.log(playerDetails);
  const { playerName, jerseyNumber, role } = playerDetails;
  postQuery = `
    INSERT INTO
    cricket_team (player_name,jersey_number,role)
    VALUES
    (
        '${playerName}',
        ${jerseyNumber},
        '${role}');`;
  const result = db.run(postQuery);
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getQuery = `
    SELECT 
    *
    FROM cricket_team
    WHERE player_id = ${playerId};`;
  const result = await db.get(getQuery);
  response.send(result);
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const putQuery = `
    UPDATE 
    cricket_team
    SET 
    player_name = '${playerName}',
    jersey_number = ${jerseyNumber},
    role = '${role}'
    WHERE 
    player_id = ${playerId};`;
  await db.run(putQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `
    DELETE FROM
    cricket_team
    WHERE 
    player_id = ${playerId};`;
  await db.run(deleteQuery);
  response.send("Player Removed");
});

module.exports = app;
