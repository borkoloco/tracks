require("./models/User");
require("./models/Track");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const trackRoutes = require("./routes/trackRoutes");
const app = express();
const requireAuth = require("./middlewares/requireAuth");

app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);
app.use((req, res, next) => {
  console.log("Nueva solicitud recibida"); // Verifica que cualquier solicitud llegue al servidor
  next();
});

const mongoUri =
  "mongodb+srv://borkoloco:Retopu77@cluster0.dfkogkg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoUri);

mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance");
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to mongo", err);
});

app.get("/", requireAuth, (req, res) => {
  console.log("Middleware requireAuth ejecutado");
  res.send(`Your email: ${req.user.email}`);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
