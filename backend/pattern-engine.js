function vector(c) {
  const r = c.h - c.l || 1;
  return [
    (c.o - c.l) / r,
    (c.h - c.l) / r,
    (c.c - c.l) / r
  ];
}

export function scanPatterns(data, start, end, minSimilarity) {
  const base = data.slice(start, end).map(vector);
  const N = base.length;
  const results = [];

  for (let i = 0; i <= data.length - N; i++) {
    let dist = 0;

    for (let j = 0; j < N; j++) {
      const v = vector(data[i + j]);
      dist += Math.hypot(
        v[0] - base[j][0],
        v[1] - base[j][1],
        v[2] - base[j][2]
      );
    }

    const similarity = (1 - dist / N) * 100;
    if (similarity >= minSimilarity) {
      results.push({ index: i, similarity });
    }
  }

  return results.sort((a, b) => b.similarity - a.similarity);
                        }
