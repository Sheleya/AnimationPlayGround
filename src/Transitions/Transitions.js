import React, {useState, useRef} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {Transitioning, Transition} from 'react-native-reanimated';

import {FlexibleCard, cards} from '../Card';
import StyleGuide from '../StyleGuide';
import Selection from '../Selection';

const {width} = Dimensions.get('window');

const column = {
  id: 'column',
  name: 'Column',
  layout: {
    container: {},
  },
};

const row = {
  id: 'row',
  name: 'Row',
  layout: {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    child: {
      width: width / 2 - StyleGuide.spacing * 2,
    },
  },
};

const wrap = {
  id: 'wrap',
  name: 'Wrap',
  layout: {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    child: {
      flex: 0,
      width: width / 2 - StyleGuide.spacing * 2,
    },
  },
};

const layouts = [column, row, wrap];
const transition = (
  <Transition.Change durationMs={400} interpolation="easeInOut" />
);

const Component = () => {
  const ref = useRef(null);
  const [selectedLayout, setLayout] = useState(layouts[0].layout);
  return (
    <>
      <Transitioning.View
        style={[styles.container, selectedLayout.container]}
        {...{ref, transition}}>
        {cards.map(card => (
          <FlexibleCard
            key={card.id}
            style={selectedLayout.child}
            {...{card}}
          />
        ))}
      </Transitioning.View>
      {layouts.map(({id, name, layout}) => (
        <Selection
          key={id}
          onPress={() => {
            if (ref.current) {
              ref.current.animateNextTransition();
            }
            setLayout(layout);
          }}
          isSelected={selectedLayout === layout}
          {...{name}}
        />
      ))}
    </>
  );
};

export default Component;

const styles = StyleSheet.create({
  area: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
