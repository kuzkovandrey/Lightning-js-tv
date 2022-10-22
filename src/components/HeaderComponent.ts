import { Lightning } from '@lightningjs/sdk';

export class HeaderComponent extends Lightning.Component {

  set contentTitle(contentTitle: string) {
    this.tag('ContentTitle').text.text = contentTitle;
  }

  set playlistTitle(playlistTitle: string) {
    this.tag('PlaylistTitle').text.text = playlistTitle;
  }

  static override _template(): Lightning.Component.Template {
    return {
      ContentTitle: {
        y: 0,
        text: {
          fontSize: 70,
          textColor: 0xFFFFFFFF
        }
      },
      PlaylistTitle: {
        y: 110,
        text: {
          fontSize: 32,
          textColor: 0xFFFFFFFF
        }
      }
    };
  }
}
