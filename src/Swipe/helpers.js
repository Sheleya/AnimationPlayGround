import Animated, {Easing} from 'react-native-reanimated';

const {
  Clock,
  Value,
  block,
  cond,
  not,
  clockRunning,
  startClock,
  timing: reTiming,
  stopClock,
  set,
} = Animated;

export const timing = timingConfig => {
  const {clock, easing, duration, from, to: toValue} = {
    clock: new Clock(),
    easing: Easing.linear,
    duration: 250,
    from: 0,
    to: 1,
    ...timingConfig,
  };

  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    toValue,
    duration,
    easing,
  };

  return block([
    cond(not(clockRunning(clock)), [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, from),
      set(state.frameTime, 0),
      startClock(clock),
    ]),
    reTiming(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]);
};
