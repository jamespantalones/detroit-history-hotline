import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import './CallTable.css';

function CallTable({ active, calls, handleMouseEnter, right }) {
  const cx = classNames({
    CallTable: true,
    active,
    right
  });
  return (
    <div className={cx}>
      <div className="CallTable__table_wrapper">
        <table>
          <thead>
            <tr className="tr_head">
              <th>Extension</th>
              <th>Name</th>
              <th>Called</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {calls.map(item => (
              <tr
                key={item.id}
                onMouseEnter={handleMouseEnter(item)}
                onMouseLeave={handleMouseEnter('')}
              >
                <td>#{item.id}</td>

                <td>{item.name}</td>
                <td>{item.hasCalled ? '*' : 'x'}</td>

                <td>
                  <Link key={item.id} to={'/stories/' + item.slug}>
                    Call Now!
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CallTable;
