class ChartEngine {
  constructor(canvas) {
    this.c = canvas;
    this.ctx = canvas.getContext("2d");
    this.data = [];
    this.lines = [];
    this.matches = [];
    this.drag = null;

    this.resize();
    window.addEventListener("resize", () => this.resize());

    canvas.addEventListener("pointerdown", e => this.onDown(e));
    canvas.addEventListener("pointermove", e => this.onMove(e));
    canvas.addEventListener("pointerup", () => this.drag = null);
  }

  resize() {
    this.c.width = innerWidth;
    this.c.height = innerHeight - 80;
    this.draw();
  }

  setData(d) {
    this.data = d;
    this.draw();
  }

  setMatches(results, patternLength) {
    this.matches = results.map(r => ({
      start: r.index,
      end: r.index + patternLength
    }));
    this.draw();
  }

  candleIndex(x) {
    return Math.max(
      0,
      Math.min(this.data.length - 1, Math.round(x / 6))
    );
  }

  addLines() {
    const m = Math.floor(this.data.length / 2);
    this.lines = [m - 20, m + 20];
    this.matches = [];
    this.draw();
  }

  clear() {
    this.lines = [];
    this.matches = [];
    this.draw();
  }

  onDown(e) {
    const idx = this.candleIndex(e.offsetX);
    this.drag = this.lines.findIndex(l => Math.abs(l - idx) < 3);
  }

  onMove(e) {
    if (this.drag === null) return;
    this.lines[this.drag] = this.candleIndex(e.offsetX);
    this.draw();
  }

  getRange() {
    if (this.lines.length !== 2) return null;
    return [
      Math.min(...this.lines),
      Math.max(...this.lines)
    ];
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.c.width, this.c.height);
    if (!this.data.length) return;

    const prices = this.data.flatMap(c => [c.h, c.l]);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    // candles
    this.data.forEach((c, i) => {
      const x = i * 6;
      const y = p => this.c.height - ((p - min) / (max - min)) * this.c.height;

      ctx.strokeStyle = c.c >= c.o ? "#0f0" : "#f00";
      ctx.beginPath();
      ctx.moveTo(x, y(c.h));
      ctx.lineTo(x, y(c.l));
      ctx.stroke();
    });

    // pattern brackets
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 2;
    this.matches.forEach(m => {
      const x1 = m.start * 6;
      const x2 = m.end * 6;
      ctx.beginPath();
      ctx.moveTo(x1, 10);
      ctx.lineTo(x1, this.c.height - 10);
      ctx.moveTo(x2, 10);
      ctx.lineTo(x2, this.c.height - 10);
      ctx.stroke();
    });

    // active selection lines
    ctx.strokeStyle = "#ff0";
    ctx.lineWidth = 2;
    this.lines.forEach(i => {
      const x = i * 6;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.c.height);
      ctx.stroke();
    });
  }
}

window.ChartEngine = ChartEngine;
