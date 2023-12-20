import {useEffect, useState} from 'react';
import {
  BackHandler,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
    // go back to previous state or exit the app
    const handleBackAction = () => {
      switch (status['state']) {
        case 'home':
          BackHandler.exitApp();
        case 'inAlbum':
        case 'inFolder':
          setStatus({...status, state: 'home'});
          break;
        case 'inFolderFromAlbum':
          setStatus({...status, state: 'inAlbum'});
          break;
        case 'inPhotoFromAlbum':
          setStatus({...status, state: 'inFolderFromAlbum'});
          break;
        default:
          console.error(`Unknown state ${status['state']}`);
      }
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
  } else if (
    status['state'] === 'inPhoto' ||
    status['state'] === 'inPhotoFromAlbum'
  ) {
    const uris = urisByFolder[status['selectedFolder']];
    const fromAlbum = status['state'] === 'inPhotoFromAlbum';
    return (
      <SafeAreaView style={{flex: 1}}>
        <Photo
          uris={uris}
          status={status}
          onStatus={setStatus}
          fromAlbum={fromAlbum}
        />
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
            fromAlbum={true}
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

  const albumsAndFoldersData = Object.keys(foldersByAlbum).map((album, i) => {
    return {id: i, name: album, isAlbum: true};
  });
  // since using index as key, avoid duplicate key by adding previous data length as offset
  const offset = albumsAndFoldersData.length;
  [...nonGroupFolders].forEach((folder, i) => {
    if (urisByFolder[folder] == null) return;

    albumsAndFoldersData.push({id: i + offset, name: folder, isAlbum: false});
  });

  const renderItem = ({item}) => {
    if (item.isAlbum) {
      return (
        <Album
          key={item.id}
          name={item.name}
          status={status}
          onStatus={setStatus}
        />
      );
    } else {
      return (
        <Folder
          key={item.id}
          name={item.name}
          status={status}
          onStatus={setStatus}
        />
      );
    }
  };

  // put numColumns into const to avoid dynamically changing number of columns
  const numColumns = 3;
  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        key={numColumns}
        numColumns={numColumns}
        data={albumsAndFoldersData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}

// folders that do not wanna be put into a group.
const nonGroupFolders = new Set(['Download', 'Whatsapp', '相机', '下载']);

// Gets photos' uri, then set new folders and albums with them.
const setFolderAndAlbum = async (setUrisByFolder, setFoldersByAlbum) => {
  // NOTE: Grabbing 40 images for now...
  const photos = await CameraRoll.getPhotos({first: 200});

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
    flexDirection: 'row',
    flexWrap: 'wrap',
    // Kinda a hack to replace "flex-between", by applying marginRight +15 to every children,
    // then remove the marginRight of last children
    marginRight: -15,
  },
});
