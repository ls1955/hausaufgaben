import {useEffect, useState} from 'react';
import {Image, PermissionsAndroid, View, Text, ScrollView} from 'react-native';

import {CameraRoll} from '@react-native-camera-roll/camera-roll';

export default function App() {
  const [folders, setFolders] = useState({});
  const [albums, setAlbums] = useState({});

  useEffect(() => {
    askPermission().then(() => setFolderAndAlbum(setFolders, setAlbums));
  }, []);

  // const images = uris.map((uri, i) => {
  //   return (
  //     <Image
  //       key={i}
  //       style={{width: 100, height: 100}}
  //       source={{uri}}
  //       onError={e => console.error(e.nativeEvent.error)}
  //     />
  //   );
  // });

  // return <ScrollView>{images}</ScrollView>;
  return <Text>Maintainence ongoing...</Text>
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

// folders that do not wanna be put into a group.
const nonGroupFolders = new Set(['相机', '下载', 'Whatsapp']);

// Gets photos' uri, then set new folders and albums with them.
const setFolderAndAlbum = async (setFolders, setAlbums) => {
  // NOTE: Grabbing 40 images for now...
  const photos = await CameraRoll.getPhotos({first: 40});

  const newFolders = {};
  const newAlbums = {};

  // NOTE: Using index as key (might change in the future)
  photos.edges.forEach((edge, i) => {
    const uri = edge.node.image.uri;
    const folder = uri.split('/').at(-2);

    newFolders[folder] = newFolders[folder] || {id: i, uris: []};
    newFolders[folder]['uris'].push(uri);

    if (nonGroupFolders.has(folder)) return;

    const albumName = folder[0].toUpperCase();

    newAlbums[albumName] = newAlbums[albumName] || {id: i, folderIds: []};
    newAlbums[albumName]['folderIds'].push(i);
  });

  setFolders(newFolders);
  setAlbums(newAlbums);
};
