import React, {useState, useRef} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Transitioning, Transition} from 'react-native-reanimated';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  view: {
    flex: 1,
    backgroundColor: '#fff',
  },
  btn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginTop: 50,
  },
});

export default () => {
  const [isDark, setIsDark] = useState(false);
  const ref = useRef(null);

  const SimpleText = ({text, dark}) => {
    const color = dark ? 'white' : 'black';
    return <Text style={{color}}>{text}</Text>;
  };

  const transition = (
    <Transition.Together>
      <Transition.In type="fade" durationMs={400} />
      <Transition.Out type="fade" durationMs={400} />
    </Transition.Together>
  );

  return (
    <Transitioning.View style={styles.container} {...{ref, transition}}>
      <View style={styles.view}>
        {isDark && (
          <View
            style={{...StyleSheet.absoluteFillObject, backgroundColor: 'black'}}
          />
        )}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            if (ref.current) {
              ref.current.animateNextTransition();
            }
            setIsDark(!isDark);
          }}>
          <SimpleText text="CHANGE MODE" dark={isDark} />
        </TouchableOpacity>
      </View>
    </Transitioning.View>
  );
};
