import React, { Component } from 'react';
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Deck extends Component {
  static defaultProps = {
    onSwipeRight: () => {},
    onSwipeLeft: () => {},
  }

  constructor(props) {
    super(props);

    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceSwipe('right');
          console.log('swipe right!');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe('left');
          console.log('swipe left!');
        } else {
          this.resetPosition();
        }
      }
    });

    // NB: generally bad practice to add mutable values to state
    this.state = { panResponder, position, index: 0 };
  }

  // lifecycle method that will call whenever re-rendered
  componentWillMount() {
    // For Android
    UIManager.setLayoutAnimationEnabledExperimental && UIMAnager.setLayoutAnimationEnabledExperimental(true);
    // For any changes made to the component, animate it and use sprint animation
    LayoutAnimation.spring();
  }

  // lifecycle method that will call whenever re-rendered with new props
  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({ index: 0 });
    }
  }

  onSwipeComplete(direction) {
    const { onSwipeLeft, onSwipeRight, data } = this.props;
    const item = this.props.data[this.state.index];

    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
    this.state.position.setValue({ x: 0, y: 0 });
    this.setState({ index: this.state.index + 1 });
  }

  getCardStyle() {
    const { position } = this.state;
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg'],
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    };
  }

  forceSwipe(direction) {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(this.state.position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start(() => this.onSwipeComplete(direction));
  }

  resetPosition() {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  renderCards() {
    if (this.state.index >= this.props.data.length) {
      return this.props.renderNoMoreCards();
    }

    return this.props.data.map((item, i) => {
      if (i < this.state.index) { return null; }

      if (i === this.state.index) {
        return (
          <Animated.View
            key={item.id}
            style={[this.getCardStyle(), styles.cardStyle]}
            {...this.state.panResponder.panHandlers}
          >
            {this.props.renderCard(item)};
          </Animated.View>
        );
      }

      // note: renderCard is pulled from App as a prop. So it makes the code reusable for different
      // types of decks
      return (
        <Animated.View
          key={item.id}
          style={[styles.cardStyle, { top: 10 * (i - this.state.index) }]}
        >
          {this.props.renderCard(item)}
        </Animated.View>
      );
    }).reverse();
  }

  render() {
    return (
      <View>
        {this.renderCards()}
      </View>

    );
  }
}

const styles = {
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH,
  }
};

export default Deck;
