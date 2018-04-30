import * as React from 'react';
import { PureComponent } from 'react';
import { List } from 'immutable';

import { Swiper } from '../Swiper';
import { Slide as SlideComponent } from './Slide';
import * as style from './style.scss';

export interface Slide {
  currency: string;
  symb: string;
  symb2: string;
  rate: number;
  total: number;
  value?: string;
}

interface SwiperProps {
  initialSlide?: number;
  className?: string;
  slides: List<Slide>;
  editable?: boolean;
  withInput?: boolean;
  onSlideChange: Function;
  onChange?: Function;
}

export default class ExchangeSwiper extends PureComponent<SwiperProps> {
  static defaultProps = {
    initialSlide: 0,
  };

  slideInd: number;

  constructor(props) {
    super(props);
    this.slideInd = this.props.initialSlide;
    this.onSwipe = this.onSwipe.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSwipe(index: number) {
    this.slideInd = index;
    const { onSlideChange } = this.props;
    onSlideChange(index);
  }

  onChange(event) {
    const { onChange } = this.props;
    onChange(event.target.value);
  }

  render() {
    const {
      className,
      slides,
      editable,
      withInput,
      initialSlide,
    } = this.props;
    const children = slides.map((slide, index) => {
      const isActive = this.slideInd === index;
      return (
        <div key={slide.currency} className={style.slideWrapper}>
          <SlideComponent
            {...slide}
            withInput={withInput}
            editable={editable}
            active={isActive}
            onChange={this.onChange}
          />
        </div>
      );
    });
    return (
      <Swiper
        className={className}
        initialSlide={initialSlide}
        afterChange={this.onSwipe}
      >
        {children}
      </Swiper>
    );
  }
}
