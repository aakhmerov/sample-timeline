import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Timeline from './timeline/Timeline.js';
import data from './data/data.json'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Timeline data={data}/>
      </div>
    );
  }
}

export default App;
