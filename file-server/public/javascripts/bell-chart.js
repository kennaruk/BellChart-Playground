// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

//Set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([0, height]);

//Define the axes
var xAxis = d3.axisBottom().scale(x).ticks(5);
var yAxis = d3.axisLeft().scale(y).ticks(5);

//Define the line
var valueline = d3.line()
.x(function(d) { return x(d.force); })
.y(function(d) { return y(d.occur); })
.curve(d3.curveCatmullRom.alpha(0.5));

//Adds the svg canvas
var svg = d3.select("#bell-chart")
.append("svg")
.attr("width", width+margin.left+margin.right)
.attr("height", height+margin.top+margin.bottom)
.append("g")
.attr("transform",
        "translate("+margin.left+","+margin.top+")");

d3.csv("data.csv", function(error, data) {
data.forEach(function(d) {
    d.force = +d.force;
    d.occur = +d.occur;
    // console.log(d)
});

//Scale the range of the data
// x.domain(d3.extent(data, function(d) { return d.force; }));
x.domain([0, 300]);
y.domain([500, 0]);
// y.domain([500, d3.max(data, function(d) { return d.occur; })]);

//Add the valueline path.
svg.append("path")
    .attr("class", "line")
    .attr("d", valueline(data));

//Add the X Axis
svg.append("g")
    .attr("class", "a axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)

//Add the Y Axis
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
});