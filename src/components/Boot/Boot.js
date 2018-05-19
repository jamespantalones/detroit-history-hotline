//-----------------------------------------
// List
//

import React, { Component } from 'react';
import classNames from 'classnames';

import bootText from '../../data/boot.txt';
import styles from './Boot.css';

export default class List extends Component {
  constructor() {
    super();
    this.state = {
      textArray: [],
      activeText: [],
      index: 0,
      finished: false
    };

    this.timer = null;
  }

  async componentDidMount() {
    const res = await fetch(bootText);
    const text = await res.text();

    const s = text.split('\n');

    this.setState(
      {
        textArray: [navigator.userAgent].concat(s)
      },
      this.start
    );
  }

  async start() {
    const { index, textArray, activeText } = this.state;
    this.timer = setTimeout(async () => {
      if (index < textArray.length) {
        this.setState(
          {
            activeText: activeText.concat(textArray[index]),
            index: index + 1
          },
          this.start
        );
      } else {
        this.props.onFinishedBoot();
      }
    }, Math.floor(Math.random() * 100) + 50);
  }

  render() {
    const c = classNames({
      [styles.Boot]: true,
      [styles.full]: this.state.full
    });

    const cy = classNames({
      [styles.out]: this.props.bootFinished
    });

    return (
      <div className={c}>
        <ul className={cy}>
          {this.state.activeText.map((item, index) => {
            return <li key={index}> {item} </li>;
          })}
        </ul>
      </div>
    );
  }
}
