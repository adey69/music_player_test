/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { getAll } from 'react-native-get-music-files';
import { Song } from 'react-native-get-music-files/lib/typescript/src/NativeTurboSongs';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';

function App(): JSX.Element {
  const [result, setResult] = React.useState<Song[]>();

  const hasPermissions = async () => {
    if (Platform.OS === 'android') {
      let hasPermission =
        (await check(PERMISSIONS.ANDROID.READ_MEDIA_AUDIO)) === RESULTS.GRANTED;
      if (!hasPermission) {
        hasPermission =
          (await request(PERMISSIONS.ANDROID.READ_MEDIA_AUDIO)) ===
          RESULTS.GRANTED;
      }

      return hasPermission;
    }

    if (Platform.OS === 'ios') {
      let hasPermission =
        (await check(PERMISSIONS.IOS.MEDIA_LIBRARY)) === RESULTS.GRANTED;
      if (!hasPermission) {
        hasPermission =
          (await request(PERMISSIONS.IOS.MEDIA_LIBRARY)) === RESULTS.GRANTED;
      }

      return hasPermission;
    }

    return false;
  };

  const test = async () => {
    const permissions = await hasPermissions();
    if (permissions) {
      const songsResults = await getAll({
        limit: 20,
        offset: 0,
        coverQuality: 50,
        minSongDuration: 1000,
      });
      console.log({ songsResults });
      if (typeof songsResults === 'string') {
        return;
      }
      setResult(songsResults);
    }
  };

  useEffect(() => {
    test();
  }, []);

  const render = () => {
    if (result?.length === 0) {
      return <Text>No items</Text>;
    }

    return result?.map(song => (
      <View key={song.url}>
        <Image
          source={{
            uri: song?.cover ?? '',
          }}
          resizeMode="cover"
          style={{
            width: 150,
            height: 150,
          }}
        />
        <Text style={styles.text}>Album: {song.album}</Text>
        <Text style={styles.text}>Artist: {song.artist}</Text>
        <Text style={styles.text}>Title: {song.title}</Text>
        <Text style={styles.text}>Duration(ms): {song.duration}</Text>
        <Text style={styles.text}>Genre: {song.genre}</Text>
        <Text style={styles.text}>FileUrl: {song.url}</Text>
      </View>
    ));
  };

  return <View style={styles.container}>{render()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  text: {
    color: 'black',
  },
});

export default App;
