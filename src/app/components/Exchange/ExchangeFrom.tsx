import * as React from 'react';
import { PureComponent } from 'react';
import trimStart from 'lodash/trimStart';
import isNumber from 'lodash/isNumber';

import { Map, List } from 'immutable';

import { CURRENCIES } from 'app/constants';
import ExchangeSwiper, { Slide } from './Swiper';

interface ExchangeFromProps {
  className?: string;
  currency: string;
  purse: Map<string, number>;
  value: number;
  onSlideChange: (currency: string) => void;
  onChange: (value: number) => void;
}

interface ExchangeFromState {
  slides: List<Slide>;
  slideInd: number;
}

export default class ExchangeFrom extends PureComponent<ExchangeFromProps, ExchangeFromState> {
  constructor(props) {
    super(props);
    const { purse, currency } = this.props;
    const purseCurrList = List(purse.keySeq());
    this.state = {
      slides:
        List(
          purseCurrList.map((curr: string) => ({
          currency: curr,
          total: purse.get(curr),
          symb: CURRENCIES[curr].symb,
        })),
      ),
      slideInd: purseCurrList.indexOf(currency),
    };
    this.onSlideChange = this.onSlideChange.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps({ value }) {
    if (this.props.value !== value) {
      this.setState({
        slides: this.updateSlides(this.state.slideInd, value),
      });
    }
  }

  onSlideChange(index: number) {
    const { slides } = this.state;
    this.setState({
      slideInd: index,
      slides: this.updateSlides(index, this.props.value),
    });
    this.props.onSlideChange(slides.get(index).currency);
  }

  onChange(value: string) {
    this.props.onChange(value ? Math.abs(Number(value)) : null);
  }

  updateSlides(index: number, value: number) {
    const { purse } = this.props;
    const { slides } = this.state;
    const max = slides.size - 1;
    const updateSlide = (slide) => {
      const numVal = Number(value);
      const total = purse.get(slide.currency) - numVal;
      return {
        ...slide,
        value: isNumber(value) ? -value : null,
        total,
      };
    };
    const test = slides.withMutations((list) => {
      list.update(index, (slide) => updateSlide(slide));
      list.update(Math.max(0, index - 1), (slide) => updateSlide(slide));
      list.update(Math.min(max, index + 1), (slide) => updateSlide(slide));
    });
    return test;
  }

  render() {
    const { slideInd, slides } = this.state;
    const { className } = this.props;
    return (
      <ExchangeSwiper
        className={className}
        editable
        slides={slides}
        withInput
        initialSlide={slideInd}
        onSlideChange={this.onSlideChange}
        onChange={this.onChange}
      />
    );
  }
}
