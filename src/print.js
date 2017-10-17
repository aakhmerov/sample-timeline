import d3KitTimeline from 'd3kit-timeline'
import myData from './data/data.json'
import './timeline.css'


var serializedData = myData;
var d3 = require('d3');

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
  chart.on('labelMouseenter', function(node, index, groups) {
    var selection = d3.select(groups[index]).selectAll('rect');
    selection.style("fill", "blue");
    selection.style("fill-opacity", 1);
  });

  chart.on('labelMouseleave', function(node, index, groups) {
    var selection = d3.select(groups[index]).selectAll('rect');
    selection.style("fill", "black");
    selection.style("fill-opacity", 1);
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
