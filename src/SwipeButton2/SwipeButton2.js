import React, {useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

const {width: wWidth} = Dimensions.get('window');

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const BTN_HEIGHT = 100;
const BTN_PADDING = 10;
const BTN_WIDTH = wWidth - 20;

const SWIPEABLE_DIMENSIONS = BTN_HEIGHT - BTN_PADDING * 2;
const HORIZONTAL_WAVE_RANGE = SWIPEABLE_DIMENSIONS + BTN_PADDING * 2;
const HORIZONTAL_SWIPE_RANGE =
  BTN_WIDTH - BTN_PADDING * 2 - SWIPEABLE_DIMENSIONS;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#e3e1e1',
  },
  btnContainer: {
    borderRadius: BTN_HEIGHT,
    width: BTN_WIDTH,
    height: BTN_HEIGHT,
    justifyContent: 'center',
    padding: BTN_PADDING,
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
  swipeable: {
    height: SWIPEABLE_DIMENSIONS,
    width: SWIPEABLE_DIMENSIONS,
    borderRadius: SWIPEABLE_DIMENSIONS,
    position: 'absolute',
    left: BTN_PADDING,
    zIndex: 2,
  },
  text: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#06d6a0',
  },
  colorWave: {
    width: HORIZONTAL_WAVE_RANGE,
    height: BTN_HEIGHT,
    borderRadius: BTN_HEIGHT,
    backgroundColor: '#908e8e',
    position: 'absolute',
    left: 0,
  },
});

export default () => {
  const [toggled, setToggled] = useState(false);
  const x = useSharedValue(0);

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = x.value;
      ctx.completed = toggled;
    },
    onActive: (event, ctx) => {
      let newValue;

      if (ctx.completed) {
        newValue = HORIZONTAL_SWIPE_RANGE + event.translationX;
      } else {
        newValue = event.translationX;
      }
      if (newValue >= 0 && newValue <= HORIZONTAL_SWIPE_RANGE) {
        x.value = newValue;
      }
    },
    onEnd: _ => {
      if (x.value < BTN_WIDTH / 2 - SWIPEABLE_DIMENSIONS / 2) {
        x.value = withSpring(0);
        runOnJS(setToggled)(false);
      } else {
        x.value = withSpring(HORIZONTAL_SWIPE_RANGE);
        runOnJS(setToggled)(true);
      }
    },
  });

  const INTERPOLATE_INPUT_RANGE = [0, HORIZONTAL_SWIPE_RANGE];

  const AnimatedStyles = {
    swipeable: useAnimatedStyle(() => {
      return {
        transform: [{translateX: x.value}],
        backgroundColor: interpolateColor(
          x.value,
          [0, BTN_WIDTH - SWIPEABLE_DIMENSIONS - BTN_PADDING],
          ['#06d6a0', '#ffffff'],
        ),
      };
    }),
    text: useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: interpolate(x.value, INTERPOLATE_INPUT_RANGE, [
              0,
              BTN_WIDTH / 2 - SWIPEABLE_DIMENSIONS,
              Extrapolate.CLAMP,
            ]),
          },
        ],
        opacity: interpolate(
          x.value,
          INTERPOLATE_INPUT_RANGE,
          [0.8, 0],
          Extrapolate.CLAMP,
        ),
      };
    }),
    colorWave: useAnimatedStyle(() => {
      return {
        width: HORIZONTAL_WAVE_RANGE + x.value,
        opacity: interpolate(
          x.value,
          INTERPOLATE_INPUT_RANGE,
          [0, 1],
          Extrapolate.CLAMP,
        ),
      };
    }),
  };

  return (
    <View style={styles.container}>
      <View style={styles.btnContainer}>
        <AnimatedLinearGradient
          colors={['#06d6a0', '#1b9aaa']}
          start={{x: 0.0, y: 0.5}}
          end={{x: 1.0, y: 0.5}}
          style={[styles.colorWave, AnimatedStyles.colorWave]}
        />
        <PanGestureHandler onGestureEvent={onGestureEvent}>
          <Animated.View style={[styles.swipeable, AnimatedStyles.swipeable]} />
        </PanGestureHandler>
        <Animated.Text style={[styles.text, AnimatedStyles.text]}>
          Swipe me!
        </Animated.Text>
      </View>
    </View>
  );
};
