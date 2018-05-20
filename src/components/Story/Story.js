import React, { Component } from 'react';
import { Howl } from 'howler';
import { Redirect } from 'react-router-dom';

import * as db from '../../utils/db';
import { renderMarkdown } from '../../utils';
import data from '../../data';
import config from '../../config';

import styles from './Story.css';

export default class Story extends Component {
  constructor() {
    super();
    this.state = {
      playing: false,
      currentTime: 0,
      duration: 0,
      shouldRedirect: false,
      mousedown: false,
      rect: { width: 0, left: 0, right: 0 },
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
    this.el = null;
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
    const target = data.find(p => p.slug === person);

    // set state based on person data, and run init on callback
    if (target) {
      this.setState({ story: target }, this.init);
    }

    const { left, right, width } = this.el.getBoundingClientRect();
    this.setState({
      rect: { left, right, width }
    });
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
    this.setState({
      duration: 0,
      currentTime: 0,
      mousedown: false
    });
  }

  //-----------------------------------------
  // Init
  //
  init() {
    // make sure we are using right image texture
    this.props.swapTexture(this.state.story);

    // set up new audio
    this.audio = new Howl({
      src: [config.cdn + this.state.story.slug + '.mp3'],
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
      duration: this.audio.duration().toFixed(2)
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

  onMouseDown = ev => {
    this.setState({ mousedown: true }, () => {
      this.el.addEventListener('mousemove', this.onMouseMove, false);
      this.el.addEventListener('touchmove', this.onTouchMove, false);
    });
  };
  onMouseUp = ev => {
    this.setState({ mouseup: true }, () => {
      this.el.removeEventListener('mousemove', this.onMouseMove, false);
      this.el.removeEventListener('touchmove', this.onTouchMove, false);
    });
  };

  onMouseMove = ev => {
    if (this.state.mousedown) {
      this.seek(ev);
    }
  };

  onTouchMove = ev => {
    const evt = { pageX: ev.touches[0].pageX };
    this.seek(evt);
  };

  seek(ev) {
    const { width, left } = this.state.rect;
    const { pageX } = ev;
    const x = pageX - left;
    let percent = x / width;
    if (percent >= 100) {
      percent = 100;
    }
    this.audio.seek(percent * this.state.duration);
  }

  handleClick = ev => {
    ev.preventDefault();
    this.seek(ev);
  };

  render() {
    if (this.state.shouldRedirect === true) {
      return <Redirect to="/" />;
    }

    return (
      <div className={styles.Story}>
        <div
          className={styles.Body}
          dangerouslySetInnerHTML={renderMarkdown(this.state.story.text)}
        />
        <div className={styles.Stats}>
          <div
            className={styles.Waveform}
            ref={el => (this.el = el)}
            onMouseDown={this.onMouseDown}
            onMouseUp={this.onMouseUp}
            onTouchStart={this.onMouseDown}
            onTouchEnd={this.onMouseUp}
            onClick={this.handleClick}
            style={{
              userSelect: 'none',
              backgroundImage: `url(${config.cdn +
                this.state.story.slug +
                '.png'})`
            }}
          />

          <div
            className={styles.Overlay}
            style={{
              transform: `translate3d(${-100 +
                this.state.currentTime / this.state.duration * 100}%,0,0)`,
              opacity: this.state.currentTime > 0 ? 1 : 0
            }}
          />

          <div className={styles.Time}>
            {this.state.currentTime.toFixed(2)}
            s / {this.state.duration}
            s
          </div>
        </div>
      </div>
    );
  }
}
