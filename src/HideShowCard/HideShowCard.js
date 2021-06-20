import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {useMemoOne} from 'use-memo-one';

import Card, {cards} from '../Card';

const {
  Value,
  useCode,
  set,
  Clock,
  block,
  not,
  cond,
  clockRunning,
  startClock,
  stopClock,
  interpolate,
  Extrapolate,
  add,
  eq,
} = Animated;

const duration = 2000;

const HideShowCard = () => {
  const [show, setShow] = useState(true);

  const {time, clock, progress} = useMemoOne(
    () => ({
      time: new Value(0),
      clock: new Clock(),
      progress: new Value(0),
    }),
    [],
  );

  const opacity = interpolate(progress, {
    inputRange: [0, 1],
    outputRange: show ? [0, 1] : [1, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  useCode(
    block([
      // 1.
      cond(not(clockRunning(clock)), [startClock(clock), set(time, clock)]),
      // 2.
      set(
        progress,
        interpolate(clock, {
          inputRange: [time, add(time, duration)],
          outputRange: [0, 1],
          extrapolate: Extrapolate.CLAMP,
        }),
      ),
      // 3.
      cond(eq(progress, 1), stopClock(clock)),
    ]),
    [show],
  );

  return (
    <SafeAreaView style={styles.area}>
      <Animated.View style={{opacity}}>
        <Card card={cards[0]} />
      </Animated.View>
      <View style={{flex: 1}}></View>
      <Button
        title={show ? 'Hide' : 'Show'}
        onPress={() => setShow(prev => !prev)}
      />
    </SafeAreaView>
  );
};

console.disableYellowBox = true;

export default HideShowCard;

const styles = StyleSheet.create({
  area: {
    flex: 1,
    alignItems: 'center',
  },
});
