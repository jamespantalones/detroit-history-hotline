import React, { Component } from 'react';
import { Howl } from 'howler';
import { Link, Redirect } from 'react-router-dom';

import * as db from '../../utils/db';
import { renderMarkdown, getAudio } from '../../utils';
import data from '../../data/data.json';
import Dialer from '../../audio/dialer';
import config from '../../config';

import './Story.css';

export default class Story extends Component {
  constructor() {
    super();
    this.state = {
      playing: false,
      currentTime: 0,
      duration: 0,
      shouldRedirect: false,
      story: {
        id: 0,
        name: '',
        audio: '',
        hasCalled: false,
        image: '',
        slug: '',
        text: ''
      }
    };
    this.loop = null;
    this.timer = null;
    this.audio = null;
  }

  //-----------------------------------------
  // On mount
  //
  async componentDidMount() {
    // get person based on url match
    const { person } = this.props.match.params;

    // trigger glitch/flash on shader
    this.props.setFlash();

    // find person in data
    const target = data.calls.find(p => p.slug === person);

    // set state based on person data, and run init on callback
    if (target) {
      this.setState({ story: target }, this.init);
    }
  }

  //-----------------------------------------
  // On unount, destroy audio
  //
  componentWillUnmount() {
    if (this.audio !== null) {
      this.audio.stop();
      this.audio.unload();
    }

    if (this.loop !== null) {
      cancelAnimationFrame(this.loop);
      this.loop = null;
    }

    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  //-----------------------------------------
  // Init
  //
  init() {
    // make sure we are using right image texture
    this.props.swapTexture(this.state.story);

    const audioFile = getAudio(this.state.story.id);

    // set up new audio
    this.audio = new Howl({
      src: [config.cdn + audioFile.src],
      volume: 0.5,
      onload: this.getMetaData,
      onpause: this.onPause,
      onplay: this.onPlay,
      onend: this.onEnd
    });
    this.props.setGlobalActiveStory(this.state.story);
  }

  getMetaData = () => {
    this.setState({
      duration: this.audio.duration()
    });
    this.audio.play();
  };

  onPlay = () => {
    this.renderMeta();
  };

  onEnd = async () => {
    try {
      db.saveCompletedItem(this.state.story.slug);
    } catch (err) {
      console.error('Error saving completion', err);
    }

    this.props.flagAsComplete(this.state.story.slug);

    this.timer = setTimeout(() => {
      this.setState({
        shouldRedirect: true
      });
    }, 250);

    // save item in localstorage
  };

  onPause = () => {};

  renderMeta = () => {
    this.loop = requestAnimationFrame(this.renderMeta);
    this.setState({
      currentTime: this.audio.seek()
    });
  };

  handleChange = ev => {
    this.audio.seek(ev.target.value);
  };

  render() {
    if (this.state.shouldRedirect === true) {
      return <Redirect to="/" />;
    }

    return (
      <div className="Story">
        <div
          className="Story__body"
          dangerouslySetInnerHTML={renderMarkdown(this.state.story.text)}
        />
        <div className={'Story__stats'}>
          <div
            className="Story__stats_bg"
            style={{
              backgroundImage: `url(${config.cdn +
                this.state.story.slug +
                '.png'})`
            }}
          />
          <input
            type="range"
            min={0}
            max={this.state.duration}
            step="0.01"
            value={this.state.currentTime.toFixed(2)}
            onChange={this.handleChange}
          />
          <p>
            {this.state.currentTime.toFixed(2)}
            s / {this.state.duration}
            s
          </p>
        </div>
      </div>
    );
  }
}
