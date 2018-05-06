import React, { Component } from 'react';
import classNames from 'classnames';
import Canvas from './Canvas';
import './Background.css';

export default class Background extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false
    };
    this.c = null;
    this.canvas = null;
  }

  componentDidMount() {
    this.canvas = new Canvas(this.c, this.callback);
  }
  callback = () => {
    this.setState({
      loaded: true
    });
  };
  render() {
    const cx = classNames({
      Background: true,
      loaded: this.state.loaded
    });
    return (
      <div className={cx}>
        <div ref={c => (this.c = c)} />
      </div>
    );
  }
}
