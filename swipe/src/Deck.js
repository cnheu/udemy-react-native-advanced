import React, { Component } from 'react';
import { View, Animated } from 'react-native';

class Deck extends Component {
  renderCards() {
    return this.props.data.map(item => {
      // note: renderCard is pulled from App as a prop. So it makes the code reusable for different
      // types of decks
      return this.props.renderCard(item);
    });
  }
  render() {
    return (
      <View>
        {this.renderCards()}
      </View>
    );
  }
}

export default Deck;
