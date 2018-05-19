//-----------------------------------------
//
// Main Dashboard
//
//-----------------------------------------
import React, { Component } from 'react';
import classNames from 'classnames';
import CallTable from './CallTable/CallTable';
import Radio from './Radio/Radio';
import './Dashboard.css';

export default class Dashboard extends Component {
  componentDidMount() {
    this.props.setFlash();
  }
  render() {
    const { bootFinished, data, handleMouseEnter, lastVisit } = this.props;

    const cx = classNames({
      Dashboard: true,
      active: bootFinished
    });

    return (
      <div className={cx}>
        <CallTable calls={data.calls} handleMouseEnter={handleMouseEnter} />
      </div>
    );
  }
}
