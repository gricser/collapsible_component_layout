import define1 from "./450051d7f1174df8@255.js";

function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Temporal force-directed graph</h1><a href="https://d3js.org/">D3</a> › <a href="/@d3/gallery">Gallery</a></div>

# Temporal force-directed graph

This notebook visualizes a temporal network which [changes over time](/@d3/modifying-a-force-directed-graph). Each node and link has a *start* and *end* specifying its existence. The data here represents face-to-face interactions at a two-day conference. Data: [SocioPatterns](/@d3/sfhh-conference-data)`
)}

function _time(Scrubber,times){return(
Scrubber(times, {
  delay: 100, 
  loop: true,
  format: date => date.toLocaleString("en", {
    month: "long", 
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "UTC"
  })
})
)}

function _chart(d3,invalidation,drag)
{
  const width = 928;
  const height = 680;

  const simulation = d3.forceSimulation()
      .force("charge", d3.forceManyBody())
      .force("link", d3.forceLink().id(d => d.id))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .on("tick", ticked);

  const svg = d3.create("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto;");

  let link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
    .selectAll("line");

  let node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll("circle");

  function ticked() {
    node.attr("cx", d => d.x)
        .attr("cy", d => d.y);

    link.attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
  }

  invalidation.then(() => simulation.stop());

  return Object.assign(svg.node(), {
    update({nodes, links}) {

      // Make a shallow copy to protect against mutation, while
      // recycling old nodes to preserve position and velocity.
      const old = new Map(node.data().map(d => [d.id, d]));
      nodes = nodes.map(d => ({...old.get(d.id), ... d}));
      links = links.map(d => ({...d}));

      node = node
        .data(nodes, d => d.id)
        .join(enter => enter.append("circle")
          .attr("r", 5)
          .call(drag(simulation))
          .call(node => node.append("title").text(d => d.id)));

      link = link
        .data(links, d => [d.source, d.target])
        .join("line");

      simulation.nodes(nodes);
      simulation.force("link").links(links);
      simulation.alpha(1).restart().tick();
      ticked(); // render now!
    }
  });
}


function _update(data,contains,time,chart)
{
  const nodes = data.nodes.filter(d => contains(d, time));
  const links = data.links.filter(d => contains(d, time));
  chart.update({nodes, links});
}


async function _data(FileAttachment,d3)
{
  const {nodes, links} = await FileAttachment("sfhh@4.json").json();
  for (const d of [...nodes, ...links]) {
    d.start = d3.isoParse(d.start);
    d.end = d3.isoParse(d.end);
  };
  return {nodes, links};
}


function _times(d3,data,contains){return(
d3.scaleTime()
  .domain([d3.min(data.nodes, d => d.start), d3.max(data.nodes, d => d.end)])
  .ticks(1000)
  .filter(time => data.nodes.some(d => contains(d, time)))
)}

function _contains(){return(
({start, end}, time) => start <= time && time < end
)}

function _drag(d3){return(
simulation => {
  
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["sfhh@4.json", {url: new URL("./files/5c0e56b44362ec8e2621299d2ddce5ac68e4e1b11e08ac4547075b0e6374d9083a589eec442479ef7876be75215b8499cf9463743191cfe01e4ca3cb826135e5.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof time")).define("viewof time", ["Scrubber","times"], _time);
  main.variable(observer("time")).define("time", ["Generators", "viewof time"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["d3","invalidation","drag"], _chart);
  main.variable(observer("update")).define("update", ["data","contains","time","chart"], _update);
  main.variable(observer("data")).define("data", ["FileAttachment","d3"], _data);
  main.variable(observer("times")).define("times", ["d3","data","contains"], _times);
  main.variable(observer("contains")).define("contains", _contains);
  main.variable(observer("drag")).define("drag", ["d3"], _drag);
  const child1 = runtime.module(define1);
  main.import("Scrubber", child1);
  return main;
}
