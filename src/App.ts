import { Playlist, PlaylistItem } from './api/models/playlist';
import { HeaderComponent } from './components/HeaderComponent';
import { Lightning, Utils, VideoPlayer } from '@lightningjs/sdk';
import { getMainPagePlaylists } from './api/api';
import { CardComponent } from './components/CardComponent';
import { CardSlider } from './components/CardSlider';
import { loader, unloader } from './components/hls-player-config';

export default class App extends Lightning.Component {
  private playlists: Playlist[] = [];

  private currentPlaylistIndex = 0;

  private marginBeetweenSlides = 70;

  private card: any;

  static getFonts() {
    return [
      { family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') },
    ];
  }

  static override _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        src: Utils.asset('images/background.png'),
        visible: true,
      },
      Header: {
        x: 150,
        y: 545,
        type: HeaderComponent,
      },
      SlidesWrapper: {
        y: 730,
        x: 0,
        w: 1920,
        h: 1920 - 730,
        clipping: true,
        SlidersContainter: {
          y: 0,
          x: 0,
          children: [] as any[],
        },
      },
    };
  }

  override _handleDown() {
    if (this.currentPlaylistIndex < this.playlists.length - 1) {
      this.currentPlaylistIndex += 1;
      this.repositionSlidersContainter();
    }
  }

  override _handleUp() {
    if (this.currentPlaylistIndex) {
      this.currentPlaylistIndex -= 1;
      this.repositionSlidersContainter();
    }
  }

  override _getFocused() {
    return this.tag('SlidesWrapper.SlidersContainter').children[
      this.currentPlaylistIndex
    ];
  }

  private async playSource(source: string) {
    this.initVideoPlayer();
    VideoPlayer.open(source);
    VideoPlayer.play(source);
    VideoPlayer.show();
  }

  private initVideoPlayer() {
    VideoPlayer.close();
    VideoPlayer.consumer(this);
    VideoPlayer.loader(loader);
    VideoPlayer.unloader(unloader);
    VideoPlayer.mute();
    VideoPlayer.loop(true);
  }

  $videoPlayerPlaying() {
    this.tag('Background').patch({
      visible: false,
    });
  }

  override _init() {
    const slidersContainter = this.tag('SlidesWrapper.SlidersContainter');

    getMainPagePlaylists().then((playlists) => {
      this.playlists = playlists;

      slidersContainter.children = playlists.map((playlists, index) => {
        return {
          type: CardSlider,
          y: index * (CardComponent.sizes.height + this.marginBeetweenSlides),
          x: 120,
          signals: {
            onFocus: '_onFocus',
            onAnimationEnd: '_onAnimationEnd',
          },
          items: playlists.content_moments_list.map((playlistItem) => ({
            type: CardComponent,
            playlistItem,
          })),
        };
      });

      this._refocus();
    });
  }

  _onAnimationEnd() {
    if (this.card) {
      this.tag('Background').patch({
        src: this.card.preview,
        visible: true,
      });

      this.tag('Header').patch({
        contentTitle: this.card.content_title,
        playlistTitle: this.playlists[this.currentPlaylistIndex].title,
      });

      this.playSource(this.card.hls);
    }
  }

  _onFocus(item: PlaylistItem) {
    this.card = item;
  }

  private repositionSlidersContainter() {
    const container = this.tag('SlidesWrapper.SlidersContainter');
    const currentFocusedSlider = container.children[this.currentPlaylistIndex];
    container.setSmooth('y', -currentFocusedSlider.y);
  }
}
