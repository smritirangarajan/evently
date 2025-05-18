require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });


const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const eventsRoutes = require('./routes/events');
app.use('/api/events', eventsRoutes);

const weatherRoutes = require('./routes/weather');
app.use('/api/weather', weatherRoutes);

app.get("/", (req, res) => res.send("Server is running!"));

app.listen(3001, () => console.log("Server on http://localhost:3001"));
