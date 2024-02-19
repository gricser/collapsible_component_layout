function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Disjoint force-directed graph</h1><a href="https://d3js.org/">D3</a> › <a href="/@d3/gallery">Gallery</a></div>

# Nested components with top level dependencies

When using [D3’s force layout](https://d3js.org/d3-force) with a disjoint graph, you typically want the [positioning forces](https://d3js.org/d3-force/position) (d3.forceX and d3.forceY) instead of the [centering force](https://d3js.org/d3-force/center) (d3.forceCenter). The positioning forces, unlike the centering force, prevent detached subgraphs from escaping the viewport.`
)}

function constant(_) {
  return function () { return _ }
}

function _chart(d3,data,invalidation)
{
  // Specify the dimensions of the chart.
  const width = 928;
  const height = 680;

  // Specify the color scale.
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // The force simulation mutates links and nodes, so create a copy
  // so that re-evaluating this cell produces the same result.
  const links = data.links.map(d => ({...d}));
  const nodes = data.nodes.map(d => ({...d}));

  // const collisionForce = rectCollide()
  //     .size(function(d){return [d.width,d.height]});

  // Create a simulation with several forces.
  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("collide", d3.forceCollide(d => 80))
      // .force("collision", rectCollide().size(function(d){ return [d.width, d.height]} ))
      .force("x", d3.forceX(width / 2))
      .force("y", d3.forceY(height / 2));

  const container = d3.select("body").append("div")
      .attr("skyid", "container")
      .style("width", width + "px")
      .style("height", height + "px");

  const node = container.selectAll("div")
      .data(nodes)
      .join("div")
      .attr("class", "job");

  // Create the SVG container for the links.
  const svg = container.append("svg")
      .attr("width", width)
      .attr("height", height)
      // .attr("viewBox", [-width / 2, -height / 2, width, height])
      // .attr("style", "max-width: 100%; height: auto;");

  // Add a line for each link, and a circle for each node.
  const link = svg.append("g")
      .attr("stroke", "cyan")
      .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value));


  node.text(d => d.id);

  // Add a drag behavior.
  node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
  
  // Set the position attributes of links and nodes each time the simulation ticks.
  simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);


    // node
    //     .attr("cx", d => d.x)
    //     .attr("cy", d => d.y);
    node
        .style("left", function (d, i) { console.log(this.getBoundingClientRect()); return d.x - this.getBoundingClientRect().width / 2 + 'px'; })
        .style("top", function (d) { return d.y - this.getBoundingClientRect().height / 2 + 'px'; })
  });

  // Reheat the simulation when drag starts, and fix the subject position.
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  // Update the subject (dragged node) position during drag.
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  // Restore the target alpha so the simulation cools after dragging ends.
  // Unfix the subject position now that it’s no longer being dragged.
  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }


  // When this cell is re-run, stop the previous simulation. (This doesn’t
  // really matter since the target alpha is zero and the simulation will
  // stop naturally, but it’s a good practice.)
  invalidation.then(() => simulation.stop());

  return container.node();
}


function _data() {return(
    {
      "nodes": [
        {"id": "job_1", "name": "Job 1", "group": "Cited Works", "radius": 1, "citing_patents_count": 1},
        {"id": "job_2", "name": "Job 2", "group": "Cited Works", "radius": 1, "citing_patents_count": 1},
        {"id": "job_3", "name": "Job 3", "group": "Cited Works", "radius": 1, "citing_patents_count": 1},
        {"id": "job_4", "name": "Job 4", "group": "Cited Works", "radius": 1, "citing_patents_count": 1},
        {"id": "job_5", "name": "Job 5", "group": "Cited Works", "radius": 1, "citing_patents_count": 1},
        {"id": "job_6", "name": "Job 6", "group": "Cited Works", "radius": 1, "citing_patents_count": 1},
        {"id": "job_7", "name": "Job 7", "group": "Cited Works", "radius": 1, "citing_patents_count": 1},
        {"id": "job_8", "name": "Job 8", "group": "Cited Works", "radius": 1, "citing_patents_count": 1},
        {"id": "job_9", "name": "Job 9", "group": "Cited Works", "radius": 1, "citing_patents_count": 1},
        {"id": "job_10", "name": "Job 10", "group": "Cited Works", "radius": 1, "citing_patents_count": 1},
      ],
      "links": [
        {"source": "job_1", "target": "job_2", "value": 2},
        {"source": "job_1", "target": "job_3", "value": 2},
        {"source": "job_1", "target": "job_6", "value": 2},
        {"source": "job_4", "target": "job_2", "value": 2},
        {"source": "job_4", "target": "job_8", "value": 2},
        {"source": "job_5", "target": "job_8", "value": 2},
        {"source": "job_6", "target": "job_7", "value": 2},
        {"source": "job_7", "target": "job_9", "value": 2},
        {"source": "job_7", "target": "job_8", "value": 2},
        {"source": "job_8", "target": "job_9", "value": 2},
      ]
    }
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  // const fileAttachments = new Map([
  //   ["graph.json", {url: new URL("./files/e3680d5f766e85edde560c9c31a6dba2ddfcf2f66e1dced4afa18d8040f1f205e0bde1b8b234d866373f2bfc5806fafc47e244c5c9f48b60aaa1917c1b80fcb7.json", import.meta.url), mimeType: "application/json", toString}]
  // ]);
  // main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("chart")).define("chart", ["d3","data","invalidation"], _chart);
  main.variable(observer("data")).define("data", [], _data);
  return main;
}
