import { Lightning, Img } from '@lightningjs/sdk';
import { PlaylistItem } from '../api/models/playlist';

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

  static readonly colors = {
    focused: 0xFF00B29D,
    placeholder: 0xFF1A2527,
  } as const;

  static readonly sizes = {
    width: 371,
    height: 225,
  } as const;

  private mediaItem: PlaylistItem;

  static override _template(): Lightning.Component.Template<Lightning.Component.TemplateSpecLoose> {
    return {
      CardWrapper: {
        w: CardComponent.sizes.width,
        h: CardComponent.sizes.height,
        rect: true,
        color: CardComponent.colors.placeholder,
        shader: {
          type: Lightning.shaders.RoundedRectangle,
          radius: 50,
        },
        Poster: {
          w: CardComponent.sizes.width,
          h: CardComponent.sizes.height,
        },
      }
    };
  }

  override _focus() {
    this.tag('CardWrapper').patch({
      shader: {
        stroke: 7,
        strokeColor: CardComponent.colors.focused,
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

