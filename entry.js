'use strict';
require('!style!css!sass!./index.scss');

const body = d3.select('body');
const width = document.body.clientWidth;
const height = document.body.clientHeight;
const svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height);

d3.json("data/topo.json", (error, data) => {
  if (error) return console.error(error);

  console.log(data);
  svg.append("path")
      .datum(topojson.feature(data, data.objects.subunits))
      .attr("d", d3.geo.path().projection(d3.geo.conicEquidistant()));
});
