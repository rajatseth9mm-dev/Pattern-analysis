const chart = new ChartEngine(document.getElementById("chart"));

async function load(tf = "1m") {
  const r = await fetch(`/api/candles?tf=${tf}`);
  chart.setData(await r.json());
}
load();

document.getElementById("add").onclick = () => chart.addLines();
document.getElementById("clear").onclick = () => chart.clear();

document.getElementById("apply").onclick = async () => {
  const range = chart.getRange();
  if (!range) return alert("Select pattern first");

  const tf = document.getElementById("tf").value;
  const minSimilarity = +document.getElementById("sim").value;
  const patternLength = range[1] - range[0];

  const r = await fetch("/api/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      startIndex: range[0],
      endIndex: range[1],
      tf,
      minSimilarity
    })
  });

  const results = await r.json();
  chart.setMatches(results, patternLength);
};

document.getElementById("sim").oninput = e =>
  document.getElementById("simv").textContent = e.target.value + "%";
