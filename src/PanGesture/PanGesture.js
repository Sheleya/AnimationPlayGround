import * as React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import {onGestureEvent} from 'react-native-redash/lib/module/v1';

import StyleGuide from '../StyleGuide';
import Card, {CARD_HEIGHT, CARD_WIDTH, cards} from '../Card';

const {Value, diffClamp, cond, set, eq, add, event} = Animated;
const {width, height} = Dimensions.get('window');
const containerWidth = width;
const containerHeight = height - 44;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const [card] = cards;

const withOffset = (value, state, offset) => {
  return cond(
    eq(state, State.END),
    [set(offset, add(offset, value)), offset],
    add(offset, value),
  );
};

export default () => {
  const state = new Value(State.UNDETERMINED);
  const translationX = new Value(0);
  const translationY = new Value(0);
  const offsetX = new Value((containerWidth - CARD_WIDTH) / 2);
  const offsetY = new Value((containerHeight - CARD_HEIGHT) / 2);
  const gestureHandler = onGestureEvent({
    state,
    translationX,
    translationY,
  });
  const translateX = diffClamp(
    withOffset(translationX, state, offsetX),
    0,
    containerWidth - CARD_WIDTH,
  );
  const translateY = diffClamp(
    withOffset(translationY, state, offsetY),
    0,
    containerHeight - CARD_HEIGHT,
  );
  return (
    <View style={styles.container}>
      <PanGestureHandler {...gestureHandler}>
        <Animated.View style={{transform: [{translateX}, {translateY}]}}>
          <Card {...{card}} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};
