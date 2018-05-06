import React, { Component } from 'react';
import Background from './components/Background/Background';
import Marquee from './components/Marquee/Marquee';
import Tel from './components/Tel/Tel';

import './App.css';
import marqueeText from './data/marquee.txt';
import topText from './data/top.txt';
import phones from './images/phones.png';

class App extends Component {
  constructor() {
    super();
    this.state = {
      marqueeText: '',
      topText: ''
    };
  }

  async componentDidMount() {
    const p1 = fetch(marqueeText);
    const p2 = fetch(topText);
    const res = await p1;
    const res2 = await p2;
    const text = await res.text();
    const text2 = await res2.text();
    this.setState({
      marqueeText: text,
      topText: text2
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App__marquee_top">
          <Marquee text={this.state.topText} />
        </div>
        <Background />

        <Tel />

        {/* <div class="Phones">
          <img src={phones} />
        </div> */}
        <div className="App__marquee">
          <Marquee text={this.state.marqueeText} />
        </div>
      </div>
    );
  }
}

export default App;
