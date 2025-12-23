const MAP = {
  "1m": 1,
  "5m": 5,
  "15m": 15,
  "30m": 30,
  "1h": 60,
  "4h": 240,
  "1d": 1440
};

export function aggregate(data, tf) {
  const size = MAP[tf];
  if (!size || size === 1) return data;

  const out = [];
  for (let i = 0; i < data.length; i += size) {
    const chunk = data.slice(i, i + size);
    if (!chunk.length) continue;

    out.push({
      t: chunk[0].t,
      o: chunk[0].o,
      h: Math.max(...chunk.map(c => c.h)),
      l: Math.min(...chunk.map(c => c.l)),
      c: chunk[chunk.length - 1].c
    });
  }
  return out;
}
