// Radio player

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Radio.css';
import config from '../../../config';

export default class Radio extends Component {
  static propTypes = {
    bootFinished: PropTypes.bool.isRequired
  };

  constructor() {
    super();
    this.state = {
      src: '',
      iframeLoaded: false
    };

    this.iframe = null;
  }

  componentDidMount() {
    if (this.props.bootFinished === true) {
      this.setState({
        src: config.RADIO_EMBED
      });
    }
  }

  componentDidUpdate(oldProps) {
    if (
      oldProps.bootFinished !== this.props.bootFinished &&
      this.props.bootFinished === true
    ) {
      this.setState({
        src: config.RADIO_EMBED
      });
    }
  }

  handleload = () => {
    this.setState({
      iframeLoaded: true
    });
  };

  render() {
    const cx = classNames({
      loaded: this.state.iframeLoaded
    });

    const cy = classNames({
      Radio__init: true,
      active: !this.state.iframeLoaded
    });
    return (
      <div className="Radio">
        <h1>Radio</h1>

        <div className={cy}>
          <p>Initializing Radio Player...</p>
        </div>
        <div className="Radio__overlay" />
        <iframe
          className={cx}
          src={this.state.src}
          scrollable="no"
          onLoad={this.handleload}
          frameBorder="0"
          scrolling="no"
        />
      </div>
    );
  }
}
