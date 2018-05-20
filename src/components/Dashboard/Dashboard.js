//-----------------------------------------
//
// Main Dashboard
//
//-----------------------------------------

// @flow

import * as React from 'react';
import classNames from 'classnames';
import CallTable from './CallTable/CallTable';

import styles from './Dashboard.css';

import type { ItemData } from '../../types';

type Props = {
  bootFinished: boolean,
  setFlash: () => void,
  data: Array<ItemData>,
  handleMouseEnter: () => void
};

export default class Dashboard extends React.Component<Props> {
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
        <CallTable calls={data} handleMouseEnter={handleMouseEnter} />
      </div>
    );
  }
}
