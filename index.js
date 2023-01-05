import * as dotenv from "dotenv";
import serveIndex from "serve-index";
import express from "express";
import ip from "ip";

dotenv.config();

const { env } = process;
const folder = env.FOLDER_PATH || "./movies";
const port = env.PORT || 3000;
const app = express();

app.use(express.static(folder), serveIndex(folder, { icons: true }));
app.listen(port);

console.log(`Running on Port http://${ip.address()}:${port}/`);
