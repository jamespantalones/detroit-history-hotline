import React, { Component, Fragment } from 'react';
import { Howl } from 'howler';
import classNames from 'classnames';
import { Route, withRouter } from 'react-router-dom';
import Marquee from './components/Marquee/Marquee';
import Boot from './components/Boot/Boot';
import Canvas from './scene/Canvas';
import Story from './components/Story/Story';

import './App.css';

import data from './data/data.json';
import bootText from './data/boot.txt';
import marqueeText from './data/marquee.txt';
import topText from './data/top.txt';
import phones from './images/phones.png';
import bgAudioSrc from './audio/detroit_groove.mp3';
import modemSrc from './audio/modem.wav';
import dialToneSrc from './audio/dialtone.mp3';
import CallTable from './components/CallTable/CallTable';

//-----------------------------------------
// Main
//
class App extends Component {
  constructor() {
    super();
    this.state = {
      // bottom marquee text
      marqueeText: '',
      // top marquee text
      topText: '',
      // person data
      data: {
        calls: []
      },
      bootFinished: false,
      backgroundLoaded: false
    };
    this.c = null;
    this.canvas = null;
    this.bgAudio = null;
  }

  componentDidMount() {
    this.fetchSiteData();
    this.fetchMarquees();
    this.setAudio();
    this.canvas = new Canvas(this.c, this.backgroundLoadedCallback);
  }

  componentDidUpdate(oldProps, oldState) {
    const { pathname } = this.props.location;

    if (pathname !== oldProps.location.pathname) {
      if (pathname === '/') {
        this.bgAudio.stop();
        this.bgAudio.play();
      } else {
        this.bgAudio.stop();
        this.modemAudio.stop();
      }
    }
    if (
      oldState.bootFinished !== this.state.bootFinished &&
      this.state.bootFinished === true
    ) {
      //play dial tone
      console.log('botted');
    }
  }

  // Get main site data
  fetchSiteData() {
    this.setState({
      data
    });
  }

  // Get all marquee text
  async fetchMarquees() {
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

  //-----------------------------------------
  // Handle main audio setup
  //
  setAudio() {
    this.modemAudio = new Howl({
      src: [modemSrc],
      onend: () => {
        if (this.bgAudio) {
          if (this.props.location.pathname === '/') {
            this.bgAudio.play();
          }
        }
      },
      volume: 0.2
    });

    this.bgAudio = new Howl({
      src: [bgAudioSrc],
      volume: 0.2
    });

    if (this.props.location.pathname === '/') {
      this.modemAudio.play();
    }
  }

  //-----------------------------------------
  // Main BG images loaded
  //
  backgroundLoadedCallback = () => {
    this.setState({
      backgroundLoaded: true
    });
  };

  //-----------------------------------------
  // Boot is done
  //
  onFinishedBoot = () => {
    this.setState({
      bootFinished: true
    });
  };

  handleMouseEnter = item => {
    const self = this;
    return function() {
      if (self.canvas) {
        self.canvas.swapTexture(item.image);
      }
    };
  };

  swapTexture = item => {
    console.log('ITEM', item);
    if (this.canvas) {
      this.canvas.swapTexture(item.image);
    }
  };

  //-----------------------------------------
  // Render
  //
  render() {
    const cx = classNames({
      Background: true,
      loaded: this.state.backgroundLoaded
    });

    return (
      <div className="App">
        <div className="App__marquee_top">
          <Marquee text={this.state.topText} />{' '}
        </div>
        <div className={cx}>
          <div ref={c => (this.c = c)} />{' '}
        </div>
        <Route
          exact
          path="/"
          render={() => {
            return (
              <Fragment>
                <Boot
                  data={this.state.data}
                  onFinishedBoot={this.onFinishedBoot}
                  bootFinished={this.state.bootFinished}
                />
                <CallTable
                  active={this.state.bootFinished}
                  calls={this.state.data.calls}
                  handleMouseEnter={this.handleMouseEnter}
                />{' '}
              </Fragment>
            );
          }}
        />
        <Route
          path="/stories/:person"
          render={props => {
            return <Story {...props} swapTexture={this.swapTexture} />;
          }}
        />
        <div className="App__marquee">
          <Marquee text={this.state.marqueeText} />{' '}
        </div>{' '}
      </div>
    );
  }
}

export default withRouter(App);
