import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
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

dotenv.config();

const { env } = process;
const folder = env.FOLDER_PATH || "./movies";
const port = env.PORT || 3000;
const app = express();

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
