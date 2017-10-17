import d3KitTimeline from 'd3kit-timeline';
import myData from './data/data.json';
import './timeline.css';


var serializedData = myData;
var d3 = require('d3');

for (var i = 0; i < serializedData.length; i++) {
  serializedData[i].time = new Date(serializedData[i].endTime);
}

function findLastDuplicate (nodes, node) {
  var lastNode = node;
  var j = 0;
  var length = nodes.length;
  while (j < length) {
    var currentNode = nodes[j];
    var wrapped = d3.select(currentNode);
    if (wrapped.datum().data.activityId === lastNode.data.activityId &&
      wrapped.datum().data.time.getTime() > lastNode.data.time.getTime()
    ) {
      lastNode = wrapped.datum();
    }
    j = j + 1;
  }
  return lastNode;
}

function selectRect(node) {
  return d3.select(node).selectAll('rect');
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
    var selection = selectRect(groups[index]);
    selection.style("fill", "blue");
    selection.style("fill-opacity", 1);

    var lastDuplicate = findLastDuplicate(groups, node);
    if (lastDuplicate) {
      var rect2 = selectRect(groups[lastDuplicate.index]);
      rect2.style("fill", "blue");
      rect2.style("fill-opacity", 1);
      node.highlightedDuplicate = rect2;

      var targetDatum = lastDuplicate;
      var path = d3.path();
      path.moveTo(node.x + selection.node().getBBox().width, node.y);

      var offset = 50;
      var tx = Math.max(targetDatum.x + rect2.node().getBBox().width, node.x + selection.node().getBBox().width) + offset*2;
      var ty = targetDatum.y - node.y + offset;

      path.arcTo(tx, ty, targetDatum.x + rect2.node().getBBox().width, targetDatum.y, 100 );

      node.visiblePath = path;
      var appended = d3.select(".main-layer").append("path")
        .attr("d", node.visiblePath.toString())
        .attr('class' , 'visiblePath')
        .attr("style", "stroke: blue; fill: none; stroke-opacity: 1; stroke-width: 2");
      console.log(appended);
    }

  });

  chart.on('labelMouseleave', function(node, index, groups) {
    var selection = d3.select(groups[index]).selectAll('rect');
    selection.style("fill", "black");
    selection.style("fill-opacity", 1);

    if (node.highlightedDuplicate) {
      node.highlightedDuplicate.style("fill", "black");
      node.highlightedDuplicate.style("fill-opacity", 1);
      delete node.highlightedDuplicate;
    }

    if (node.visiblePath) {
      d3.selectAll('.visiblePath').remove();
      delete node.visiblePath;
    }
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
