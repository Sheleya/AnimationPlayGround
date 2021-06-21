import React, {useState, useRef} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const DATA = [...Array(15).keys()].map((_, i) => {
  return {
    image: `https://picsum.photos/id/${Math.floor(
      Math.random(i) * 100,
    )}/1080/720`,
  };
});

const {width: wWidth, height: wHeight} = Dimensions.get('window');

const SPACING = 15;
const IMAGE_SIZE = 75;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  thumbList: {
    position: 'absolute',
    bottom: IMAGE_SIZE,
  },
  thumb: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    overflow: 'hidden',
    marginRight: SPACING,
  },
  image: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
});

export default () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const topRef = useRef();
  const thumbRef = useRef();
  const renderItem = ({item, index}) => (
    <View style={{width: wWidth, height: wHeight}}>
      <Image
        source={{uri: item.image}}
        style={[StyleSheet.absoluteFillObject]}
      />
    </View>
  );

  const renderThumbItem = ({item, index}) => (
    <TouchableOpacity
      onPress={() => scrollToActiveIndex(index)}
      style={styles.thumb}>
      <Image
        source={{uri: item.image}}
        style={[
          StyleSheet.absoluteFillObject,
          styles.image,
          activeIndex === index && {borderColor: '#fff'},
        ]}
      />
    </TouchableOpacity>
  );

  const scrollToActiveIndex = index => {
    setActiveIndex(index);
    topRef?.current?.scrollToOffset({
      offset: index * wWidth,
      animated: true,
    });
    if (index * (IMAGE_SIZE + SPACING) - IMAGE_SIZE / 2 > wWidth / 2) {
      thumbRef?.current?.scrollToOffset({
        offset: index * (IMAGE_SIZE + SPACING) - wWidth / 2 + IMAGE_SIZE / 2,
        animated: true,
      });
    } else {
      thumbRef?.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={topRef}
        data={DATA}
        horizontal
        pagingEnabled
        renderItem={renderItem}
        keyExtractor={item => item}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={ev => {
          scrollToActiveIndex(
            Math.floor(ev.nativeEvent.contentOffset.x / wWidth),
          );
        }}
      />
      <FlatList
        ref={thumbRef}
        data={DATA}
        horizontal
        contentContainerStyle={{paddingHorizontal: SPACING}}
        keyExtractor={item => item}
        showsHorizontalScrollIndicator={false}
        style={styles.thumbList}
        renderItem={renderThumbItem}
      />
    </View>
  );
};
