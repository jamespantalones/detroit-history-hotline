//-----------------------------------------
//
// Main App
//
//-----------------------------------------

import React, { Component, Fragment } from 'react';
import { Howl } from 'howler';
import classNames from 'classnames';
import localForage from 'localforage';
import { Route, withRouter } from 'react-router-dom';

import Nav from './components/Nav/Nav';
import Marquee from './components/Marquee/Marquee';
import Boot from './components/Boot/Boot';
import Canvas from './scene/Canvas';
import Story from './components/Story/Story';
import Title from './components/Title/Title';
import Dashboard from './components/Dashboard/Dashboard';
import Radio from './components/Dashboard/Radio/Radio';
import Stats from './components/Dashboard/Stats/Stats';

import data from './data/data.json';
import titleText from './data/title.txt';
import bootText from './data/boot.txt';
import marqueeText from './data/marquee.txt';
import topText from './data/top.txt';
import phones from './images/phones.png';
import bgAudioSrc from './audio/detroit_groove.mp3';
import modemSrc from './audio/modem.wav';
import dialToneSrc from './audio/dialtone.mp3';

import './App.css';

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
      activeStory: null,
      bootFinished: false,
      backgroundLoaded: false,
      title: '',
      lastVisit: ''
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

    this.setVisit();
  }

  componentDidUpdate(oldProps) {
    const { pathname } = this.props.location;
    console.log(pathname, oldProps.pathname);
    if (oldProps.location.pathname !== pathname && pathname === '/') {
      this.setState({
        activeStory: null
      });
    }
  }

  // flag visit for next time
  async setVisit() {
    try {
      await localForage.setItem('ds_last_visit', new Date());
    } catch (err) {
      console.error('Error setting last visit in localstorage', err);
    }
  }

  // Get main site data
  async fetchSiteData() {
    let val = '';
    const res = await fetch(titleText);
    const text = await res.text();

    //see if there was a last visit
    try {
      val = await localForage.getItem('ds_last_visit');
    } catch (err) {
      console.error('Error fetching last visit');
    }

    this.setState({
      data,
      title: text,
      lastVisit: val
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
  setAudio() {}

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
    if (this.canvas) {
      this.canvas.swapTexture(item.image);
    }
  };

  setFlash = () => {
    console.log('FHAS');
    if (this.canvas) {
      this.canvas.flashTexture();
    }
  };

  setGlobalActiveStory = story => {
    this.setState({
      activeStory: story
    });
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
        <Nav />
        {/*BACKGROUND CANVAS */}
        <div className={cx}>
          <div ref={c => (this.c = c)} />{' '}
        </div>
        <Stats
          lastVisit={this.state.lastVisit}
          activeStory={this.state.activeStory}
        />
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

                <Dashboard
                  bootFinished={this.state.bootFinished}
                  data={this.state.data}
                  handleMouseEnter={this.handleMouseEnter}
                  lastVisit={this.state.lastVisit}
                  setFlash={this.setFlash}
                />
              </Fragment>
            );
          }}
        />
        <Route
          path="/stories/:person"
          render={props => {
            return (
              <Story
                {...props}
                swapTexture={this.swapTexture}
                setFlash={this.setFlash}
                setGlobalActiveStory={this.setGlobalActiveStory}
              />
            );
          }}
        />
        <div className="App__marquee">
          <Marquee text={this.state.marqueeText} />
        </div>
      </div>
    );
  }
}

export default withRouter(App);
