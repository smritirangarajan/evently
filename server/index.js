const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.get("/", (req, res) => res.send("Server is running!"));
app.listen(3001, () => console.log("Server on http://localhost:3001"));