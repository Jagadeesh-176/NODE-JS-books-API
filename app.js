const express = require("express");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();

const dbPath = path.join(__dirname, "index.db");
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at 3000");
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
initializeDbAndServer();

app.get("/", async (request, response) => {
  const namesQuery = `SELECT * FROM students ORDER BY id`;
  const namesArray = await db.all(namesQuery);
  response.send(namesArray);
});

app.get("/names", async (request, response) => {
  const namesQuery = `SELECT name FROM students ORDER BY id`;
  const namesArray = await db.all(namesQuery);
  response.send(namesArray);
});

app.get("/names/:id", async (request, response) => {
  const { id } = request.params;
  const getNameQuery = `SELECT name FROM students WHERE id=${id}`;
  const nameArray = await db.get(getNameQuery);
  response.send(nameArray);
});

app.post("/names", async (request, response) => {
  const reqDetails = request.body;
  const { name, age, gender, id } = reqDetails;
  const addDetailsQuery = `
        INSERT INTO students (name, age, gender, id)
        VALUES ('${name}', ${age}, '${gender}', ${id});
    `;
  const dbResponse = await db.run(addDetailsQuery);
  const reqId = dbResponse.lastID;
  response.send("The id is", reqId);
});

app.put("/names/:id", async (request, response) => {
  const { id } = request.params;
  const updateDetails = request.body;
  const { name, gender, age, id } = updateDetails;
  const updateNameQuery = `
        UPDATE students 
            SET name="${name}", age=${age}, gender="${gender}"
        WHERE id=${id};
    `;
  const dbResponse = await db.run(updateDetails);
  response.send("Query updated");
});
