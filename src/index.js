import _ from 'lodash';
import {printMe} from './print.js';
import {renderChart} from './print.js';


function component() {
  var element = document.createElement('div');
  var chart = document.createElement('div');
  chart.id = "timeline"
  
  element.appendChild(chart);
  printMe(chart);

  return element;
}

document.addEventListener('DOMContentLoaded', function () {
  document.body.appendChild(component());
}, false);
