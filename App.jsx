import {useEffect, useState} from 'react';
import {
  BackHandler,
  PermissionsAndroid,
  View,
  SafeAreaView,
} from 'react-native';

import {CameraRoll} from '@react-native-camera-roll/camera-roll';

import Folder from './components/Folder';
import Photos from './components/Photos';

export default function App() {
  const [folders, setFolders] = useState({});
  const [albums, setAlbums] = useState({});
  // state: home | inAlbum | inFolder | inPhoto
  const [status, setStatus] = useState({
    state: 'home',
    selectedFolder: null,
    selectedAlbum: null,
  });

  // settle read storage permission beforehand...
  useEffect(() => {
    askPermission().then(() => setFolderAndAlbum(setFolders, setAlbums));
  }, []);

  // setup back button events...
  useEffect(() => {
    const handleBackAction = () => {
      if (status['state'] === 'home') BackHandler.exitApp();

      if (status['state'] === 'inFolder') {
        setStatus({...status, state: 'home'});
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackAction,
    );

    return () => backHandler.remove();
  }, [status]);

  if (status['state'] === 'inFolder') {
    const uris = folders[status['selectedFolder']].uris;

    return (
      <SafeAreaView style={{flex: 1}}>
        <Photos uris={uris} />
      </SafeAreaView>
    );
  }

  // Differentiate which folder is in an album to not rerender them again.
  const inAlbumFolderIds = new Set(
    Object.values(folders).flatMap(({id}) => id),
  );
  Object.values(albums).forEach(album => {
    album.folderIds.forEach(id => inAlbumFolderIds.delete(id));
  });

  const folderComponents = Object.entries(folders).map(([name, folder], i) => {
    return (
      <Folder
        key={i}
        name={name}
        uris={folder.uris}
        status={status}
        onStatus={setStatus}></Folder>
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
        {folderComponents}
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
