import * as React from 'react';
import {StyleSheet} from 'react-native';
import Animated from 'react-native-reanimated';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import {onGestureEvent, min} from 'react-native-redash/lib/module/v1';

const styles = StyleSheet.create({});

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
  spring,
  neq,
  useCode,
  multiply,
  abs,
  sub,
  call,
} = Animated;

const snapPoint = (snapPoints, value, velocity) => {
  const point = add(value, multiply(velocity, 0.2)); // points/sec * sec
  const deltas = snapPoints.map(p => abs(sub(point, p)));
  const minDelta = min(...deltas);
  return snapPoints.reduce((acc, p) =>
    cond(eq(abs(sub(point, p)), minDelta), p, acc),
  );
};

const withSpring = props => {
  const {value, state, velocity, snapPoints, onSnap, offset} = {
    offset: new Value(0),
    ...props,
  };
  const clock = new Clock();
  const springState = {
    finished: new Value(0),
    velocity,
    position: new Value(0),
    time: new Value(0),
  };
  const config = {
    damping: 20,
    mass: 1,
    stiffness: 150,
    overshootClamping: false,
    restSpeedThreshold: 1,
    restDisplacementThreshold: 1,
    toValue: new Value(0),
  };

  const areGestureAndAnimationFinished = new Value(1);
  const isSpringInterrupted = and(eq(state, State.BEGAN), clockRunning(clock));
  const finishSpring = [set(offset, springState.position), stopClock(clock)];

  return block([
    cond(isSpringInterrupted, finishSpring),
    cond(areGestureAndAnimationFinished, set(springState.position, offset)),
    cond(neq(state, State.END), [
      set(areGestureAndAnimationFinished, 0),
      set(springState.finished, 0),
      set(springState.position, add(offset, value)),
    ]),
    cond(and(eq(state, State.END), not(areGestureAndAnimationFinished)), [
      cond(and(not(clockRunning(clock)), not(springState.finished)), [
        set(springState.velocity, velocity),
        set(springState.time, 0),
        set(config.toValue, snapPoint(snapPoints, value, velocity)),
        startClock(clock),
      ]),
      spring(clock, springState, config),
      cond(springState.finished, [
        set(areGestureAndAnimationFinished, 1),
        onSnap && call([springState.position], onSnap),
        ...finishSpring,
      ]),
    ]),
    springState.position,
  ]);
};

export default ({translateX, translateY, snapPoints, onSnap, offsetX}) => {
  const translationX = new Value(0);
  const translationY = new Value(0);
  const velocityX = new Value(0);
  const velocityY = new Value(0);
  const state = new Value(State.UNDETERMINED);
  const gestureHandler = onGestureEvent({
    translationX,
    translationY,
    velocityX,
    state,
  });
  const x = withSpring({
    value: translationX,
    state,
    velocity: velocityX,
    snapPoints,
    onSnap,
    offset: offsetX,
  });
  const y = withSpring({
    value: translationY,
    state,
    velocity: velocityY,
    snapPoints: [0],
  });

  useCode(block([set(translateX, x), set(translateY, y)]), []);
  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View style={StyleSheet.absoluteFill} />
    </PanGestureHandler>
  );
};
