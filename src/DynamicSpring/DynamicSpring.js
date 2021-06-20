import * as React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import {onGestureEvent} from 'react-native-redash/lib/module/v1';

import {withSpring} from '../animationHelpers';

import Card, {CARD_HEIGHT, CARD_WIDTH, cards} from '../Card';

const {Value, Clock, useCode, set, block, spring, startClock} = Animated;
const {width, height} = Dimensions.get('window');
const containerWidth = width;
const containerHeight = height - 44;
const snapX = (containerWidth - CARD_WIDTH) / 2;
const snapY = (containerHeight - CARD_HEIGHT) / 2;
const offsetX = new Value(snapX);
const offsetY = new Value(snapY);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const [frontCard, middleCard, backCard] = cards;

const baseConfig = {
  damping: 40,
  mass: 1,
  stiffness: 400,
  overshootClamping: false,
  restSpeedThreshold: 1,
  restDisplacementThreshold: 1,
};

const createState = () => ({
  x: {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  },
  y: {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  },
});

const createConfig = () => ({
  x: {toValue: new Value(0), ...baseConfig},
  y: {toValue: new Value(0), ...baseConfig},
});

export default () => {
  const state = new Value(State.UNDETERMINED);
  const translationX = new Value(0);
  const translationY = new Value(0);
  const velocityX = new Value(0);
  const velocityY = new Value(0);
  const gestureHandler = onGestureEvent({
    state,
    translationX,
    translationY,
    velocityX,
    velocityY,
  });
  const translateX = withSpring({
    value: translationX,
    velocity: velocityX,
    state,
    offset: offsetX,
    snapPoints: [snapX],
  });
  const translateY = withSpring({
    value: translationY,
    velocity: velocityY,
    state,
    offset: offsetY,
    snapPoints: [snapY],
  });
  const states = [createState(), createState()];
  const configs = [createConfig(), createConfig()];
  const clock = new Clock();
  useCode(
    block([
      startClock(clock),
      set(configs[0].x.toValue, translateX),
      set(configs[0].y.toValue, translateY),
      spring(clock, states[0].x, configs[0].x),
      spring(clock, states[0].y, configs[0].y),

      set(configs[1].x.toValue, states[0].x.position),
      set(configs[1].y.toValue, states[0].y.position),
      spring(clock, states[1].x, configs[1].x),
      spring(clock, states[1].y, configs[1].y),
    ]),
    [],
  );
  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          transform: [
            {translateX: states[1].x.position},
            {translateY: states[1].y.position},
          ],
        }}>
        <Card card={backCard} />
      </Animated.View>
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          transform: [
            {translateX: states[0].x.position},
            {translateY: states[0].y.position},
          ],
        }}>
        <Card card={middleCard} />
      </Animated.View>
      <PanGestureHandler {...gestureHandler}>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            transform: [{translateX}, {translateY}],
          }}>
          <Card card={frontCard} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};
