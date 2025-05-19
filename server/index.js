require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
console.log('✅ Loaded Ticketmaster API key:', process.env.TICKETMASTER_API_KEY);


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
