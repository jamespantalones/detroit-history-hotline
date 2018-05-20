import React from 'react';
import { shareTW, shareFB } from '../../utils';
import styles from './Social.css';

function Social() {
  return (
    <div className={styles.Social}>
      <div className={styles.Item} onClick={shareTW}>
        Share via Twitter
      </div>
      <div className={styles.Item} onClick={shareFB}>
        Share via Facebook
      </div>
    </div>
  );
}

export default Social;
