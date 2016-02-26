'use strict';
require('!style!css!sass!./index.scss');

const body = d3.select('body');
const width = document.body.clientWidth;
const height = document.body.clientHeight;
const svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height);

d3.json('data/topoMap.json', (err, map) => {
  d3.json('data/topoMeteor.json', (err, meteors) => {
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
        .datum(topojson.feature(map, map.objects.subunits))
        .attr('id', 'land')
        .attr("d", path);

    // ------------------------------------------------------------------------
    // Draw meteors
    // ------------------------------------------------------------------------

    const meteorFeatures = topojson.feature(meteors, meteors.objects.geoMeteor);
    console.log(mapFeatures, meteorFeatures);

  })
});
