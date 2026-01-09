// Worker timer helper (reduces main-thread timer drift)
const TimerPond = {};

const Handle = {
  setInterval(data) {
    if (TimerPond[data.uuid]) return;
    TimerPond[data.uuid] = setInterval(() => {
      self.postMessage({ uuid: data.uuid, event: 'setInterval' });
    }, data.delay);
  },
  clearInterval(data) {
    clearInterval(TimerPond[data.uuid]);
    delete TimerPond[data.uuid];
  }
};

self.onmessage = function ({ data }) {
  Handle[data.event](data);
};
