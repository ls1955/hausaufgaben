import {useEffect, useState} from 'react';
import {
  BackHandler,
  PermissionsAndroid,
  SafeAreaView,
  View,
} from 'react-native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

import Folder from './components/Folder';
import Photos from './components/Photos';
import Photo from './components/Photo';

export default function App() {
  const [urisByFolder, setUrisByFolder] = useState({});
  const [folderIdsByAlbum, setFolderIdsByAlbum] = useState({});
  const [status, setStatus] = useState({
    state: 'home', // home | inAlbum | inFolder | inPhoto
    selectedFolder: null,
    selectedAlbum: null,
    selectedPhotoIndex: -1,
  });

  // settle read storage permission beforehand...
  useEffect(() => {
    askPermission().then(() =>
      setFolderAndAlbum(setUrisByFolder, setFolderIdsByAlbum),
    );
  }, []);

  // setup back button events...
  useEffect(() => {
    const handleBackAction = () => {
      if (status['state'] === 'home') BackHandler.exitApp();

      if (status['state'] === 'inFolder') setStatus({...status, state: 'home'});
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackAction,
    );

    return () => backHandler.remove();
  }, [status]);

  if (status['state'] === 'inFolder') {
    const uris = urisByFolder[status['selectedFolder']];
    return (
      <SafeAreaView style={{flex: 1}}>
        <Photos uris={uris} status={status} onStatus={setStatus} />
      </SafeAreaView>
    );
  } else if (status['state'] === 'inPhoto') {
    const uris = urisByFolder[status['selectedFolder']];
    return (
      <SafeAreaView style={{flex: 1}}>
        <Photo uris={uris} status={status} onStatus={setStatus}></Photo>
      </SafeAreaView>
    );
  }

  const folders = Object.entries(urisByFolder).map(([name, uris], i) => {
    return (
      <Folder
        key={i}
        name={name}
        uris={uris}
        status={status}
        onStatus={setStatus}
      />
    );
  });

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
        {folders}
      </View>
    </SafeAreaView>
  );
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
const setFolderAndAlbum = async (setUrisByFolder, setFolderIdsByAlbum) => {
  // NOTE: Grabbing 40 images for now...
  const photos = await CameraRoll.getPhotos({first: 40});

  const newUrisByFolder = {};
  const newFolderIdsByAlbum = {};

  photos.edges.forEach((edge, i) => {
    const uri = edge.node.image.uri;
    const folder = uri.split('/').at(-2);

    newUrisByFolder[folder] = newUrisByFolder[folder] ?? [];
    newUrisByFolder[folder].push(uri);

    if (nonGroupFolders.has(folder)) return;

    const albumName = folder[0].toUpperCase();

    newFolderIdsByAlbum[albumName] = newFolderIdsByAlbum[albumName] ?? [];
    newFolderIdsByAlbum[albumName].push(i);
  });

  setUrisByFolder(newUrisByFolder);
  setFolderIdsByAlbum(newFolderIdsByAlbum);
};
