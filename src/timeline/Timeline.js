import React, { Component } from 'react';
import d3KitTimeline from 'd3kit-timeline';
import * as d3 from "d3";


class Timeline extends Component {
  constructor(props){
    super(props)
    this.createTimeline = this.createTimeline.bind(this)
  }

  componentDidMount() {
    this.createTimeline();
  }

  componentDidUpdate() {
    this.createTimeline();
  }

  findLastDuplicate (nodes, node) {
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

  selectRect(node) {
    return d3.select(node).selectAll('rect');
  }

  createTimeline() {
    const node = this.node
    for (var i = 0; i < this.props.data.length; i++) {
      this.props.data[i].time = new Date(this.props.data[i].endTime);
    }
    this.renderChart("#timeline");
  }

  handleMouseIn (node, index, groups) {
    var selection = this.selectRect(groups[index]);
    selection.style("fill", "blue");
    selection.style("fill-opacity", 1);

    var lastDuplicate = this.findLastDuplicate(groups, node);
    if (lastDuplicate) {
      var rect2 = this.selectRect(groups[lastDuplicate.index]);
      rect2.style("fill", "blue");
      rect2.style("fill-opacity", 1);
      node.highlightedDuplicate = rect2;

      var targetDatum = lastDuplicate;
      var path = d3.path();
      path.moveTo(node.x + selection.node().getBBox().width, node.y);

      var offset = 50;
      var tx = Math.max(targetDatum.x + rect2.node().getBBox().width, node.x + selection.node().getBBox().width) + offset*2;
      var ty = targetDatum.y - offset;
      var destx = targetDatum.x + rect2.node().getBBox().width;
      var desty = targetDatum.y;
      path.bezierCurveTo(  node.x + selection.node().getBBox().width + 150, node.y + 50, destx + 150 , desty - 50 ,destx, desty);

      node.visiblePath = path;
      var appended = d3.select(".main-layer").append("path")
        .attr("d", node.visiblePath.toString())
        .attr('class' , 'visiblePath')
        .attr("style", "stroke: blue; fill: none; stroke-opacity: 1; stroke-width: 2");

    }

  }

  handleMouseOut(node, index, groups) {
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
  }

  renderChart(chart) {
    var localChart = chart ? chart : "#timeline";
    var chart = new d3KitTimeline(localChart, {
      direction: 'right',
      textFn: function(d){
        return d.activityId;
      }
    });

    chart.data(this.props.data).visualize();

    chart.on('labelMouseenter', this.handleMouseIn.bind(this));

    chart.on('labelMouseleave', this.handleMouseOut.bind(this));

    setTimeout(function(){
      chart.resizeToFit();
    }, 300);
  }

  render() {
      return <div id="timeline"></div>
   }
}

export default Timeline;
