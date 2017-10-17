import * as d3 from "d3";
import d3KitTimeline from 'd3kit-timeline'
import myData from './data/data.json'
import './timeline.css'
import { scaleLinear, scaleOrdinal, schemeCategory10 } from 'd3-scale';


var serializedData = myData;

for (var i = 0; i < serializedData.length; i++) {
  serializedData[i].time = new Date(serializedData[i].endTime);
}

function printMe(chart) {
  var localChart = chart ? chart : "#timeline";
  var chart = new d3KitTimeline(localChart, {
    direction: 'right',
    textFn: function(d){
      return d.activityId;
    }
  });

  chart.data(serializedData).visualize();
  chart.on('labelMouseenter', function(node) {
    console.log(node);
    d3.select(node).style("fill", "blue");
  });
  setTimeout(function(){
    chart.resizeToFit();
  }, 300);

};

function renderChart(event) {
  var chart = new d3KitTimeline('#timeline', {
    direction: 'right',
    textFn: function(d){
      return d.time.getFullYear() + ' - ' + d.name;
    }
  });

  chart.data(data).visualize();
  setTimeout(function(){ chart.resizeToFit(); }, 1000);
}

export {
  printMe, renderChart
};
