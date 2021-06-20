import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  LogBox,
} from 'react-native';
import {PLAYGROUNDS} from './src/config';
import PlayGround from './src/PlayGround';

const App = () => {
  const [type, setType] = useState(null);
  return (
    <SafeAreaView style={styles.area}>
      {type ? (
        <PlayGround type={type} setType={setType} />
      ) : (
        <FlatList
          data={Object.keys(PLAYGROUNDS)}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => setType(item)} style={styles.btn}>
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={({item}) => item}
        />
      )}
    </SafeAreaView>
  );
};

LogBox.ignoreAllLogs(true);

export default App;

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: '#fff',
  },
  btn: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: 'rgb(132,133,132)',
  },
});
