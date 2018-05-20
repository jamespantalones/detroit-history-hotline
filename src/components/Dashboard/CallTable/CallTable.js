import * as React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import styles from './CallTable.css';

import type { ItemData } from '../../types';

type Props = {
  active: boolean,
  calls: Array<ItemData>,
  handleMouseEnter: () => void
};

function CallTable(props: Props) {
  const cx = classNames({
    [styles.CallTable]: true,
    [styles.active]: props.active
  });

  const b = classNames({
    [styles.Group]: true,
    [styles.Bottom]: true
  });
  const r = classNames({
    [styles.Row]: true,
    [styles.rowTop]: true
  });
  return (
    <div className={cx}>
      <div className={styles.Wrapper}>
        <div className={styles.Group}>
          <div className={r}>
            <div className={styles.Col1}>Ext.</div>
            <div className={styles.Col3}>Name</div>
            <div className={styles.Col1}>Called</div>
            <div />
          </div>
        </div>

        <div className={b}>
          {props.calls.map(item => (
            <Link key={item.id} to={'/stories/' + item.slug}>
              <div
                className={styles.Row}
                key={item.id}
                onMouseEnter={props.handleMouseEnter(item)}
                onMouseLeave={props.handleMouseEnter('')}
              >
                <div className={styles.Col1}>#{item.id}</div>
                <div className={styles.Col3}>{item.name}</div>
                <div className={styles.Col1}>{item.hasCalled ? '✓' : '×'}</div>
                <div>Call now!</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CallTable;
