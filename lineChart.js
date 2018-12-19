
function LineChart(selectedYear){
  
  d3.select("#linechart").selectAll("svg").remove();
  
  var store = {}
  var data = [{name : "POINTS", values : []}]
    function showData() {
        store.points.forEach(function (d){
            data[0].values.push(d)
        });
        var width = 1000;
  var height = 300;
  var margin = 50;
  var duration = 250;
  
  var lineOpacity = "0.25";
  var lineOpacityHover = "0.85";
  var otherLinesOpacityHover = "0.1";
  var lineStroke = "2.5px";
  var lineStrokeHover = "3.5px";
  
  var circleOpacity = '0.85';
  var circleOpacityOnLineHover = "0.25"
  var circleRadius = 4;
  var circleRadiusHover = 8;
  
  
  /* Format Data */
  var parseDate = d3.timeParse("%Y");
  data.forEach(function(d) { 
    d.values.forEach(function(d) {
      d.year = d.date;
      d.date = parseDate(d.date);
      d.points = +d.points;    
    });
  });
  
  /* Scale */
  var xScale = d3.scaleTime()
    .domain(d3.extent(data[0].values, d => d.date))
    .range([0, width-margin]);
  
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data[0].values, d => d.points)])
    .range([height-margin, 0]);
  
  var color = d3.scaleOrdinal(d3.schemeCategory10);
  var newColor = d3.scaleOrdinal()
        .domain([1, 2, 3, 4])
        .range(['ca0020', 'f4a582', '80cdc1', '0571b0']);

  var div = d3.select("body").append("div")    
   .attr("class", "tooltip")                
   .style("opacity", 0);
  
  /* Add SVG */
  var svg = d3.select("#linechart").append("svg")
    .attr("width", (width+margin)+"px")
    .attr("height", (height+margin)+"px")
    .append('g')
    .attr("transform", `translate(${margin}, ${margin})`);
  
  
  /* Add line into SVG */
  var line = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.points));
  
  let lines = svg.append('g')
    .attr('class', 'lines');
  
  lines.selectAll('.line-group')
    .data(data).enter()
    .append('g')
    .attr('class', 'line-group')  
    .on("mouseover", function(d, i) {
        svg.append("text")
          .attr("class", "title-text")
          .style("fill", color(i))        
          .attr("text-anchor", "middle")
          .attr("x", (2*(width-margin)/3))
          .attr("y", 5);
      })
    .on("mouseout", function(d) {
        svg.select(".title-text").remove();
      })
    .append('path')
    .attr('class', 'line')  
    .attr('d', d => line(d.values))
    .style('stroke', (d, i) => color(i))
    .style('opacity', lineOpacity)
    .on("mouseover", function(d) {
        d3.selectAll('.line')
                      .style('opacity', otherLinesOpacityHover);
        d3.selectAll('.circle')
                      .style('opacity', circleOpacityOnLineHover);
        d3.select(this)
          .style('opacity', lineOpacityHover)
          .style("stroke-width", lineStrokeHover)
          .style("cursor", "pointer");
      })
    .on("mouseout", function(d) {
        d3.selectAll(".line")
                      .style('opacity', lineOpacity);
        d3.selectAll('.circle')
                      .style('opacity', circleOpacity);
        d3.select(this)
          .style("stroke-width", lineStroke)
          .style("cursor", "none");
      });
  
  
  /* Add circles in the line */
  lines.selectAll("circle-group")
    .data(data).enter()
    .append("g")
    .attr('class', 'testingCircle')  
    .selectAll("circle")
    .data(d => d.values).enter()
    .append("g")
    .attr("id", d => d.year)
    // .style("fill", function(d) { 
    //   console.log(d);
    //   console.log(parseInt(d.position)/4)
    //   return newColor(parseInt(d.position)/4); })
    .style("fill", d => newColor(Math.ceil(parseInt(d.position)/5)))
    // .style("fill", d => newColor(1))
    .attr("class", "circle")  
    .on("mouseover", function(d) {
        div.transition()        
               .duration(200)        
               .style("opacity", .9);
        div    .html("Points: " + d.points + "<br/>Position: "  + d.position)    
               .style("left", (d3.event.pageX) + "px")        
               .style("top", (d3.event.pageY - 28) + "px");
      })
    .on("mouseout", function(d) {
        div.transition()        
               .duration(500)        
               .style("opacity", 0);
      })
    .append("circle")
    .attr("id", d => "circle"+d.year)
    .attr("cx", d => xScale(d.date))
    .attr("cy", d => yScale(d.points))
    .attr("r", function(d) {
      if(d.year == selectedYear){
        return 7;
      } else{
        return circleRadius;
      }
    })
    .style('opacity', circleOpacity)
    .on("mouseover", function(d) {
          d3.select(this)
            .transition()
            .duration(duration)
            .attr("r", circleRadiusHover);
        })
      .on("mouseout", function(d) {
          d3.select(this) 
            .transition()
            .duration(duration)
            .attr("r", circleRadius);  
        });
  
  /* Add Axis into SVG */
  var xAxis = d3.axisBottom(xScale).ticks(5);
  var yAxis = d3.axisLeft(yScale).ticks(5);
  
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height-margin})`)
    .call(xAxis);
  
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append('text')
    .attr("y", 15)
    .attr("transform", "rotate(-90)")
    .attr("fill", "#000")
    .text("Total points");
  
    //D3 Horizontal Legend//////////////////////////
    var legendVals2 = ["1st - 5th", "6th - 10th", "11th - 15th", "16th - 20th"]
    var current = 0
    var previousLength = 0
    var legend3 = svg.selectAll('.legend3')
        .data(legendVals2)
        .enter().append('g')
        .attr("class", "legends3")
        .attr("transform", function (d, i) {
            {   
                index = parseInt(i)
                if(index == 0){
                    current = 0
                    previousLength = (9 * parseInt(d.length)) + 30
                } else{
                    current = previousLength
                    previousLength = (9 * parseInt(d.length)) + current + 30
                }
                return "translate(" + current + ", 0)"
            }
        })

    legend3.append('rect')
        .attr("x", 40)
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function (d, i) {
            return newColor(i+1)
        })

    legend3.append('text')
        .attr("x", 60)
        .attr("y", 10)
        .text(function (d, i) {
            return d
        })
        .attr("class", "textselected")
        .style("text-anchor", "start")
        .style("font-size", 15)
  
  }

  function loadData() {
        return Promise.all([
            d3.csv("points.csv"),
        ]).then(datasets => {
            store.points = datasets[0];
            return store;
        })
    }
    loadData().then(showData);
  }
