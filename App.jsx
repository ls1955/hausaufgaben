import {useEffect, useState} from 'react';
import {Image, PermissionsAndroid, View, Text, ScrollView} from 'react-native';

import {CameraRoll} from '@react-native-camera-roll/camera-roll';

export default function App() {
  const [folders, setFolders] = useState([]);
  const [albums, setAlbums] = useState([]);
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

  return <ScrollView>{images}</ScrollView>;
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

  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

// Get and set photos' uri.
const getUris = async setUris => {
  const photos = await CameraRoll.getPhotos({first: 20});

  photos.edges.forEach(edge => {
    const uri = edge.node.image.uri;
    const folder = uri.split("/").at(-2);
    console.log(folder)
  })
  setUris(photos.edges.map(edge => edge.node.image.uri));
};
