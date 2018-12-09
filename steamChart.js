function SteamChart(){
var data3
        d3.csv('money.csv')
            .then(function (d) {

                //console.log(d)

                var nested_data = d3.nest()
                    .key(function (d) {
                        return d.Year;
                    })
                    .entries(d);

                //console.log(nested_data);

                var mqpdata = nested_data.map(function (d) {
                    var obj = {
                        month: new Date(d.key, 0, 1)

                    }
                    d.values.forEach(function (v) {
                        obj[v.Team] = v.Value;
                        //console.log(v.Value)
                    })

                    return obj;
                })


                d3.csv('t2.csv')
                    .then(function (d) {
                        data3 = d
                        //console.log(d);
                    })


                buildStreamGraph(mqpdata);

            })

        function buildStreamGraph(mqpdata) {
            var data = mqpdata;
            var stack = d3.stack()
                .keys(["Manchester United", "Manchester city", "Chelsea", "Liverpool", "Arsenal"])
                .order(d3.stackOrderNone)
                .offset(d3.stackOffsetWiggle);

            var series = stack(data);

            var width = 1150,
                height = 500;

            var x = d3.scaleTime()
                .domain(d3.extent(data, function (d) {
                    return d.month;

                }))
                .range([0, width - 200]);

            // setup axis
            var xAxis = d3.axisBottom(x);

            var y = d3.scaleLinear()
                .domain([0, d3.max(series, function (layer) {
                    return d3.max(layer, function (d) {
                        return d[0] + d[1];
                    });
                })])
                .range([height / 2, -200]);

            var color = d3.scaleOrdinal()
                .domain(data.map(d => d.key))
                .range([d3.rgb("#984ea3"), d3.rgb('#e41a1c'), d3.rgb('#377eb8'), d3.rgb('#4daf4a'), d3.rgb('#ff7f00')])

            //     .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);
            // var color = d3.scale.linear().domain([1, length])
            //     .interpolate(d3.interpolateHcl)

            var area = d3.area()
                .x(function (d) {
                    //console.info('in area function', d);
                    return x(d.data.month);
                })
                .y0(function (d) {
                    return y(d[0]);
                })
                .y1(function (d) {
                    return y(d[1]);
                })
                .curve(d3.curveBasis);

            var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip");

            var svg = d3.select("#steamChart").append("svg")
                .attr("width", 1000)
                .attr("height", 300);

            var parseTime = d3.timeParse("%Y")

            svg.selectAll("path")
                .data(series)
                .enter().append("path")
                .attr("d", area)
                .attr("data-legend", function (d) {
                    return d.key
                })
                .style("fill", d => color(d.key))
                .on('mouseover', function (d) {
                    mousex = d3.mouse(this);
                    mousex = mousex[0];
                    var invertedx = x.invert(mousex);

                    //console.log(invertedx)
                    var finalyear = invertedx.getFullYear();

                    var temp = finalyear + d.key
                    //console.log(finalyear)

                    // console.log(temp)
                    // console.log(data3)
                    var money = 0;
                    for (var i = 0; i < data3.length; i++) {
                        if (temp == data3[i].team) {
                            money = data3[i].value
                            break
                        }
                    }
                    //console.log(money)
                    d3.select(this).style('fill', d3.rgb(d3.select(this).style("fill")).brighter());
                    d3.select("#major").text(d.key);
                    tooltip.transition()
                        .duration(700)
                        .style("opacity", 1);
                    tooltip.html(d.key + " " + money)
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                    //console.log(d.key)
                })
                .on('mouseout', function (d) {
                    d3.select(this).style('fill',
                        d3.rgb(d3.select(this).style("fill")).darker());
                    d3.select("#major").text("Mouse hover");
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                })

            svg.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + (height) + ")")
                .call(xAxis);

            //D3 Vertical Legend//////////////////////////
            var legendVals2 = ["Manchester United", "Manchester city", "Chelsea", "Liverpool", "Arsenal"]
            var legend3 = svg.selectAll('.legend3')
                .data(legendVals2)
                .enter().append('g')
                .attr("class", "legends3")
                .attr("transform", function (d, i) {
                    {
                        return "translate(0," + i * 20 + ")"
                    }
                })

            legend3.append('rect')
                .attr("x", 0)
                .attr("y", 30)
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", function (d, i) {
                    return color(i)
                })

            legend3.append('text')
                .attr("x", 20)
                .attr("y", 40)
                //.attr("dy", ".35em")
                .text(function (d, i) {
                    return d
                })
                .attr("class", "textselected")
                .style("text-anchor", "start")
                .style("font-size", 15)
            var xAxisGroup = svg.append("g").call(xAxis);
        }
    }