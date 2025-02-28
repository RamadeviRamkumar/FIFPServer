const express = require("express");
const app = express();
const path = require('path')
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongodb = require("./Mongo/DB");
require("dotenv").config();
require("./config/passport/google");
const passport = require("passport");
const route = require("./Routes/route");
// const logger = require("./utils/logger.js");
// const secretValue = require("./config/secretCode/password.js");
const axios = require('axios');
const cron = require('node-cron');
require('dotenv').config();

// Middleware
app.use('/uploads', express.static(path.join(__dirname, './Controller/Login/uploads')));

// Swagger setup
const swaggerDocument = require("./swagger-output.json");
const swaggerUi = require("swagger-ui-express");

// Middleware
app.use(cors());
// app.use(cors({
//   origin: 'http://148.135.137.252:7000', // Replace with your actual domain
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
// }));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Middleware for express-session
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", route);

// MongoDB Connection
mongoose
  .connect(process.env.Mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  // mongoose.connect(mongodb.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch((err) => {
    console.log(`Error connecting to MongoDB: ${err.message}`);
  });

  // Function to hit the API
function hitApi() {
  axios.get('https://fifp-club.onrender.com/')
      .then(response => {
          console.log('Render API Hit:', response.data);
      })
      .catch(error => {
          console.error('Error hitting the API:', error);
      });
}

// Schedule to run every 5 minutes
cron.schedule('*/5 * * * *', hitApi);

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to FIFP!");
});

// Server Start
const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log(`Server connected on port ${port}`);
});

module.exports = app;
 