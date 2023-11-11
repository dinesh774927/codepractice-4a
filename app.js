const express = require("express");
const { open } = require("sqlite");
const dbDriver = require("sqlite3");
const path = require("path");
const app = express();
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

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
  console.log(result);
  response.send(result);
});
app.use(express.json());
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;

  const { playerName, jerseyNumber, role } = playerDetails;

  const playerQuery = `
  INSERT INTO
  cricket_team (player_name,jersey_number, role)
  VALUES
  (
    ${playerName},
    ${jerseyNumber},
    ${role}
    );`;
  const result = await db.run(playerQuery);
  console.log(result);
  response.send("Player Added to Team");
});
