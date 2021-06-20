import React from 'react';
import {Image, View, Text} from 'react-native';
import {styles, ITEM_SIZE} from './AnimatedFlatList';
import {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

export default ({item, y, index}) => {
  const inputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 2)];
  const outputRange = [1, 1, 1, 0];
  const animStyles = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        y.value,
        [0, ITEM_SIZE * index],
        [1, 0],
        Extrapolate.CLAMP,
      ),
      transform: [
        {
          scale: interpolate(
            y.value,
            inputRange,
            outputRange,
            Extrapolate.CLAMP,
          ),
        },
      ],
    }),
    [y],
  );

  return (
    <View style={[styles.item, animStyles]}>
      <Image source={{uri: item.image}} style={styles.avatar} />
      <View style={{}}>
        <Text style={{fontSize: 22, fontWeight: '700'}}>{item.name}</Text>
        <Text style={{fontSize: 18, opacity: 0.7}}>{item.jobTitle}</Text>
        <Text style={{fontSize: 14, opacity: 0.8, color: '#0099cc'}}>
          {item.email}
        </Text>
      </View>
    </View>
  );
};
