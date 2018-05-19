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
        <div className="CallTable__group">
          <div className="CallTable__row top">
            <div className="col_1">Ext.</div>
            <div className="col_3">Name</div>
            <div className="col_1">Called</div>
            <div />
          </div>
        </div>

        <div className="CallTable__group bottom">
          {calls.map(item => (
            <Link key={item.id} to={'/stories/' + item.slug}>
              <div
                className="CallTable__row"
                key={item.id}
                onMouseEnter={handleMouseEnter(item)}
                onMouseLeave={handleMouseEnter('')}
              >
                <div className="col_1">#{item.id}</div>
                <div className="col_3">{item.name}</div>
                <div className="col_1">{item.hasCalled ? '✓' : '×'}</div>
                <div>Call now</div>
              </div>
            </Link>
          ))}
        </div>
        {/*  <table>
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
        </table>*/}
      </div>
    </div>
  );
}

export default CallTable;
