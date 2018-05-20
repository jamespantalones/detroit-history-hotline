//-----------------------------------------
// List
//

// @flow

import * as React from 'react';
import classNames from 'classnames';

import bootText from '../../data/boot.txt';
import styles from './Boot.css';

type Props = {
  bootFinished: boolean,
  onFinishedBoot: () => void
};

type State = {
  textArray: Array<string>,
  activeText: Array<string>,
  index: number,
  finished: boolean
};

export default class List extends React.Component<Props, State> {
  state = {
    textArray: [],
    activeText: [],
    index: 0,
    finished: false
  };

  timer: TimeoutID;

  async componentDidMount(): Promise<void> {
    const res = await fetch(bootText);
    const text = await res.text();

    const s: Array<string> = text.split('\n');

    this.setState(
      {
        textArray: [navigator.userAgent].concat(s)
      },
      this.start
    );
  }

  async start(): Promise<void> {
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
      [styles.Boot]: true
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
