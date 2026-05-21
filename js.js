const xArrayA = [10, 85, 48, 65, 5];
const xArrayB = [55, 49, 44, 24, 15];
const yArrayA = [
  "2026-05-11",
  "2026-05-10",
  "2026-05-09",
  "2026-05-08",
  "2026-05-07",
];

const data = [
  {
    x: xArrayA,
    y: yArrayA,
    type: "bar",
    orientation: "h",
    marker: { color: "rgba(255,0,0,0.6)" },
    name: "Fehler",
  },
  {
    x: xArrayB,
    y: yArrayA,
    type: "bar",
    orientation: "h",
    marker: { color: "rgba(0,255,0,0.6)" },
    name: "Zeit",
  },
];

const layout = { title: "Statistiken" };

Plotly.newPlot("myPlot", data, layout);
