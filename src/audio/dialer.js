import { Howl } from 'howler';
const pathToAudio = require.context('./tones', true);

const SOUNDS = [
  {
    id: 1,
    src: require('./tones/1.mp3')
  },
  {
    id: 2,
    src: require('./tones/2.mp3')
  },
  {
    id: 3,
    src: require('./tones/3.mp3')
  },
  {
    id: 4,
    src: require('./tones/4.mp3')
  },
  {
    id: 5,
    src: require('./tones/5.mp3')
  },
  {
    id: 6,
    src: require('./tones/6.mp3')
  },
  {
    id: 7,
    src: require('./tones/7.mp3')
  },
  {
    id: 8,
    src: require('./tones/8.mp3')
  },
  {
    id: 9,
    src: require('./tones/9.mp3')
  },
  {
    id: 0,
    src: require('./tones/10.mp3')
  }
];

const Dialer = (() => {
  let instance = null;
  let toDial = [];
  let index = 0;
  let loadedSounds = [];

  function loadSound(s) {
    return new Promise((resolve, reject) => {
      function handleLoad() {
        resolve({
          id: s.id,
          sound
        });
      }

      function handleError(err) {
        reject(err);
      }
      const sound = new Howl({
        src: [s.src],
        onload: handleLoad,
        onerror: handleError
      });
    });
  }

  function init() {
    return new Promise(async (resolve, reject) => {
      const promises = SOUNDS.map(s => loadSound(s));
      const res = await Promise.all(promises);
      resolve(res);
    });
  }

  function createInstance() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await init();
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  }

  function play() {
    if (index < toDial.length) {
      setTimeout(() => {
        const n = toDial[index];
        loadedSounds[n].sound.play();
        index++;
        play();
      }, Math.floor(Math.random() * 300) + 100);
    }
  }

  return {
    play: async (num = [9, 9, 9, 1, 3, 0, 7]) => {
      toDial = num;
      index = 0;
      if (!instance) {
        instance = createInstance();
      }

      loadedSounds = await instance;
      play(num);
    }
  };
})();

export default Dialer;
