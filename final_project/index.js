require("dotenv").config({ path: "config/.env" });
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const PORT = Number.parseInt(process.env.PORT || "5000");
const SESSION_SECRET = process.env.SESSION_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: SESSION_SECRET, resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
  //Write the authentication mechanism here
  if (!req.session.accessToken) {
    return res.status(401).send("Unauthenticated! please login first.");
  }
  const accessToken = req.session.accessToken;
  jwt.verify(accessToken, JWT_SECRET, (err, payload) => {
    if (err) {
      delete req.session.accessToken;
      return res.status(401).send("Invalid session token! Please login again.");
    }
    req.session.username = payload.username;
    next();
  });
});


app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
