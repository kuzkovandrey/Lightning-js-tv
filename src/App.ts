import { Playlist, PlaylistItem } from './api/models/playlist';
import { HeaderComponent, HeaderComponentProps } from './components/ HeaderComponent';
import { Lightning, Utils } from '@lightningjs/sdk'
import { getMainPagePlaylists } from './api/api';
import { CardComponent } from './components/CardComponent';
import { CardSlider, CardSliderProps } from './components/CardSlider';

export default class App extends Lightning.Component {
  private playlists: Playlist[] = [];

  private currentPlaylistIndex = 0;

  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
  }

  static override _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        src: Utils.asset('images/background.png'),
      },
      Header: {
        x: 150,
        y: 545,
        type: HeaderComponent,
        contentTitle: 'Очень странные дела',
        playlistTitle: 'Стоит посмотреть',
      } as HeaderComponentProps,
      Slider: {
        y: 730,
        x: 150,
        signals: {
          onChangeSliderItem: true,
        },
        type: CardSlider
      } as CardSliderProps
    }
  }

  override _getFocused() {
    return this.tag('Slider');
  }

  onChangeSliderItem(item: PlaylistItem) {
    this.tag('Background').patch({
      src: item.preview
    });

    this.tag('Header').patch({
      contentTitle: item.content_title
    })
  }

  override _init() {
    const slider = this.tag('Slider');

    getMainPagePlaylists().then((playlists) => {
      this.playlists = playlists;
      const list = playlists[this.currentPlaylistIndex];

      slider.patch({
        items: list.content_moments_list.map((playlistItem) => ({
          type: CardComponent,
          playlistItem
        }))
      });

      this.tag('Header').patch({
        playlistTitle: list.title
      })
    });
  }
}
