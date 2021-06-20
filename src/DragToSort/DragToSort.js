import React from 'react';
import {View} from 'react-native';
import Animated from 'react-native-reanimated';
import {cards} from '../Card';
import SortableCard, {CARD_HEIGHT} from './SortableCard';

const {Value} = Animated;
export default () => {
  const offsets = cards.map((_, index) => new Value(CARD_HEIGHT * index));
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {cards.map((card, index) => (
        <SortableCard key={card.id} {...{offsets, card, index}} />
      ))}
    </View>
  );
};
