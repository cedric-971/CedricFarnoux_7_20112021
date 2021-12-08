const express = require("express");
const userRoutes = require('./routes/user');
const path = require("path");
const app = express();
const dotenv = require("dotenv").config();
const { Sequelize } = require('sequelize');
const db = require('./models');
const messageRoutes = require('./routes/message')

//connection base de donnée

const sequelize = new Sequelize("database_development", "root", "Farnoux22061980", {
    dialect: "mysql",
    host: "localhost"
  });
  
  try {
    sequelize.authenticate();
    console.log('Connecté à la base de données MySQL!');
  } catch (error) {
    console.error('Impossible de se connecter, erreur suivante :', error);
  }


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use('/api/user', userRoutes);
app.use('/api/message',messageRoutes);
db.sequelize.sync()
module.exports = app;
