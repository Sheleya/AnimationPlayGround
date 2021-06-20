import * as React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import {onGestureEvent} from 'react-native-redash/lib/module/v1';

import Card, {CARD_HEIGHT, CARD_WIDTH, cards} from '../Card';

const {
  Value,
  diffClamp,
  cond,
  set,
  eq,
  add,
  block,
  Clock,
  and,
  not,
  clockRunning,
  startClock,
  stopClock,
  decay,
  neq,
} = Animated;
const {width, height} = Dimensions.get('window');
const containerWidth = width;
const containerHeight = height - 44;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const [card] = cards;

const withDecay = (value, gestureState, offset, velocity) => {
  const clock = new Clock();
  const decayState = {
    finished: new Value(0),
    velocity,
    position: new Value(0),
    time: new Value(0),
  };
  const config = {deceleration: 0.998};

  const finishDecay = [set(offset, decayState.position), stopClock(clock)];

  return block([
    cond(and(eq(gestureState, State.BEGAN), clockRunning(clock)), finishDecay),
    cond(neq(gestureState, State.END), [
      set(decayState.finished, 0),
      set(decayState.position, add(offset, value)),
    ]),
    cond(eq(gestureState, State.END), [
      cond(and(not(clockRunning(clock)), not(decayState.finished)), [
        set(decayState.velocity, velocity),
        set(decayState.time, 0),
        startClock(clock),
      ]),
      decay(clock, decayState, config),
      cond(decayState.finished, finishDecay),
    ]),
    decayState.position,
  ]);
};

export default () => {
  const state = new Value(State.UNDETERMINED);
  const translationX = new Value(0);
  const translationY = new Value(0);
  const offsetX = new Value((containerWidth - CARD_WIDTH) / 2);
  const offsetY = new Value((containerHeight - CARD_HEIGHT) / 2);
  const velocityX = new Value(0);
  const velocityY = new Value(0);

  const gestureHandler = onGestureEvent({
    state,
    translationX,
    translationY,
    velocityX,
    velocityY,
  });
  const translateX = diffClamp(
    withDecay(translationX, state, offsetX, velocityX),
    0,
    containerWidth - CARD_WIDTH,
  );
  const translateY = diffClamp(
    withDecay(translationY, state, offsetY, velocityY),
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
