//-----------------------------------
//
// Marquee Block
//
//----------------------------------
import React, { Component } from 'react';

import { deferWork, renderMarkdown } from '../../utils';
import './Marquee.css';

export default class Marquee extends Component {
  constructor() {
    super();
    this.state = { innerWidth: 0, x: 10 };
    this.inner = null;
    this.animation = null;
    this.onResize = this.onResize.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.animate = this.animate.bind(this);
  }

  componentDidMount() {
    if (this.props.text.length > 0) {
      this.setupTween();
    }

    if (this.props.ltr) {
      this.setState({
        x: -window.innerWidth
      });
    }
  }

  componentDidUpdate(oldProps) {
    if (this.props.text.length > 0 && oldProps.text.length === 0) {
      this.setupTween();
    }
  }

  componentWillUnmount() {
    if (this.animation) {
      cancelAnimationFrame(this.animation);
      this.animation = null;
    }
  }

  onResize() {
    const self = this;
    deferWork(() => {
      deferWork(() => {
        self.setState({
          innerWidth: self.inner.scrollWidth
        });
      });
    });
  }

  handleMouseEnter() {
    if (this.animation) {
      cancelAnimationFrame(this.animation);
      this.animation = null;
    }
  }

  handleMouseLeave() {
    if (this.animation === null) {
      this.animate();
    }
  }

  setupTween() {
    const self = this;
    this.setState(
      {
        innerWidth: this.inner.scrollWidth
      },
      () => {
        deferWork(() => {
          deferWork(() => {
            self.animate();
          });
        });
      }
    );
  }

  animate() {
    if (this.props.ltr === true) {
      this.setState(
        {
          x: this.state.x >= this.state.innerWidth ? 0 : this.state.x + 1
        },
        () => {
          this.animation = requestAnimationFrame(this.animate);
        }
      );
    } else {
      this.setState(
        {
          x: this.state.x <= -this.state.innerWidth ? 0 : this.state.x - 1
        },
        () => {
          this.animation = requestAnimationFrame(this.animate);
        }
      );
    }
  }

  renderInner(pos) {
    return (
      <div
        ref={inner => (this.inner = inner)}
        className="marquee"
        style={{ left: `${this.state.innerWidth * pos}px` }}
      >
        <div dangerouslySetInnerHTML={renderMarkdown(this.props.text)} />
      </div>
    );
  }

  render() {
    if (this.props.text.length <= 0) {
      return null;
    }
    return (
      <div className="marquee__wrapper">
        <div
          className="marquee__inner"
          style={{ transform: `translate3d(${this.state.x}px, 0, 0)` }}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          {this.renderInner(0)}
          {this.renderInner(1)}
        </div>
      </div>
    );
  }
}
