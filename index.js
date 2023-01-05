import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import basicAuth from "express-basic-auth";
import express from "express";
import ip from "ip";

let files = [];

function scanDirectory(directory) {
  fs.readdirSync(directory).forEach((file) => {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) return scanDirectory(fullPath);
    else return files.push(fullPath);
  });
}

function constructJson(jsonKey, jsonValue) {
  var jsonObj = {};
  jsonObj[jsonKey] = jsonValue;
  return jsonObj;
}

dotenv.config();

const { env } = process;
const folder = env.FOLDER_PATH || "./movies";
const port = env.PORT || 3000;
const userName = env.USERNAME;
const password = env.PASSWORD;
const auth = env.AUTH;
const app = express();

if (auth?.toLowerCase() == "true") {
  if (!userName) {
    throw "USERNAME is not set in .env";
  }
  if (!password) {
    throw "PASSWORD is not set in .env";
  }
  const users = constructJson(userName, password);
  const authOptions = { users, challenge: true };
  console.log(authOptions);
  app.use(basicAuth(authOptions));
}

app.use(`/${folder}`, express.static(folder));
app.get("/", function (req, res) {
  files = [];
  scanDirectory(folder);
  let links = "";
  files.map((f) => (links = links + `<a href="${f}">${f}</a> <br/>`));
  res.send(links);
});
app.listen(port);

console.log(`Running on Port http://${ip.address()}:${port}/`);
