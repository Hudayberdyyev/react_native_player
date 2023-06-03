import React, {Ref, useCallback, useRef, useState} from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Video from 'react-native-video';
import {OnLoadData} from 'react-native-video';
import {OnBufferData} from 'react-native-video';

const App = () => {
  const videoRef: Ref<Video> = useRef(null);
  const [isControlEnabled, setControlEnabled] = useState<boolean>(false);
  const [isBuffering, setBuffering] = useState<boolean>(true);
  const [videoTracks, setVideoTracks] = useState<OnLoadData['videoTracks']>([]);
  const [onLoadData, setOnLoadData] = useState<OnLoadData | null>(null);

  const onBuffer = useCallback((data: OnBufferData) => {
    console.log(data);
    setBuffering(data.isBuffering);
  }, []);

  const onLoad = useCallback((data: OnLoadData) => {
    setOnLoadData(data);
    setVideoTracks(data.videoTracks);
  }, []);

  return (
    <SafeAreaView>
      <Text>BeletVideo</Text>
      <ScrollView>
        <Video
          key={isControlEnabled ? '1' : '2'}
          ref={videoRef}
          source={{
            uri: 'https://bv-video.belet.me/video/hls/259/438/master.m3u8',
          }}
          onLoad={onLoad}
          style={{
            aspectRatio: 16 / 9,
            backgroundColor: '#000000',
          }}
          onBuffer={onBuffer}
          controls={isControlEnabled}
        />

        <View style={{padding: 16, gap: 16}}>
          <View style={styles.menuWrapper} />
          <View style={styles.menuWrapper}>
            <Text>Buffering:</Text>
            <Text>{isBuffering ? 'True' : 'False'}</Text>
          </View>
          <View style={styles.menuWrapper}>
            <Text>Default control:</Text>
            <Text>{isControlEnabled ? 'Disable' : 'Enabled'}</Text>
            <View style={styles.menuButton}>
              <Button
                onPress={() => setControlEnabled(s => !s)}
                title="Toggle"
              />
            </View>
          </View>
          <Button
            onPress={() =>
              Alert.prompt('Seek to', 'in seconds', [
                {
                  text: 'Seek',
                  onPress: value => videoRef.current?.seek(Number(value)),
                },
              ])
            }
            title="Seek"
          />
          {onLoadData ? <Text>{JSON.stringify(onLoadData, 0, 4)}</Text> : null}
          <Text style={{fontSize: 12, color: '#777777'}}>
            Note: changing the control state will re-render the video
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  menuWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuButton: {
    marginLeft: 'auto',
  },
});

export default App;
