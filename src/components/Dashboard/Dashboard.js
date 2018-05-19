//-----------------------------------------
//
// Main Dashboard
//
//-----------------------------------------
import React, { Component } from 'react';
import classNames from 'classnames';
import CallTable from './CallTable/CallTable';

import styles from './Dashboard.css';

export default class Dashboard extends Component {
  componentDidMount() {
    this.props.setFlash();
  }
  render() {
    const { bootFinished, data, handleMouseEnter } = this.props;

    const cx = classNames({
      [styles.Dashboard]: true,
      [styles.active]: bootFinished
    });

    return (
      <div className={cx}>
        <CallTable calls={data.calls} handleMouseEnter={handleMouseEnter} />
      </div>
    );
  }
}
