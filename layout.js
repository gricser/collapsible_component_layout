/* container */
var
    wI = 900,
    hI = 600,
    w = wI + "px",
    h = hI + "px",
    r = 100,
    // The following commented line and the line below it accomplish the same
    // thing.
    components = d3.range(10).map(Object);
//nodes = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];


var nearest = function(n, range){
    return Math.round(n/range) * range;
};


var vis = d3.select("body").select("#container")
    .style("width", w)
    .style("height", h);

/* Force paramettring */
var force = d3.layout.force()
    .size([wI, hI]) // gravity field's size(x, y)
    .friction(.8) // 1 = frictionless
    .charge(0)
    .theta(.8)
    .gravity(0)
    .nodes(components)
    .links([])
    .start();

label = d3.select('span');



/*Associate the divs with the node objects. */
var node = vis.selectAll("div")
    .data(components)
    .attr("class", function(d, i){return 'node' + i;})
    .style("left", function(d) { return d.x + 50 + "px"; }) //x
    .style("top", function(d) { return d.y + 50 + "px"; }) //y
    .style("width", r + "px")
    .style("height", r + "px")
    .style("background-color", 'red')
    .call(force.drag);


/* Start transition */
vis.style("opacity", 1e-6)
    .transition()
    .duration(1000)
    .style("opacity", 1)
    .style("background-color", "#2e2e2e");
//force.alpha(-1);
/* Force application*/

var colliders = d3.set([]);
var nonColliders = d3.set([]);

force.on("tick", function(e) {
    // Get items coords (then whole force's maths managed by D3)
    //force.alpha(-1);

    var q = d3.geom.quadtree(components),
        i = 0,
        n = components.length;

    for (var i = 0; i<n; i++)
        q.visit(collide(components[i]))


    var k = .6 * e.alpha;
    components.forEach(function(o, i) {
        if (o.x > 800) o.x += (680 - o.x) * k;
        if (o.y > 500) o.y += (420 - o.y) * k;
        if (o.x < 0) o.x = 0
        if (o.y < 0) o.y = 0
        o.x += (nearest(o.x, 60) - o.x) * k;
        o.y += (nearest(o.y, 60) - o.y) * k;


    });


    node.style("left", function(d, i) {


        return d.x + 'px';


    })
        .style("top", function(d) {
            return d.y + 'px';


        })
});


function collide(nodey) {
    var r = 60,
        nx1 = nodey.x - r,
        nx2 = nodey.x + r,
        ny1 = nodey.y - r,
        ny2 = nodey.y + r;
    return function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== nodey)) {
            var x = nodey.x - quad.point.x,
                y = nodey.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = 120;
            if (l < r) {
                l = (l - r) / l * .5;
                nodey.x -= x *= l;
                nodey.y -= y *= l;
            }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    };
}

