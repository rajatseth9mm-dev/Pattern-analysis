import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { loadCSV } from "./csv-loader.js";
import { aggregate } from "./timeframe.js";
import { scanPatterns } from "./pattern-engine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// serve frontend (avoids file:// issues)
app.use("/", express.static(path.join(__dirname, "../frontend")));

const CSV_DIR = "/storage/WebappCSVfile";
let rawData = [];

(async () => {
  rawData = await loadCSV(CSV_DIR);
  console.log("CSV loaded:", rawData.length, "candles");
})();

app.get("/api/candles", (req, res) => {
  const tf = req.query.tf || "1m";
  res.json(aggregate(rawData, tf));
});

app.post("/api/scan", (req, res) => {
  const { startIndex, endIndex, tf, minSimilarity } = req.body;
  const data = aggregate(rawData, tf);

  const results = scanPatterns(
    data,
    startIndex,
    endIndex,
    minSimilarity
  );

  res.json(results);
});

app.listen(5000, () => {
  console.log("WAVE running at http://localhost:5000");
});
