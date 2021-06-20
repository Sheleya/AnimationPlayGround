import React from 'react';
import {SafeAreaView, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {PLAYGROUNDS} from './config';

const PlayGround = ({type, setType}) => {
  const Component = PLAYGROUNDS[type];
  return (
    <SafeAreaView style={styles.area}>
      <TouchableOpacity onPress={() => setType(null)}>
        <Text>Go Back</Text>
      </TouchableOpacity>
      <Component />
    </SafeAreaView>
  );
};

export default PlayGround;

const styles = StyleSheet.create({
  area: {
    flex: 1,
  },
});
