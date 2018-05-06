//Tel
import React, { Component } from 'react';
import { Howl } from 'howler';

import './Tel.css';

import sound_1 from '../../audio/1.mp3';
import sound_2 from '../../audio/2.mp3';
import sound_3 from '../../audio/3.mp3';
import sound_4 from '../../audio/4.mp3';
import sound_5 from '../../audio/5.mp3';
import sound_6 from '../../audio/6.mp3';
import sound_7 from '../../audio/7.mp3';
import sound_8 from '../../audio/8.mp3';
import sound_9 from '../../audio/9.mp3';
import sound_10 from '../../audio/10.mp3';

const sounds = [
  [
    { num: 1, sound: sound_1, chars: '\u00A0' },
    { num: 2, sound: sound_2, chars: 'ABC' },
    { num: 3, sound: sound_3, chars: 'DEF' }
  ],
  [
    { num: 4, sound: sound_4, chars: 'GHI' },
    { num: 5, sound: sound_6, chars: 'JKL' },
    { num: 6, sound: sound_6, chars: 'MNO' }
  ],
  [
    { num: 7, sound: sound_7, chars: 'PRS' },
    { num: 8, sound: sound_8, chars: 'TUV' },
    { num: 9, sound: sound_9, chars: 'WXY' }
  ],
  [{ num: 0, sound: sound_10, chars: 'OPER' }]
];

export default class Tel extends Component {
  handleClick = (row, num) => {
    return function() {
      const h = new Howl({
        src: [sounds[row][num].sound]
      });

      h.play();
    };
  };

  render() {
    return (
      <div className="Tel">
        {sounds.map((row, index) => {
          return (
            <div className="Tel__row" key={index}>
              {row.map((item, index2) => {
                return (
                  <div
                    key={item.num + 'item'}
                    className="button"
                    onClick={this.handleClick(index, index2)}
                  >
                    <p>
                      <small>{item.chars}</small>
                    </p>
                    <p>{item.num}</p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}
