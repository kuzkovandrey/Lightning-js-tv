import { Lightning, Img } from '@lightningjs/sdk';
import { Media } from '../api/models/media';
import { PlaylistItem } from '../api/models/playlist';

export const CardComponentOptions = {
  colors: {
    focused: 0xFF00B29D,
    placeholder: 0xFF1A2527,
  },
  sizes: {
    width: 371,
    height: 225,
  }
};

export interface CardComponentProps {
  playlistItem: PlaylistItem;
}

export class CardComponent extends Lightning.Component implements CardComponentProps {
  set playlistItem(playlistItem: PlaylistItem) {
    this.mediaItem = playlistItem;

    this.tag('CardWrapper.Poster').texture = Img(playlistItem.preview, {
      type: 'contain'
    })
  }

  private mediaItem: PlaylistItem;

  static override _template(): Lightning.Component.Template<Lightning.Component.TemplateSpecLoose> {
    return {
      CardWrapper: {
        w: CardComponentOptions.sizes.width,
        h: CardComponentOptions.sizes.height,
        rect: true,
        color: CardComponentOptions.colors.placeholder,
        shader: {
          type: Lightning.shaders.RoundedRectangle,
          radius: 50,
        },
        Poster: {
          w: CardComponentOptions.sizes.width,
          h: CardComponentOptions.sizes.height,
        },
      }
    };
  }

  override _focus() {
    this.tag('CardWrapper').patch({
      shader: {
        stroke: 7,
        strokeColor: CardComponentOptions.colors.focused,
      }
    });
  }

  override _unfocus() {
    this.tag('CardWrapper').patch({
      shader: {
        stroke: 0,
        strokeColor: null,
      }
    });
  }
}

