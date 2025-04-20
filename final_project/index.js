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
  //Write the authenication mechanism here
});


app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
