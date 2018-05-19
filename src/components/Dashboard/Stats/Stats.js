// Stats
import React, { Component } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import { format } from 'date-fns';
import './Stats.css';

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
    const cx = classNames({
      Breadcrumbs: this.props.activeStory !== null
    });
    return (
      <div className="Stats">
        <div className="Stats__flex">
          <div className="Stats__col">
            <p className="Stats__hed">
              {this.props.activeStory ? this.props.activeStory.name : 'HOME'}
            </p>
            <p className="Stats__dek" />
            <p>{this.state.time}</p>
            <p>
              <span className="y">Last on:</span>{' '}
              {lastVisit ? format(lastVisit, 'MM/DD/YY') : ''}
            </p>
          </div>

          <div className="Stats__col telephony">
            <p className="y">Premier SBS Telephony</p>
            <p className="t">
              Node: {this.props.activeStory ? this.props.activeStory.name : 1}
            </p>
          </div>
        </div>

        <div className="Stats__call">
          <h1>
            <a href="tel:+13139864606">1-313-986-4606</a>
          </h1>
          <p>Call Now to hear stories on your phone!</p>
        </div>
      </div>
    );
  }
}
