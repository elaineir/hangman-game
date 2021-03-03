const noise = () => {
  let canvas, ctx;
  let wWidth, wHeight;
  let noiseData = [];
  let frame = 0;
  let loopTimeout;

  // Create Noise
  const createNoise = () => {
      const idata = ctx.createImageData(wWidth, wHeight);
      const buffer32 = new Uint32Array(idata.data.buffer);
      const len = buffer32.length;

      for (let i = 0; i < len; i++) {
          if (Math.random() < 0.5) {
              buffer32[i] = 0xff000000;
          }
      }
      noiseData.push(idata);
  };

  // Play Noise
  const paintNoise = () => {
      if (frame === 9) {
          frame = 0;
      } else {
          frame++;
      }
      ctx.putImageData(noiseData[frame], 0, 0);
  };

  // Loop
  const loop = () => {
      paintNoise(frame);

      loopTimeout = window.setTimeout(() => {
          window.requestAnimationFrame(loop);
      }, (1000 / 25));
  };

  // Setup
  const setup = () => {
      wWidth = window.innerWidth;
      wHeight = window.innerHeight;

      canvas.width = wWidth;
      canvas.height = wHeight;

      for (let i = 0; i < 10; i++) {
          createNoise();
      }

      loop();
  };

  // Reset
  let resizeThrottle;
  const reset = () => {
      window.addEventListener('resize', () => {
          window.clearTimeout(resizeThrottle);

          resizeThrottle = window.setTimeout(() => {
              window.clearTimeout(loopTimeout);
              setup();
          }, 200);
      }, false);
  };

  // Init
  const init = (() => {
      canvas = document.querySelector('.noise');
      ctx = canvas.getContext('2d');

      setup();
  })();
};

const gameArea = document.querySelector('.game-area');

const tl = new TimelineMax({repeat:-1});

const playDefeatAnimation = () => {
  noise();
  for (let i=50; i--;) {
    tl.to(gameArea, R(0.03,0.17), { opacity:R(0,1), y:R(-1.5,1.5) });
  }
}

function R(max,min) {
  return Math.random() * (max-min) + min;
};

//playDefeatAnimation(); в открытие попапа с поражением