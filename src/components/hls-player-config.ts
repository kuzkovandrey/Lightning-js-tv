import { VideoPlayer } from '@lightningjs/sdk';
import Hls from 'hls.js';

let player: Hls = null;

const defaults = {
  debug: false
};

function handleUnrecoverableError(player: Hls, errorEvent: any) {
  if (VideoPlayer._consumer) {
    VideoPlayer._consumer.fire(
      '$videoPlayerError',
      errorEvent,
      VideoPlayer.currentTime
    );
    VideoPlayer._consumer.fire(
      '$videoPlayerEvent',
      'Error',
      errorEvent,
      VideoPlayer.currentTime
    );
  }
  player.destroy();
}

const unload = (videoEl: any) => {
  if (player && player.destroy && player.destroy instanceof Function) {
    player.destroy();
    player = null;
  }
  videoEl.removeAttribute('src');
  videoEl.load();
};

export const loader = (url: string, videoEl: any, options = {}) => {
  return new Promise(resolve => {
    unload(videoEl);

    player = new Hls({ ...defaults, ...options });
    player.autoLevelCapping = options.autoLevelCapping || -1;

    player.on(Hls.Events.MANIFEST_PARSED, () => resolve(true));
    player.on(Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.MEDIA_ERROR:
            switch (data.details) {
              case Hls.ErrorDetails.MANIFEST_INCOMPATIBLE_CODECS_ERROR:
                handleUnrecoverableError(player, event);
                break;
              default:
                player.recoverMediaError();
                break;
            }
            break;

          case Hls.ErrorTypes.NETWORK_ERROR:
            switch (data.details) {
              case Hls.ErrorDetails.FRAG_LOAD_ERROR:
                player.currentLevel =
                  data.frag.start + data.frag.duration + 0.1;
                break;

              case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
                handleUnrecoverableError(player, event);
                break;

              default:
                player.startLoad();
                break;
            }
            break;

          default:
            handleUnrecoverableError(player, event);
            break;
        }
      }
    });

    player.loadSource(url);
    player.attachMedia(videoEl);
  });
};

export const unloader = (videoEl: any) => {
  return new Promise(resolve => {
    unload(videoEl);
    resolve(true);
  });
};
