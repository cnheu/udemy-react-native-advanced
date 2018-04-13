import React, { Component } from 'react';
import { View, Animated } from 'react-native';

class Ball extends Component {
  componentWillMount() {
      // .ValueXY - WHERE IS IT
      this.position = new Animated.ValueXY(0, 0);
      // .spring - WHERE ARE WE GOING TO? default: 1s
      Animated.spring(this.position, {
        toValue: { x: 100, y: 200 },
      }).start();
  }

  render() {
    return (
      // .View is the element determines which element Animated will effect
      // .View is like WHAT ELEMENT ARE WE MOVING
      <Animated.View style={this.position.getLayout()}>
        <View style={styles.ball} />
      </Animated.View>
    );
  }
}

const styles = {
  ball: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 30,
    borderColor: 'black'
  }
};

export default Ball;
