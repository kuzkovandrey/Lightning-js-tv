import { PlaylistItem } from './../api/models/playlist';
import { CardComponent, CardComponentOptions } from './CardComponent';
import { Lightning } from '@lightningjs/sdk';

export interface CardSliderProps {
  items?: SliderItem[];
}

export type SliderItem = { type: CardComponent, playlistItem: PlaylistItem };

export class CardSlider extends Lightning.Component implements CardSliderProps {
  set items(items: SliderItem[]) {
    console.log('items', items);
    this.carouselItems = items;
    this.focusedIndex = 0;
    this.carouselLength = this.carouselItems.length;

    this.tag('Slider.Wrapper').children = items.map((item, index) => ({
      ...item,
      x: index * (CardComponentOptions.sizes.width + this.marginBeetweenItems)
    }));

    this._setState('FirstSliderItemState');
    this.onChangeSliderItem();
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
    wrapper.setSmooth('x', -currentFocusedItem.x)
  }

  onChangeSliderItem() {
    const playlistItem = this.tag('Slider.Wrapper').children[this.focusedIndex].mediaItem as PlaylistItem;
    // @ts-ignore
    this.signal<'onChangeSliderItem'>('onChangeSliderItem', playlistItem);
  }

  static override _template(): Lightning.Component.Template<Lightning.Component.TemplateSpecLoose> {
    return {
      Slider: {
        w: 1920,
        h: CardComponentOptions.sizes.height,
        Wrapper: {}
      }
    };
  }

  static override _states() {
      return [
        class FirstSliderItemState extends this {
          override _getFocused() {
            return this.tag('Slider.Wrapper').children[this.focusedIndex];
          }
        }
      ];
  }

  override _getFocused() {
    return this.tag('Slider.Wrapper').children[this.focusedIndex];
  }

  override _handleLeft() {
    if (!this.focusedIndex) {
      this.focusedIndex = this.carouselLength - 1;
    } else {
      this.focusedIndex -= 1;
    }

    this.repositionWrapper();
    this.onChangeSliderItem();
  }

  override _handleRight() {
    if(this.focusedIndex === this.carouselLength - 1) {
      this.focusedIndex = 0;
    }
    else {
      this.focusedIndex += 1;
    }

    this.repositionWrapper();
    this.onChangeSliderItem();
  }
}
