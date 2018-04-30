import * as React from 'react';
import { PureComponent } from 'react';
import Slick from 'react-slick';

const config = {
  dots: true,
  speed: 500,
  arrows: false,
  pauseOnFocus: false,
  focusOnSelect: false,
  infinite: false,
};

export class Swiper extends PureComponent<any, any> {
  render() {
    return (
      <Slick {...this.props} {...config}>
        {this.props.children}
      </Slick>
    );
  }
}
