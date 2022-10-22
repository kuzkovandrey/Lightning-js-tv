import { PlaylistItem } from './../api/models/playlist';
import { CardComponent } from './CardComponent';
import { Lightning } from '@lightningjs/sdk';

export interface CardSliderProps {
  items?: SliderItem[];
}

export type SliderItem = { type: CardComponent; playlistItem: PlaylistItem };

export class CardSlider extends Lightning.Component implements CardSliderProps {
  set items(items: SliderItem[]) {
    this.carouselItems = items;
    this.focusedIndex = 0;
    this.carouselLength = this.carouselItems.length;

    this.tag('Slider.Wrapper').children = items.map((item, index) => ({
      ...item,
      x: index * (CardComponent.sizes.width + this.marginBeetweenItems),
    }));

    this._refocus();
  }

  set margin(margin: number) {
    this.marginBeetweenItems = margin;
  }

  private marginBeetweenItems = 15;

  private carouselItems: SliderItem[] = [];

  private focusedIndex: number;

  private carouselLength: number;

  private repositionWrapper() {
    const wrapper = this.tag('Slider.Wrapper');
    const currentFocusedItem = wrapper.children[this.focusedIndex];
    if (wrapper.x === -currentFocusedItem.x) {
      // @ts-ignore
      this.signal('onAnimationEnd');
    } else {
      wrapper.setSmooth('x', -currentFocusedItem.x);
    }
  }

  onFocus() {
    const playlistItem = this.tag('Slider.Wrapper').children[this.focusedIndex]
      .mediaItem as PlaylistItem;
    // @ts-ignore
    this.signal('onFocus', playlistItem);
  }

  override _init() {
    // @ts-ignore
    this.tag('Slider.Wrapper')
      .transition('x')
      .on('finish', () => {
        // @ts-ignore
        this.signal('onAnimationEnd');
      });
  }

  static override _template(): Lightning.Component.Template<Lightning.Component.TemplateSpecLoose> {
    return {
      Slider: {
        w: 1920,
        h: CardComponent.sizes.height,
        Wrapper: {},
      },
    };
  }

  override _getFocused() {
    this.onFocus();
    this.repositionWrapper();
    return this.tag('Slider.Wrapper').children[this.focusedIndex];
  }

  override _handleLeft() {
    if (!this.focusedIndex) return;
    this.focusedIndex -= 1;
  }

  override _handleRight() {
    if (this.focusedIndex === this.carouselLength - 1) return;
    this.focusedIndex += 1;
  }
}
