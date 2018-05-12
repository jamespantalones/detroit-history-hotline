// Stats
import React, { Component } from 'react';
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

  componentWillUnmount() {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  async componentDidMount() {
    this.runTimer();
  }

  runTimer() {
    this.timer = setInterval(() => {
      console.log('hit');
      this.setState({
        time: format(new Date(), 'HH:mm:ss    MM/DD/YY')
      });
    }, 1000);
  }

  render() {
    const { lastVisit } = this.props;
    return (
      <div className="Stats">
        <div className="Stats__flex">
          <div className="Stats__col">
            <Link to="/">
              <p className="Stats__hed">Detroit Stories Hotline</p>
              <p className="Stats__dek" />
              <p>{this.state.time}</p>
              <p>
                <span className="y">Last on:</span>{' '}
                {lastVisit ? format(lastVisit, 'MM/DD/YY') : ''}
              </p>
            </Link>
          </div>

          <div className="Stats__col">
            <p className="y">Premier SBS Telephony</p>
            <p className="t">
              Node: {this.props.activeStory ? this.props.activeStory.name : 1}
            </p>
          </div>
        </div>

        <div className="Stats__call">
          <h1>1-313-986-4606</h1>
          <p>Call Now to hear stories on your phone!</p>
        </div>
      </div>
    );
  }
}
