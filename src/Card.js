import React from 'react';
import {StyleSheet, Image, Dimensions} from 'react-native';
import StyleGuide from './StyleGuide';
import Animated from 'react-native-reanimated';

export const cards = [
  {
    id: 0,
    source: require('./assets/card1.png'),
  },
  {
    id: 1,
    source: require('./assets/card2.png'),
  },
  {
    id: 2,
    source: require('./assets/card3.png'),
  },
];

export const FlexibleCard = ({card, style}) => (
  <Animated.Image
    style={[styles.flexibleContainer, style]}
    source={card.source}
  />
);

const Card = ({card}) => {
  return <Image style={styles.container} source={card.source} />;
};

export default Card;

const {width} = Dimensions.get('window');
const CARD_ASPECT_RATIO = 1324 / 863;
export const CARD_WIDTH = width - StyleGuide.spacing * 8;
export const CARD_HEIGHT = CARD_WIDTH / CARD_ASPECT_RATIO;

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 18,
  },
  flexibleContainer: {
    flex: 1,
    maxWidth: '100%',
    aspectRatio: CARD_ASPECT_RATIO,
    margin: StyleGuide.spacing,
    borderRadius: 18,
    resizeMode: 'contain',
  },
});
