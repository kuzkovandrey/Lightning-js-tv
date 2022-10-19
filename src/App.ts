import { Playlist, PlaylistItem } from './api/models/playlist';
import { HeaderComponent, HeaderComponentProps } from './components/ HeaderComponent';
import { Lightning, Utils, VideoPlayer } from '@lightningjs/sdk'
import { getMainPagePlaylists } from './api/api';
import { CardComponent } from './components/CardComponent';
import { CardSlider } from './components/CardSlider';
import { loader, unloader } from './components/hls-player-config';

export default class App extends Lightning.Component {
  private playlists: Playlist[] = [];

  private currentPlaylistIndex = 0;

  private marginBeetweenSlides = 70;

  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
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
        zIndex: 3,
        type: HeaderComponent,
        contentTitle: '1',
        playlistTitle: '1',
      } as HeaderComponentProps,
      SlidesWrapper: {
        y: 730,
        x: 0,
        w: 1920,
        h: 1920 - 730,
        clipping: true,
        zIndex: 3,
        SlidersContainter: {
          zIndex: 3,
          y: 0,
          x: 0,
          children: [] as any[]
        },
      },
    }
  }

  static override _states() {
    return [
      class SliderFocusState extends this {
        override _getFocused() {
          return super._getFocused();
        }
      }
    ];
  }

  override _handleDown(){
    if (this.currentPlaylistIndex < this.playlists.length - 1) {
      this.currentPlaylistIndex += 1;
      this.repositionSlidersContainter();
      this.onChangeSlide();
    }
  }

  override _handleUp() {
    if (this.currentPlaylistIndex) {
      this.currentPlaylistIndex -= 1;
      this.repositionSlidersContainter();
      this.onChangeSlide();
    }
  }

  override _getFocused() {
    return this.tag('SlidesWrapper.SlidersContainter').children[this.currentPlaylistIndex];
  }

  private async playSource(source: string) {
    this.initVideoPlayer();
    VideoPlayer.open(source);
    VideoPlayer.play(source);
    VideoPlayer.show();
  }

  private initVideoPlayer() {
    VideoPlayer.close()
    VideoPlayer.consumer(this);
    VideoPlayer.loader(loader);
    VideoPlayer.unloader(unloader);
    VideoPlayer.mute();
    VideoPlayer.loop(true);
  }

  $videoPlayerPlaying() {
    this.tag('Background').patch({
      visible: false
    })
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
            onChangeSliderItem: true,
          },
          items: playlists.content_moments_list.map((playlistItem) => ({
            type: CardComponent,
            playlistItem
          }))
        }
      });

      const {
        title,
        content_moments_list: [playlistItem]
      } = this.playlists[this.currentPlaylistIndex];

      this.onChangeSliderItem(playlistItem);

      this._setState('SliderFocusState');
    })
  }

  onChangeSliderItem(item: PlaylistItem) {
    setTimeout(() => {
      this.tag('Background').patch({
        src: item.preview,
        visible: true
      });

      this.tag('Header').patch({
        contentTitle: item.content_title,
        playlistTitle: this.playlists[this.currentPlaylistIndex].title
      });

      this.playSource(item.hls);
    }, 10);
  }

  private onChangeSlide() {
    const focusedSlide = this._getFocused();
    const { playlistItem } =
      focusedSlide.carouselItems[focusedSlide.focusedIndex] as { playlistItem: PlaylistItem };
    this.onChangeSliderItem(playlistItem);
  }

  private repositionSlidersContainter() {
    const container = this.tag('SlidesWrapper.SlidersContainter');
    const currentFocusedSlider = container.children[this.currentPlaylistIndex];
    container.setSmooth('y', -currentFocusedSlider.y)
  }
}
