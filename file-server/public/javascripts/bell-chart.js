
//Tag ID
var fromDateId = "#date-picker-from";
var toDateId  = "#date-picker-to";
var dateTimeWidthId = "#date-time-width";
var dateTimeWidthTypeId = "#date-time-select option:selected";
var dateTimeBoundFromId = "#date-time-bound-from";
var dateTimeBoundToId = "#date-time-bound-to";

//Variable
var dateFormat = "MM/DD/YYYY";
var fileName = "BellCurve.csv";

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


function filterDataByDate(data, startDate, endDate) {
    console.log(endDate.format('ll'))
    var resultProductData = data.filter(function (a) {
        var date = moment(a.date, dateFormat);
        // console.log(date.format('ll')+' '+startDate.format('ll')+': '+date.isAfter(startDate));
        
        // var date = new Date(a.date) || {};
        return (date.isSameOrAfter(startDate) && date.isSameOrBefore(endDate));
    });
    return resultProductData;
}
function updateBoundFromTo(fromDate, toDate) {
    let dateTimeBoundFromId = "#date-time-bound-from";
    let dateTimeBoundToId = "#date-time-bound-to";
    $(dateTimeBoundFromId).text(fromDate.format('ll'));
    $(dateTimeBoundToId).text(toDate.format('ll'));
}
function updateDataByFromToDate(data, fromDate, toDate) {
    
    data = filterDataByDate(data, fromDate, toDate);
    if(data.length == 0) {
        console.log('no data was found in this range.')
        return;
    }

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

    var svg = d3.select("#bell-chart").transition();
    svg.select(".line")   // change the line
        .duration(0)
        .attr("d", valueline(data));
    svg.select(".x.axis") // change the x axis
        .duration(750)
        .call(xAxis);
    svg.select(".y.axis") // change the y axis
        .duration(750)
        .call(yAxis);
}

// function updateDataByDate() {

//     //From and To DatePicker value
//     var fromDate = $('#date-picker-from').val();
//     if(fromDate == "") {
//         console.log('fromDate not filled.')
//         return
//     }
//     var toDate = $('#date-picker-to').val();
//     if(toDate == "") {
//         console.log('toDate not filled.')
//         return
//     }
//     // console.log('fromDate: '+fromDate)
//     // console.log(new Date(fromDate))

//     var startDate = new Date(fromDate);
//     var endDate = new Date(toDate);
    
//     d3.csv("BellCurve.csv", function(error, data) {
//         //Sort data descending
//         data.sort(function(a,b) {
//             return d3.descending(+a.value, +b.value);
//         });
        
//         data = filterDataByDate(data, startDate, endDate);
//         if(data.length == 0) {
//             console.log('no data was found in this range.')
//             return;
//         }
//         // console.log('dataAfterFilter: '+data);
//         //Preparing Data
//         var sum = 0, count = 0, values = [];
//         data.forEach(function(d) {
//             d.value = +d.value;

//             values.push(d.value)
//             sum += d.value;
//             count ++;
//         });

//         //Calculated average, std, distribution
//         var average = sum/count;
//         var std = math.std(values);

//         data.forEach(function(d) {
//             d.distribution = +gaussian_pdf(d.value, average, std);
//         });

//         //Scale the range of the data
//         x.domain(d3.extent(data, function(d) { return d.value; }));
//         y.domain([d3.max(data, function(d) { return d.distribution; }), 0]);

//         var svg = d3.select("#bell-chart").transition();
//         svg.select(".line")   // change the line
//             .duration(0)
//             .attr("d", valueline(data));
//         svg.select(".x.axis") // change the x axis
//             .duration(750)
//             .call(xAxis);
//         svg.select(".y.axis") // change the y axis
//             .duration(750)
//             .call(yAxis);
//     });
// }
var intervalVariable;
function playButton() {
    //Variable
    var intervalTime = 1500;
    

    //Get From and To Date
    let fromDateVal = $(fromDateId).val();
    if(fromDateVal == "") {
        console.log("fromDate not filled.");
        return;
    }
    let startDate = moment(fromDateVal, dateFormat);

    let toDateVal = $(toDateId).val();
    if(toDateVal == "") {
        console.log("toDate not filled.");
        return;
    }
    let endDate = moment(toDateVal, dateFormat);
    
    //Get Date/Time width
    let width = $(dateTimeWidthId).val();
    if(width == "") {
        console.log("width not filled.")
        return;
    }
    width = parseInt(width); //String to int
    let widthType = $(dateTimeWidthTypeId).val();

    //Get Data
    let JSONdata;
    d3.csv(fileName, function(error, data) {
        //Sort data descending
        data.sort(function(a,b) {
            return d3.descending(+a.value, +b.value);
        });
        JSONdata = data;
        
        //Re-render Bell Curve
        intervalVariable = setInterval(increaseDateByTime, intervalTime);
        function increaseDateByTime() {
            // console.log(startDate.format("DD MM YYYY"))
            let startDateWithWidth = startDate.clone();
            startDateWithWidth = startDateWithWidth.add(width, widthType);

            if(startDate.isAfter(endDate)) {
                console.log("Reached toDate.")
                stopInterval();
                return;
            }

            updateDataByFromToDate(JSONdata, startDate, startDateWithWidth);
            updateBoundFromTo(startDate, startDateWithWidth);
            startDate.add(width, widthType);
        }
    });
}
function stopInterval() {
    clearInterval(intervalVariable);
}
function stopButton() {
    stopInterval();
}