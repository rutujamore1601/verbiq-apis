require("dotenv").config();
const environment = process.env.NODE_ENV;

const development = {
  app: {
    protocol: "http",
    host: "localhost",
    port: 8086,
  },
  db: {
    protocol: "mongodb",
    host: "127.0.0.1",
    port: 27017,
    dbName: `${process.env.PROJ_NAME}Dev`,
    username: "",
    password: "",
    dbUrl: function () {
      return `${this.protocol}://${this.host}:${this.port}/${this.dbName}`;
    },
  },
  licence: "",
  env: environment,
};

const staging = {
  app: {
    protocol: "https",
    host: "be-verbe-q.onrender.com",
    port: 8086,
  },
  db: {
    protocol: "mongodb+srv",
    host: "cluster0.plhrukc.mongodb.net",
    port: null,
    dbName: `${process.env.PROJ_NAME}Stage`,
    username: "root",
    password: "root",
    dbUrl: function () {
      return `${this.protocol}://${this.username}:${this.password}@${this.host}/${this.dbName}`;
    },
  },
  licence: "",
  env: environment,
};

const production = {
  app: {
    protocol: "http",
    host: "localhost",
    port: 8086,
  },
  db: {
    protocol: "mongodb+srv",
    host: "quickmedscluster.vprlasu.mongodb.net",
    port: null,
    dbName: `${process.env.PROJ_NAME}Prod`,
    username: "root",
    password: "root",
    dbUrl: function () {
      return `${this.protocol}://${this.username}:${this.password}@${this.host}/${this.dbName}`;
    },
  },
  licence: "",
  env: environment,
};

const config = {
  development,
  staging,
  production,
};

module.exports = config[environment];
