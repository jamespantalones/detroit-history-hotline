import React from 'react';
import { Link } from 'react-router-dom';
import './Title.css';

function Title({ text }) {
  return (
    <div className="Title">
      <Link to="/">
        <h1>Detroit Stories</h1>
      </Link>
    </div>
  );
}

export default Title;
