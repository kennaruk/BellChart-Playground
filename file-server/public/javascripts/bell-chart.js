function gaussian_pdf(x, mean, sigma) {
	var gaussianConstant = 1 / Math.sqrt(2 * Math.PI),
    x = (x - mean) / sigma;
    return gaussianConstant * Math.exp(-.5 * x * x) / sigma;
};

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
    .x(function(d) {  return x(d.value); })
    .y(function(d) {  return y(d.distribution); })
    .curve(d3.curveCatmullRom.alpha(0.5));

//Adds the svg canvas
var svg = d3.select("#bell-chart")
    .append("svg")
    .attr("width", width+margin.left+margin.right)
    .attr("height", height+margin.top+margin.bottom)
    .append("g")
    .attr("transform",
            "translate("+margin.left+","+margin.top+")");

d3.csv("BellCurve.csv", function(error, data) {

    filterDataByDate(data, new Date("01/01/18"), new Date("01/02/18"))

    //Sort data descending
    data.sort(function(a,b) {
        return d3.descending(+a.value, +b.value);
    });

    //Preparing Data
    var sum = 0, count = 0, values = [];
    data.forEach(function(d) {
        d.value = +d.value;

        values.push(d.value)
        sum += d.value;
        count ++;
    });

    //Calculated average, std, distribution
    var average = sum/count;
    var std = math.std(values);

    data.forEach(function(d) {
        d.distribution = +gaussian_pdf(d.value, average, std);
    });

    //Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.value; }));
    y.domain([d3.max(data, function(d) { return d.distribution; }), 0]);

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

var startDate = new Date("2015-08-04");
var endDate = new Date("2015-08-12");

function filterDataByDate(data, startDate, endDate) {
    var resultProductData = data.filter(function (a) {
        var date = new Date(a.date) || {};
        return date >= startDate && date <= endDate;
        // console.log(a)
        // var hitDates = a.date || {};
        // extract all date strings
        // console.log(hitDates);
        
        // hitDates = Object.keys(hitDates);
        // improvement: use some. this is an improment because .map()
        // and .filter() are walking through all elements.
        // .some() stops this process if one item is found that returns true in the callback function and returns true for the whole expression
        // hitDateMatchExists = hitDates.some(function(dateStr) {
        //     var date = new Date(dateStr);
        //     return date >= startDate && date <= endDate
        // });
        return hitDateMatchExists;
    });;
    console.log(resultProductData);
}


