import * as React from 'react';
import { PureComponent } from 'react';

import { List, Map } from 'immutable';

import { CURRENCIES } from 'app/constants';
import { isNumber, convNum2Amount } from 'app/utils';
import ExchangeSwiper, { Slide } from './Swiper';

interface ExchangeToProps {
  className?: string;
  currency: string;
  rates: Map<string, Map<string, number>>;
  convertFrom: string;
  purse: Map<string, number>;
  value: number;
  onSlideChange: (currency: string) => void;
}

interface ExchangeToState {
  slides: List<Slide>;
  slideInd: number;
}

export default class ExchangeTo extends PureComponent<ExchangeToProps, ExchangeToState> {
  constructor(props) {
    super(props);
    const { purse, currency, rates, convertFrom } = this.props;
    const currArr = Object.keys(CURRENCIES);
    const symbFrom = CURRENCIES[convertFrom].symb;
    this.state = {
      slides: List(
        currArr.map((curr) => {
          const rate = rates
            .get(currency)
            .get(convertFrom);
          const currSymb = CURRENCIES[curr].symb;
          return {
            currency: curr,
            total: purse.get(curr, 0),
            symb: currSymb,
            symb2: symbFrom,
            rate,
          };
        }),
      ),
      slideInd: currArr.indexOf(currency),
    };
    this.onSlideChange = this.onSlideChange.bind(this);
  }

  componentWillReceiveProps({ value, rates, convertFrom }) {
    const { slideInd } = this.state;
    if (this.props.value !== value ||
        this.props.convertFrom !== convertFrom) {
      this.setState({
        slides: this.updateSlides(slideInd, rates, convertFrom, value),
      });
    }
  }

  onSlideChange(index: number) {
    const { rates, convertFrom, value } = this.props;
    const { slides } = this.state;
    this.setState({
      slideInd: index,
      slides: this.updateSlides(index, rates, convertFrom, value),
    });
    this.props.onSlideChange(slides.get(index).currency);
  }

  updateSlides(index: number, rates, convertFrom: string, value: number) {
    const { purse } = this.props;
    const { slides } = this.state;
    const max = slides.size - 1;
    const updateSlide = (slide) => {
      const fromTo = rates
        .get(convertFrom)
        .get(slide.currency);
      const toFrom = rates
        .get(slide.currency)
        .get(convertFrom);
      const curr = slide.currency;
      const symbFrom = CURRENCIES[convertFrom].symb;
      const numVal = Number(value);
      const convValue = numVal * fromTo;
      const total = purse.get(curr, 0) + numVal * fromTo;
      return {
        ...slide,
        value: convValue ? convNum2Amount(convValue) : null,
        total: total,
        symb2: symbFrom,
        rate: toFrom,
      };
    };
    return slides.withMutations((list) => {
      list.update(index, (slide) => updateSlide(slide));
      list.update(Math.max(0, index - 1), (slide) => updateSlide(slide));
      list.update(Math.min(max, index + 1), (slide) => updateSlide(slide));
    });
  }

  render() {
    const { slideInd, slides } = this.state;
    const { className } = this.props;
    return (
      <ExchangeSwiper
        className={className}
        slides={slides}
        initialSlide={slideInd}
        onSlideChange={this.onSlideChange}
      />
    );
  }
}
