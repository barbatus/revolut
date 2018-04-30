import * as React from 'react';
import { PureComponent } from 'react';
import { Map, List } from 'immutable';

import { CURRENCIES } from 'app/constants';
import { Swiper } from '../Swiper';
import { Slide as SlideComponent } from './Slide';

class Slide {
  currency: string;
  symb: string;
  name: string;
  total: number;
}

export interface PurseSwiperOps {
  className?: string;
  purse: Map<string, number>;
  currency: string;
  onSlideChange: (currency: string) => void;
}

export class PurseSwiper extends PureComponent<PurseSwiperOps> {
  constructor(props) {
    super(props);
    this.onSwipe = this.onSwipe.bind(this);
  }

  onSwipe(index) {
    const { purse } = this.props;
    const keys = purse.keySeq();
    this.props.onSlideChange(keys.get(index));
  }

  render() {
    const {
      className,
      purse,
      currency,
    } = this.props;
    const slides = List<Slide>(
      purse.keySeq().map((curr: string) => ({
        currency: curr,
        total: purse.get(curr),
        symb: CURRENCIES[curr].symb,
        name: CURRENCIES[curr].name,
      })),
    );
    const index = slides.findIndex((slide) => slide.currency === currency);
    const children = slides.map((slide) => {
      return (
        <SlideComponent key={slide.currency} {...slide} />
      );
    });
    return (
      <Swiper
        className={className}
        initialSlide={index}
        afterChange={this.onSwipe}
      >
        {children}
      </Swiper>
    );
  }
}
