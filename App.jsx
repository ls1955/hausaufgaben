import {useEffect, useState} from 'react';
import {BackHandler, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

import Album from './components/Album';
import Folder from './components/Folder';
import Photos from './components/Photos';
import Photo from './components/Photo';

import askPermission from './utils/permissionHelpers';

export default function App() {
  const [urisByFolder, setUrisByFolder] = useState({});
  const [foldersByAlbum, setFoldersByAlbum] = useState({});
  const [status, setStatus] = useState({
    state: 'home', // home | inAlbum | inFolder | inPhoto | inFolderFromAlbum | inPhotoFromAlbum
    selectedFolder: null,
    selectedAlbum: null,
    selectedPhotoIndex: -1,
  });

  // settle read storage permission and read image URIs beforehand...
  useEffect(() => {
    askPermission().then(() =>
      setFolderAndAlbum(setUrisByFolder, setFoldersByAlbum),
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

  if (
    status['state'] === 'inFolder' ||
    status['state'] === 'inFolderFromAlbum'
  ) {
    const uris = urisByFolder[status['selectedFolder']];
    const fromAlbum = status['state'] === 'inFolderFromAlbum';

    return (
      <SafeAreaView style={{flex: 1}}>
        <Photos
          uris={uris}
          status={status}
          onStatus={setStatus}
          fromAlbum={fromAlbum}
        />
      </SafeAreaView>
    );
  } else if (status['state'] === 'inPhoto' || status['state'] === 'inPhotoFromAlbum') {
    const uris = urisByFolder[status['selectedFolder']];
    return (
      <SafeAreaView style={{flex: 1}}>
        <Photo uris={uris} status={status} onStatus={setStatus} />
      </SafeAreaView>
    );
  } else if (status['state'] === 'inAlbum') {
    const folders = [...foldersByAlbum[status['selectedAlbum']]].map(
      (folder, i) => {
        return (
          <Folder
            key={i}
            name={folder}
            status={status}
            onStatus={setStatus}
            jumpFromAlbum={true}
          />
        );
      },
    );

    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.galleryLayout}>{folders}</View>
      </SafeAreaView>
    );
  }

  const albums = Object.entries(foldersByAlbum).map(([album, folders], i) => {
    // TODO: Include folder names at here?
    return <Album key={i} name={album} status={status} onStatus={setStatus} />;
  });

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.galleryLayout}>{albums}</View>
    </SafeAreaView>
  );
}

// folders that do not wanna be put into a group.
const nonGroupFolders = new Set(['Download', 'Whatsapp', '相机', '下载']);

// Gets photos' uri, then set new folders and albums with them.
const setFolderAndAlbum = async (setUrisByFolder, setFoldersByAlbum) => {
  // NOTE: Grabbing 40 images for now...
  const photos = await CameraRoll.getPhotos({first: 40});

  const newUrisByFolder = {};
  const newFoldersByAlbum = {};

  photos.edges.forEach((edge, i) => {
    const uri = edge.node.image.uri;
    const folder = uri.split('/').at(-2);

    newUrisByFolder[folder] = newUrisByFolder[folder] ?? [];
    newUrisByFolder[folder].push(uri);

    if (nonGroupFolders.has(folder)) return;

    const albumName = folder[0].toUpperCase();

    newFoldersByAlbum[albumName] = newFoldersByAlbum[albumName] ?? new Set();
    newFoldersByAlbum[albumName].add(folder);
  });

  setUrisByFolder(newUrisByFolder);
  setFoldersByAlbum(newFoldersByAlbum);
};

const styles = StyleSheet.create({
  // used by homepage and album
  galleryLayout: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
