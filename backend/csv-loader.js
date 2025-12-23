import fs from "fs";
import path from "path";
import csv from "csv-parser";

export function loadCSV(dir) {
  return new Promise((resolve, reject) => {
    const file = fs.readdirSync(dir).find(f => f.endsWith(".csv"));
    if (!file) return reject("No CSV found");

    const data = [];

    fs.createReadStream(path.join(dir, file))
      .pipe(csv())
      .on("data", r => {
        data.push({
          t: Number(r.timestamp),
          o: Number(r.open),
          h: Number(r.high),
          l: Number(r.low),
          c: Number(r.close)
        });
      })
      .on("end", () => resolve(data))
      .on("error", reject);
  });
}
