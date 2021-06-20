import React, {useState} from 'react';
import {Dimensions, StyleSheet, View, Button} from 'react-native';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {mix, useSpring} from 'react-native-redash';

import Card, {cards} from '../Card';
import StyleGuide from '../StyleGuide';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const origin = {x: -(width / 2 - StyleGuide.spacing * 2), y: 0};

export default () => {
  const [toggled, setToggled] = useState(false);
  const transition = useSpring(toggled);

  return (
    <View style={styles.container}>
      {cards.map((card, index) => {
        const style = useAnimatedStyle(() => {
          const rotate = (index - 1) * mix(transition.value, 0, Math.PI / 6);
          return {
            transform: [
              {translateX: origin.x},
              {rotate: `${rotate}rad`},
              {translateX: -origin.x},
            ],
          };
        });
        return (
          <Animated.View key={card.id} style={[styles.overlay, style]}>
            <Card {...{card}} />
          </Animated.View>
        );
      })}
      <Button
        title={toggled ? 'Reset' : 'Start'}
        primary
        onPress={() => setToggled(!toggled)}
      />
    </View>
  );
};
