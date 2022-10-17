import { Lightning } from '@lightningjs/sdk';

export interface HeaderComponentProps {
  contentTitle: string;
  playlistTitle: string;
}

export interface HeaderComponentTemplateSpec extends Lightning.Component.TemplateSpec {
  ContentTitle: {
    text: {
      text: string
    }
  };
  PlaylistTitle: {
    text: {
      text: string
    }
  };
}

export class HeaderComponent
  extends Lightning.Component
  implements Lightning.Component.ImplementTemplateSpec<HeaderComponentTemplateSpec>, HeaderComponentProps {

  set contentTitle(contentTitle: string) {
    this.tag('ContentTitle').text.text = contentTitle;
  }

  set playlistTitle(playlistTitle: string) {
    this.tag('PlaylistTitle').text.text = playlistTitle;
  }

  static override _template(): Lightning.Component.Template<HeaderComponentTemplateSpec> {
    return {
      w: 1920,
      h: 200,
      ContentTitle: {
        y: 0,
        text: {
          text: null,
          fontSize: 70,
          textColor: 0xFFFFFFFF
        }
      },
      PlaylistTitle: {
        y: 110,
        text: {
          text: null,
          fontSize: 32,
          textColor: 0xFFFFFFFF
        }
      }
    };
  }
}
