import React, { Component } from 'react';
import { Howl } from 'howler';
import { Link } from 'react-router-dom';

import { renderMarkdown } from '../../utils';
import data from '../../data/data.json';
import conversation from '../../audio/conversation.mp3';
import Dialer from '../../audio/dialer';

import './Story.css';

export default class Story extends Component {
  constructor() {
    super();
    this.state = {
      playing: false,
      currentTime: 0,
      duration: 0,
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
    this.audio = null;
  }
  async componentDidMount() {
    const { person } = this.props.match.params;

    Dialer.play();

    // find person in data
    const target = data.calls.find(p => p.slug === person);
    if (target) {
      this.setState(
        {
          story: target
        },
        this.init
      );
    }
  }

  componentWillUnmount() {
    if (this.audio !== null) {
      this.audio.stop();
      this.audio.unload();
    }

    if (this.loop !== null) {
      cancelAnimationFrame(this.loop);
      this.loop = null;
    }
  }

  init() {
    // make sure we are using right image texture
    this.props.swapTexture(this.state.story);
    this.audio = new Howl({
      src: [conversation],
      volume: 0.5,
      onload: this.getMetaData,
      onpause: this.onPause,
      onplay: this.onPlay
    });
  }

  getMetaData = () => {
    this.setState({ duration: this.audio.duration() });
    this.audio.play();
  };

  onPlay = () => {
    this.renderMeta();
  };

  onPause = () => {};

  renderMeta = () => {
    this.loop = requestAnimationFrame(this.renderMeta);
    this.setState({
      currentTime: this.audio.seek()
    });
  };

  handleChange = ev => {
    console.log(ev.target.value);
    this.audio.seek(ev.target.value);
  };

  render() {
    return (
      <div className="Story">
        <Link to="/">
          <div className="Story__exit">{'<'} Return</div>
        </Link>
        <div
          className="Story__body"
          dangerouslySetInnerHTML={renderMarkdown(this.state.story.text)}
        />
        <div className={'Story__stats'}>
          <input
            type="range"
            min={0}
            max={this.state.duration}
            step="0.01"
            value={this.state.currentTime.toFixed(2)}
            onChange={this.handleChange}
          />
          <p>
            {this.state.currentTime.toFixed(2)}s / {this.state.duration}s
          </p>
        </div>
      </div>
    );
  }
}
