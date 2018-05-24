// Stats
import React, { Component } from 'react';

import { format } from 'date-fns';
import styles from './Stats.css';

export default class Stats extends Component {
  constructor() {
    super();
    this.state = {
      time: format(new Date(), 'HH:mm:ss    MM/DD/YY')
    };

    this.timer = null;
  }

  //-----------------------------------------
  // Start timer on mount
  //
  componentDidMount() {
    this.runTimer();
  }

  //-----------------------------------------
  // Remove timer on unmount
  //
  componentWillUnmount() {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  //-----------------------------------------
  // Get current time
  //
  runTimer() {
    this.timer = setInterval(() => {
      this.setState({
        time: format(new Date(), 'HH:mm:ss    MM/DD/YY')
      });
    }, 1000);
  }

  //-----------------------------------------
  // Render
  //
  render() {
    const { lastVisit } = this.props;
    return (
      <div className={styles.Stats}>
        <div className={styles.Flex}>
          <div className={styles.Col}>
            <p className={styles.Hed}>
              {this.props.activeStory ? this.props.activeStory.name : 'HOME'}
            </p>
            <p>{this.state.time}</p>
            <p>
              <span className={styles.Yellow}>Last on:</span>{' '}
              {lastVisit ? format(lastVisit, 'HH:mm:ss    MM/DD/YY') : ''}
            </p>
          </div>

          <div className={[styles.Col, styles.Telephony].join(' ')}>
            <p className={styles.Yellow}>Premier SBS Telephony</p>
            <p className={styles.Teal}>
              Node: {this.props.activeStory ? this.props.activeStory.name : 1}
            </p>
          </div>
        </div>

        <div className={styles.Call}>
          <h1>
            <a href="tel:+13139864606">1-313-986-4606</a>
          </h1>
          <p>
            Listen On Your Phone <span>Call Now!</span>
          </p>
        </div>
      </div>
    );
  }
}
