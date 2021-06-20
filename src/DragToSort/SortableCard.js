import React from 'react';
import {Dimensions} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {panGestureHandler} from 'react-native-redash/lib/module/v1';

import Card, {CARD_HEIGHT as INNER_CARD_HEIGHT} from '../Card';

export const CARD_HEIGHT = INNER_CARD_HEIGHT + 32;
const {width} = Dimensions.get('window');
const {
  Value,
  eq,
  cond,
  useCode,
  divide,
  floor,
  max,
  multiply,
  block,
  set,
  diff,
  lessThan,
  add,
  greaterThan,
  abs,
  and,
  not,
  spring,
  startClock,
  Clock,
  defined,
  round,
  neq,
} = Animated;

const withTransition = (value, velocity, gestureState) => {
  const clock = new Clock();
  const config = {
    toValue: new Value(0),
    damping: 15,
    mass: 1,
    stiffness: 150,
    overshootClamping: false,
    restSpeedThreshold: 1,
    restDisplacementThreshold: 1,
  };
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };
  return block([
    startClock(clock),
    set(config.toValue, value),
    cond(
      eq(gestureState, State.ACTIVE),
      [set(state.position, value), set(state.velocity, velocity)],
      spring(clock, state, config),
    ),
    state.position,
  ]);
};

const withSafeOffset = (value, gestureState, offset) => {
  const safeOffset = new Value();
  return block([
    cond(
      not(defined(safeOffset)),
      set(safeOffset, offset === undefined ? 0 : offset),
    ),
    cond(eq(gestureState, State.ACTIVE), add(offset, value), [
      set(safeOffset, offset),
      safeOffset,
    ]),
  ]);
};

const moving = value => {
  const frames = new Value(0);
  const delta = diff(value);
  return cond(
    lessThan(delta, 0.01),
    [set(frames, add(frames, 1)), lessThan(frames, 5)],
    [set(frames, 0), 1],
  );
};

export default ({card, index, offsets}) => {
  const {gestureHandler, translation, velocity, state} = panGestureHandler();

  const x = withSafeOffset(translation.x, state, 0);
  const y = withSafeOffset(translation.y, state, offsets[index]);
  const translateX = withTransition(x, velocity.x, state);
  const translateY = withTransition(y, velocity.y, state);
  const zIndex = cond(
    eq(state, State.ACTIVE),
    200,
    cond(moving(translateY), 100, 1),
  );
  const currentOffset = multiply(round(divide(y, CARD_HEIGHT)), CARD_HEIGHT);
  useCode(
    block([
      ...offsets.map(offset =>
        cond(
          and(
            eq(currentOffset, offset),
            neq(currentOffset, offsets[index]),
            eq(state, State.ACTIVE),
          ),
          [set(offset, offsets[index]), set(offsets[index], currentOffset)],
        ),
      ),
    ]),
    [currentOffset, index, offsets, state],
  );
  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width,
          height: CARD_HEIGHT,
          justifyContent: 'center',
          alignItems: 'center',
          transform: [{translateX}, {translateY}],
          zIndex,
        }}>
        <Card {...{card}} />
      </Animated.View>
    </PanGestureHandler>
  );
};
