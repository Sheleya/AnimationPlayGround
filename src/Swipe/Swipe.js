import React, {useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {useMemoOne} from 'use-memo-one';

import Profile from './Profile';
import Swipeable from './Swipeable';

import {timing} from './helpers';

const profiles = [
  {
    id: '1',
    name: 'Caroline',
    age: 24,
    profile: require('../assets/profiles/1.jpg'),
  },
  {
    id: '2',
    name: 'Jack',
    age: 30,
    profile: require('../assets/profiles/2.jpg'),
  },
  {
    id: '3',
    name: 'Anet',
    age: 21,
    profile: require('../assets/profiles/3.jpg'),
  },
  {
    id: '4',
    name: 'John',
    age: 28,
    profile: require('../assets/profiles/4.jpg'),
  },
];

const {
  Value,
  useCode,
  block,
  cond,
  eq,
  set,
  Clock,
  clockRunning,
  not,
  call,
  Extrapolate,
  interpolate,
} = Animated;

const {width, height} = Dimensions.get('window');
const deltaX = width / 2;
const α = Math.PI / 12;
const A = Math.round(width * Math.cos(α) + height * Math.sin(α));
const snapPoints = [-A, 0, A];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cards: {
    flex: 1,
    marginHorizontal: 16,
    zIndex: 100,
  },
  footer: {
    paddingVertical: 20,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  btn: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 10,
  },
});

export default () => {
  const [index, setIndex] = useState(0);
  const profile = profiles[index];

  const {clock, translateX, translateY, offsetX, like, dislike} = useMemoOne(
    () => ({
      clock: new Clock(0),
      translateX: new Value(0),
      translateY: new Value(0),
      offsetX: new Value(0),
      like: new Value(0),
      dislike: new Value(0),
    }),
    [],
  );

  const rotateZ = interpolate(translateX, {
    inputRange: [-A, 0, A],
    outputRange: [-α, 0, α],
    extrapolate: Extrapolate.CLAMP,
  });
  const likeOpacity = interpolate(translateX, {
    inputRange: [0, deltaX],
    outputRange: [0, 1],
    extrapolate: Extrapolate.CLAMP,
  });
  const dislikeOpacity = interpolate(translateX, {
    inputRange: [-deltaX, 0],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const onSnap = ([x]) => {
    if (x !== 0) {
      setIndex(prevIndex => (prevIndex + 1) % profiles.length);
      offsetX.setValue(0);
    }
  };

  useCode(
    block([
      cond(eq(like, 1), [
        set(offsetX, [
          timing({
            clock,
            from: 0,
            to: snapPoints[2],
            duration: 200,
          }),
        ]),
        cond(not(clockRunning(clock)), [call([], onSnap), set(like, 0)]),
      ]),
      cond(eq(dislike, 1), [
        set(offsetX, [
          timing({
            clock,
            from: 0,
            to: snapPoints[0],
            duration: 200,
          }),
        ]),
        cond(not(clockRunning(clock)), [call([], onSnap), set(dislike, 0)]),
      ]),
    ]),
    [onSnap],
  );

  return (
    <View style={styles.container}>
      <View style={styles.cards}>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            transform: [{translateX}, {translateY}, {rotateZ}],
          }}>
          <Profile {...{profile, likeOpacity, dislikeOpacity}} />
        </Animated.View>
        <Swipeable {...{translateX, translateY, snapPoints, onSnap, offsetX}} />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => dislike.setValue(1)}
          style={styles.btn}>
          <Text>DISLIKE</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => like.setValue(1)} style={styles.btn}>
          <Text>LIKE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
