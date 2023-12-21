import {useEffect, useState} from 'react';
import {BackHandler, Text} from 'react-native';

import HomePage from './components/HomePage';
import AlbumFoldersPage from './components/AlbumFoldersPage';
import FolderPhotosPage from './components/FolderPhotosPage';
import PhotoPage from './components/PhotoPage';

import getPermission from './initializers/getPermission';
import loadFolders from './initializers/loadFolders';
import getGroupedAlbums from './initializers/getGroupedAlbums';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

export default function App() {
  const [folders, setFolders] = useState({});
  const [albums, setAlbums] = useState({});
  const [status, setStatus] = useState({
    state: 'home', // home | inAlbum | inFolder | inPhoto | inFolderFromAlbum | inPhotoFromAlbum
    selectedFolder: null,
    selectedAlbum: null,
    selectedPhotoIndex: -1,
  });

  // settle read storage permission and initialize essential folders and albums...
  useEffect(() => {
    getPermission()
      .then(() => loadFolders())
      .then(newFolders => {
        setFolders(newFolders);
        setAlbums(getGroupedAlbums(newFolders));
      });
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

  useEffect(() => {
    // caches the image URIs if it hasn't been cache before, else do nothing.
    const cacheImageUris = async () => {
      if (status['selectedFolder'] == null) return;
      if (folders[status['selectedFolder']]['imageUris'] != null) return;

      const newFolders = {...folders};

      newFolders[status['selectedFolder']]['imageUris'] = await getImageUris({
        folderTitle: status['selectedFolder'],
      });
      setFolders(newFolders);
    };
    cacheImageUris();
  }, [status]);

  // load the pages that doesn't require preloading image Uris
  switch (status['state']) {
    case 'home':
      return HomePage({albums, folders, status, onStatus: setStatus});
    case 'inAlbum':
      const folderTitles = [...albums[status['selectedAlbum']]];
      return AlbumFoldersPage({folderTitles, status, onStatus: setStatus});
  }

  const uris = folders[status['selectedFolder']].imageUris;

  // React will load the image Uris if it hasn't load before.
  if (uris == null) return <Text>Loading a page here...</Text>;

  let isFromAlbum = false;

  switch (status['state']) {
    case 'inFolderFromAlbum':
      isFromAlbum = true;
    case 'inFolder':
      return FolderPhotosPage({uris, status, onStatus: setStatus, isFromAlbum});
    case 'inPhotoFromAlbum':
      isFromAlbum = true;
    case 'inPhoto':
      return PhotoPage({uris, status, onStatus: setStatus, isFromAlbum});
  }
}

// TODO: Move this somewhere else
const MAX_IMAGE_PER_FOLDER = 300;

// TODO: Move this somewhere else.
// Returns an array of image URIs (String) of given folderTitle.
const getImageUris = async ({folderTitle}) => {
  const photos = await CameraRoll.getPhotos({
    first: MAX_IMAGE_PER_FOLDER,
    groupName: folderTitle,
  });

  return photos.edges.map(edge => edge.node.image.uri);
};
