function _mapboxgl(require){return(
require('mapbox-gl@2.3.1')
)}

function _2(mapboxgl){return(
mapboxgl.accessToken = 'pk.eyJ1IjoibWF1cm9qcGMiLCJhIjoiY2x3ejFzdjR1MDJzbTJqb2NvY2h5MDlsdyJ9.eCYb4O3-PfcGB2VgDXHvAA'
)}

function _listings(FileAttachment){return(
FileAttachment("listings.csv").csv()
)}

function _processedData(listings){return(
listings
  .filter(d => d.latitude && d.longitude && d.price)
  .map(d => ({
    longitude: parseFloat(d.longitude),
    latitude: parseFloat(d.latitude),
    price: parseFloat(d.price),
    neighbourhood: d.neighbourhood,
    name: d.name,
    room_type: d.room_type
  }))
)}

function _top30Expensive(processedData){return(
processedData.sort((a, b) => b.price - a.price).slice(0, 30)
)}

function _map(html,mapboxgl)
{
  const container = html`<div style="width: 100%; height: 600px;"></div>`;
  const map = new mapboxgl.Map({
    container,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-58.3816, -34.6037], // Coordenadas de Buenos Aires
    zoom: 12
  });

  container.value = map;
  return container;
}


function _7($0,d3,mapboxgl,top30Expensive)
{
  const mapContainer = $0;
  const map = mapContainer.value;

  map.on('load', () => {
    const svg = d3.select(map.getCanvasContainer())
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .style("position", "absolute")
      .style("top", 0)
      .style("left", 0);

    function project(d) {
      return map.project(new mapboxgl.LngLat(d.longitude, d.latitude));
    }

    const colorScale = d3.scaleSequential(d3.interpolateReds)
      .domain(d3.extent(top30Expensive, d => d.price));

    const update = () => {
      svg.selectAll("circle")
        .data(top30Expensive)
        .join("circle")
        .attr("r", 10)
        .attr("fill", d => colorScale(d.price))
        .attr("stroke", "black")
        .attr("cx", d => project(d).x)
        .attr("cy", d => project(d).y)
        .append("title")
        .text(d => `${d.name}\n${d.room_type}\n${d.neighbourhood}\nPrecio: $${d.price}`);
    };

    map.on("viewreset", update);
    map.on("move", update);
    update();
  });

  return mapContainer;
}


function _top100Expensive(listings){return(
listings.sort((a, b) => b.price - a.price).slice(0, 100)
)}

function _listingsWithPriceRange(top100Expensive){return(
top100Expensive.map(d => ({
  ...d,
  radius: Math.sqrt(d.price) / 100,
  color: d.price < 5000 ? "#1f77b4" :
         d.price < 10000 ? "#ff7f0e" :
         d.price < 20000 ? "#2ca02c" :
         d.price < 50000 ? "#d62728" :
         "#9467bd"
}))
)}

function _map2(html,mapboxgl)
{
  let container = html`<div style="width: 100%; height: 600px;"></div>`;
  let map = new mapboxgl.Map({
    container,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-58.3816, -34.6037], // Coordenadas de Buenos Aires
    zoom: 12
  });

  container.value = map;
  return container;
}


function _11($0,d3,mapboxgl,listingsWithPriceRange)
{
  let mapContainer = $0;
  let map = mapContainer.value;

  map.on('load', () => {
    let svg = d3.select(map.getCanvasContainer())
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .style("position", "absolute")
      .style("top", 0)
      .style("left", 0);

    function project(d) {
      return map.project(new mapboxgl.LngLat(d.longitude, d.latitude));
    }

    let update = () => {
      let circles = svg.selectAll("circle")
        .data(listingsWithPriceRange)
        .join("circle")
        .attr("r", d => 5) // Tamaño pequeño y fijo
        .attr("fill", d => d.color)
        .attr("stroke", "black")
        .attr("cx", d => project(d).x)
        .attr("cy", d => project(d).y);

      circles.append("title")
        .text(d => `${d.name}\n${d.room_type}\n${d.neighbourhood}\nPrecio: $${d.price}`);
    };

    map.on("viewreset", update);
    map.on("move", update);
    update();
  });

  return mapContainer;
}


function _listingsByBarrio(d3,top30Expensive){return(
Array.from(d3.rollup(
  top30Expensive,
  v => v.length,
  d => d.neighbourhood
), ([neighbourhood, count]) => ({ neighbourhood, count }))
)}

function _13(Plot,listingsByBarrio){return(
Plot.plot({
  title: "Distribución de los 30 Listados Más Caros por Barrio",
  color: {
    scheme: "category10"
  },
  marks: [
    Plot.barY(listingsByBarrio, { x: "neighbourhood", y: "count", fill: "neighbourhood", sort: { x: "y", reverse: true } }),
    Plot.text(listingsByBarrio, { x: "neighbourhood", y: "count", text: "count", dy: -5 })
  ],
  x: {
    label: "Barrio",
    tickFormat: d => `${d.substring(0, 10)}...`
  },
  y: {
    label: "Número de Listados"
  },
  color: {
    legend: true
  }
})
)}

function _barrios(FileAttachment){return(
FileAttachment("barrios.csv").csv()
)}

function _barriosData(barrios){return(
new Map(barrios.map(d => [d.neighbourhood, d.comuna]))
)}

function _listingsWithComuna(listings,barriosData){return(
listings.map(listing => ({
  ...listing,
  comuna: barriosData.get(listing.neighbourhood)
}))
)}

function _d3(require){return(
require("d3@6")
)}

function _precio_x_barrio(d3,listingsWithComuna){return(
Array.from(
  d3.rollup(
    listingsWithComuna,
    v => ({
      precio_median: d3.median(v, d => parseFloat(d.price)),
      soporte: v.length
    }),
    d => d.neighbourhood
  ),
  ([neighbourhood, { precio_median, soporte }]) => ({
    neighbourhood,
    precio_median,
    soporte
  })
)
)}

function _min_publicaciones_x_barrio(Inputs){return(
Inputs.range([1, 500], {
  label: "umbral o soporte de publicaciones por barrio",
  step: 1,
  value: 100
})
)}

function _20(Plot,precio_x_barrio,min_publicaciones_x_barrio){return(
Plot.plot({
  marginLeft: 120,
  title: "Precio promedio por barrio",
  color: {
    type: "linear",
    legend: true
  },
  marks: [
    Plot.barX(
      precio_x_barrio.filter(d => d.soporte >= min_publicaciones_x_barrio),
      {
        x: "precio_median",
        y: "neighbourhood",
        sort: { y: "x", reverse: true },
        fill: "soporte",
        tip: true,
        title: d =>
          `En ${d.neighbourhood} el precio promedio (en realidad estoy usando la mediana) es: $${d.precio_median.toFixed(2)} dólares. (#soporte = ${d.soporte.toLocaleString("es-ar")})`
      }
    ),
    Plot.ruleX([0])
  ]
})
)}

function _barrio_seleccionado(Inputs,listings){return(
Inputs.select(
  new Set(listings.map((d) => d.neighbourhood)),
  { label: "Selecciona un barrio" }
)
)}

function _datos_filtrados(listings,barrio_seleccionado){return(
listings.filter(d => d.neighbourhood === barrio_seleccionado)
)}

function _datos_agrupados(d3,datos_filtrados){return(
Array.from(d3.rollup(
  datos_filtrados,
  v => v.length,
  d => d.room_type
), ([room_type, count]) => ({ room_type, count }))
)}

function _24(Plot,barrio_seleccionado,datos_agrupados){return(
Plot.plot({
  title: `Número de listados por tipo de habitación en ${barrio_seleccionado}`,
  marks: [
    Plot.barY(datos_agrupados, { x: "room_type", y: "count" })
  ],
  x: {
    label: "Tipo de habitación"
  },
  y: {
    label: "Número de listados"
  }
})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["listings.csv", {url: new URL("./files/592756c101180d7605585ce7aa324c10455a59a7fd0a6a29b130c43f74c34d7cc760b42f7743c5478c191b11d217c69b9e61598b6e2a03ab26b5bcb6f470a2cf.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["barrios.csv", {url: new URL("./files/cb3a3e975a8cad3b3cb6fc1b950f227b116c553b6e22465c0b5b4527f5f0001fff5e9280805954fdb06a10c230836c50c28edc944f8280a809aac9ce36777bc7.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("mapboxgl")).define("mapboxgl", ["require"], _mapboxgl);
  main.variable(observer()).define(["mapboxgl"], _2);
  main.variable(observer("listings")).define("listings", ["FileAttachment"], _listings);
  main.variable(observer("processedData")).define("processedData", ["listings"], _processedData);
  main.variable(observer("top30Expensive")).define("top30Expensive", ["processedData"], _top30Expensive);
  main.variable(observer("viewof map")).define("viewof map", ["html","mapboxgl"], _map);
  main.variable(observer("map")).define("map", ["Generators", "viewof map"], (G, _) => G.input(_));
  main.variable(observer()).define(["viewof map","d3","mapboxgl","top30Expensive"], _7);
  main.variable(observer("top100Expensive")).define("top100Expensive", ["listings"], _top100Expensive);
  main.variable(observer("listingsWithPriceRange")).define("listingsWithPriceRange", ["top100Expensive"], _listingsWithPriceRange);
  main.variable(observer("viewof map2")).define("viewof map2", ["html","mapboxgl"], _map2);
  main.variable(observer("map2")).define("map2", ["Generators", "viewof map2"], (G, _) => G.input(_));
  main.variable(observer()).define(["viewof map2","d3","mapboxgl","listingsWithPriceRange"], _11);
  main.variable(observer("listingsByBarrio")).define("listingsByBarrio", ["d3","top30Expensive"], _listingsByBarrio);
  main.variable(observer()).define(["Plot","listingsByBarrio"], _13);
  main.variable(observer("barrios")).define("barrios", ["FileAttachment"], _barrios);
  main.variable(observer("barriosData")).define("barriosData", ["barrios"], _barriosData);
  main.variable(observer("listingsWithComuna")).define("listingsWithComuna", ["listings","barriosData"], _listingsWithComuna);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("precio_x_barrio")).define("precio_x_barrio", ["d3","listingsWithComuna"], _precio_x_barrio);
  main.variable(observer("viewof min_publicaciones_x_barrio")).define("viewof min_publicaciones_x_barrio", ["Inputs"], _min_publicaciones_x_barrio);
  main.variable(observer("min_publicaciones_x_barrio")).define("min_publicaciones_x_barrio", ["Generators", "viewof min_publicaciones_x_barrio"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","precio_x_barrio","min_publicaciones_x_barrio"], _20);
  main.variable(observer("viewof barrio_seleccionado")).define("viewof barrio_seleccionado", ["Inputs","listings"], _barrio_seleccionado);
  main.variable(observer("barrio_seleccionado")).define("barrio_seleccionado", ["Generators", "viewof barrio_seleccionado"], (G, _) => G.input(_));
  main.variable(observer("datos_filtrados")).define("datos_filtrados", ["listings","barrio_seleccionado"], _datos_filtrados);
  main.variable(observer("datos_agrupados")).define("datos_agrupados", ["d3","datos_filtrados"], _datos_agrupados);
  main.variable(observer()).define(["Plot","barrio_seleccionado","datos_agrupados"], _24);
  return main;
}
