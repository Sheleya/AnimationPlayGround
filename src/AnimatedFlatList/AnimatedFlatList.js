import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import faker from 'faker';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import ListItem from './ListItem';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export const SPACING = 20;
export const AVATAR_SIZE = 70;
export const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f98dc24d',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE,
    marginRight: SPACING / 2,
  },
  item: {
    backgroundColor: '#fff9',
    flexDirection: 'row',
    padding: SPACING,
    borderRadius: 12,
    marginBottom: SPACING,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
});

const DATA = [...Array(30).keys()].map((_, i) => {
  return {
    key: faker.datatype.uuid(),
    image: `https://randomuser.me/api/portraits/women/${faker.datatype.number(
      60,
    )}.jpg`,
    name: faker.name.findName(),
    jobTitle: faker.name.jobTitle(),
    email: faker.internet.email(),
  };
});

export default () => {
  const translationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      translationY.value = event.contentOffset.y;
    },
  });

  const animStyles = useAnimatedStyle(() => ({
    opacity: interpolate(
      translationY.value,
      [0, 100],
      [1, 0],
      Extrapolate.CLAMP,
    ),
  }));

  const renderItem = ({item, index}) => (
    <ListItem item={item} y={translationY} index={index} />
  );

  return (
    <View style={styles.container}>
      <Text style={animStyles}>Heeloo</Text>
      <AnimatedFlatList
        scrollEventThrottle={16}
        contentContainerStyle={{padding: SPACING}}
        data={DATA}
        onScroll={scrollHandler}
        renderItem={renderItem}
        keyExtractor={item => item.key}
      />
    </View>
  );
};
