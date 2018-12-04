function drawChart(data) {
    console.log(data)
    width = 400
    height = Math.min(width, 400)
    
    var pie = d3.pie()
        .padAngle(0.005)
        .sort(null)
        .value(d => d.value)
    
    arc = fetchArc()
    
    const arcs = pie(data);

    var color = d3.scaleOrdinal()
    .domain(data.map(d => d.name))
    .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

    const svg = d3.select('#piechart')
        .append('svg')
        .attr("width", width)
        .attr("height", height)
        .attr("text-anchor", "middle")
        .style("font", "12px sans-serif");

    const g = svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);
    
    g.selectAll("path")
        .data(arcs)
        .enter().append("path")
        .attr("fill", d => color(d.data.name))
        .attr("d", arc)
        .append("title")
        .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

    const text = g.selectAll("text")
        .data(arcs)
        .enter().append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("dy", "0.35em");
    
    text.append("tspan")
        .attr("x", 0)
        .attr("y", "-0.7em")
        .style("font-weight", "bold")
        .text(d => d.data.name);
    
    text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .text(d => d.data.value.toLocaleString());
    return svg.node();
}

function fetchArc(){
    const radius = Math.min(width, height) / 2;
    return d3.arc().innerRadius(radius * 0.67).outerRadius(radius - 1);
}