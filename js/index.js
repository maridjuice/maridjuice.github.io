var margin = {
        top: 100,
        right: 20,
        bottom: 30,
        left: 100
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.timeParse('%Y%m%d'); //Gives the format in which a date is given, in this case it will be YearMonthDay,19010131 for example, then parses it into an object with a date

var x = d3.scaleTime() //This tells d3 the data on the x axis is of a date format
    .range([0, width]); //this says what the range of the graph will be and where it starts. Now it starts at 0, all the way to the left, and ends at the size of the graph area, which is 960 in width - http://www.d3noob.org/2012/12/setting-scales-domains-and-ranges-in.html

var y = d3.scaleLinear() //.range scales the domain to a certain scale, then scale.linear configures which interval amount is set between steps
    .range([height, 0]); //this scales the domain given later in the code to a given height. the range is now the height of the svg, which is 500. This is done so that any amount of data can be fit into this range. So for example if the data goes to 2000, it is still scaled to the height of the svg, 500. //https://www.dashingd3js.com/d3js-scales


var xAxis = d3.axisBottom(x); //function that defines where the x axis is places - which is at the bottom with the scale and range information given in the above variable x

//var xAxis = d3.svg.axis() 
//    .scale(x)
//    .orient("bottom");

var yAxis = d3.axisLeft(y); //Same as above, but for the y axis - its placed on the left side

//var yAxis = d3.svg.axis() 
//    .scale(y)
//    .orient("left");

//var area = d3.svg.area() - oude code
var area = d3.line() //This function will take in the data array that is passed to D3.js and extract the the set x,y coordinates. In this case it returns the date field from the csv to x and the temp field to y. - https://www.dashingd3js.com/svg-paths-and-d3js
    .x(function (d) {
        return x(d.date);
    })
    .y(function (d) {
        return y(d.temp);
    });

var svg = d3.select("body").append("svg") //
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("temperature.csv", function (error, data) { //From now on the data in temperature.csv is loaded into the parameter data
    if (error) throw error; //this gives an error if something is wrong

    data.forEach(function (d) { //processes each data field in the parameter data, which we loaded in before with d3.csv etc..
        d.date = parseDate(d.date); //all data under the field .date from the csv is processed into an actual date - this "parseDate" function was defined earlier using "d3.time.format("%Y%m%d").parse;" on line 10.
        d.temp = +d.temp; //processes each field under "temp" in a logical order
    });

    x.domain(d3.extent(data, function (d) {
        return d.date; //returns all date values in data to the .extent function which finds the minimum and maximum values in the array, whereafter the .domain function returns those values to d3 as the range for the x axis - http://www.d3noob.org/2012/12/setting-scales-domains-and-ranges-in.html
    }));

    y.domain(d3.extent(data, function (d) {
        return d.temp; //The same happens here as bove but then for the y axis. This lets d3 know what the scope of data will be, which is then passed onto the scale
    }));

    svg.append("path") //plaatst path in de svg
        .datum(data) //gets all data from variable data and puts them in the element path - using .datum grabs all these elements as loose objects as opposed to using .data, which creates one big line of data  - https://github.com/d3/d3-selection/blob/master/README.md#selection_datum
        .attr("class", "area") //Gives the path the class with the name area
        .attr("d", area); // gives the attribute d strings obtained from the variable "area". The variable area was previously filled with the values of the date and temp fields from the csv and returned to the d3.svg.area function - which then fills the path of the svg - https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d

    svg.append("g") //places the g element in the svg, which groups shapes together - https://stackoverflow.com/questions/17057809/d3-js-what-is-g-in-appendg-d3-js-code
        .attr("class", "x axis") //gives the g element the class of x and axis
        .attr("transform", "translate(0," + height + ")") //transform and translate moves the group to the coordinates 0 and height. Height is 500, which was given earlier in this file, so it places the g on the coordinates 0,500. Which means it starts completely left and 500 pixels from the top.
        .call(xAxis) //calls the variable xAxis which contains a function the scales the data to the x axis 
        .append("text")
        .text("Years")
        .attr("x", 400)
        .attr("y", 75);

    svg.append("g") //creates another group inside the svg
        .attr("class", "y axis") // gives the group the classes y and axis
        .call(yAxis) //calls the yAxis variable which contains a function
        .append("text") //places text in the group
        .attr("transform", "rotate(-90)") //rotates the text 90 degrees
        .attr("y", 0) //places the text 6px from the left of the svg, because it was rotated.
        .attr("x", -90)

    .attr("dy", "-2.71em") //places the element, text, on the y axis of the y axis. - https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/dy
        .style("text-anchor", "end") //alligns the the text to the end //https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor
        .attr("fill", "#000") //Makes it white
        .text("Temperature (ºF)"); //adds the actual text
});