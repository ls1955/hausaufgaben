import {useEffect, useState} from 'react';
import {Image, PermissionsAndroid, View, Text} from 'react-native';

import {CameraRoll} from '@react-native-camera-roll/camera-roll';

export default function App() {
  const [uris, setUris] = useState([]);

  useEffect(() => {
    askPermission().then(() => getUris(setUris));
  }, []);

  const images = uris.map((uri, i) => {
    return (
      <Image
        key={i}
        style={{width: 100, height: 100}}
        source={{uri}}
        onError={e => console.error(e.nativeEvent.error)}
      />
    );
  });

  return <View>{images}</View>;
}

// Asks for storage access permission, return true if granted permission, else false.
const askPermission = async () => {
  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  );

  if (hasPermission) return true;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    {
      title: 'hausaufgaben read storage permission',
      message: 'To read your homework folders',
      buttonPositive: 'Ok',
    },
  );

  console.log(granted);

  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

// Get and set photos' uri.
const getUris = async setUris => {
  const photos = CameraRoll.getPhotos({first: 20});
  setUris((await photos).edges.map(edge => edge.node.image.uri));
};
