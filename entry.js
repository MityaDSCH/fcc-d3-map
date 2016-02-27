'use strict';
require('!style!css!sass!./index.scss');

const body = d3.select('body');
const width = document.body.clientWidth;
const height = document.body.clientHeight;
const svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height);

d3.json('data/topoMap.json', (err, map) => {
  d3.json('data/topoMeteor.json', (err, meteorData) => {
    // console.log(map, meteors);

    // ------------------------------------------------------------------------
    // Define projection
    // ------------------------------------------------------------------------

    const projection = d3.geo.conicEquidistant()
      .scale(220*(width/2000))
      .translate([width/2, height/1.8]);

    const path = d3.geo.path()
      .projection(projection);

    // ------------------------------------------------------------------------
    // Draw graticule
    // ------------------------------------------------------------------------

    const graticule = d3.geo.graticule();

    svg.append("defs").append("path")
      .datum({type: "Sphere"})
      .attr("id", "sphere")
      .attr("d", path);

    svg.append("use")
      .attr("class", "stroke fill")
      .attr("xlink:href", "#sphere");

    svg.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path);

    // ------------------------------------------------------------------------
    // Draw map
    // ------------------------------------------------------------------------

    const mapFeatures = topojson.feature(map, map.objects.subunits);

    svg.append("path")
        .datum(mapFeatures)
        .attr('id', 'land')
        .attr("d", path);

    // ------------------------------------------------------------------------
    // Draw meteors
    // ------------------------------------------------------------------------

    const meteors = topojson.feature(meteorData, meteorData.objects.geoMeteor)
                                   .features;
    meteors.sort((a, b) => {
      const massA = parseInt(a.properties.mass);
      const massB = parseInt(b.properties.mass);
      if (massA > massB) return -1;
      if (massA < massB) return 1;
      return 0;
    })
    console.log(mapFeatures, meteors);

    const massExtent = d3.extent(meteors, (meteor) => parseInt(meteor.properties.mass));
    const massScale = d3.scale.pow().exponent(.4)
      .domain(massExtent)
      .range([2, width/40]);

    // colorbrewer YlOrRd
    const colors = ['#ffffcc','#ffeda0','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#b10026'];
    // const colors = ['#ffffd9','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#0c2c84'];
    const colorScale = d3.scale.quantile()
      .domain([massExtent[0], massExtent[1]/100000])
      .range(colors);

    svg.selectAll('.meteor')
      .data(meteors)
      .enter()
        .append('circle')
          .attr('transform', (d) =>
            'translate(' + projection(d.geometry.coordinates) + ')'
          )
          .attr('r', (d) => massScale(d.properties.mass))
          .attr('opacity', .5)
          .attr('fill', (d) => colorScale(Math.sqrt(d.properties.mass)));

  })
});
