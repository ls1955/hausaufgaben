import {useEffect, useState} from 'react';
import {BackHandler} from 'react-native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

import HomePage from './components/HomePage';
import AlbumFoldersPage from './components/AlbumFoldersPage';
import FolderPhotosPage from './components/FolderPhotosPage';
import PhotoPage from './components/PhotoPage';

import askPermission from './utils/permissionHelpers';
import {nonGroupFolders} from './app_configs';

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

  // start rendering the page according to state...
  let uris = urisByFolder[status['selectedFolder']];
  let isFromAlbum = null;

  switch (status['state']) {
    case 'home':
      return HomePage({
        foldersByAlbum,
        urisByFolder,
        status,
        onStatus: setStatus,
      });
    case 'inAlbum':
      const folderNames = [...foldersByAlbum[status['selectedAlbum']]];
      return AlbumFoldersPage({folderNames, status, onStatus: setStatus});
    case 'inFolder':
    case 'inFolderFromAlbum':
      isFromAlbum = status['state'] === 'inFolderFromAlbum';
      return FolderPhotosPage({uris, status, onStatus: setStatus, isFromAlbum});
    case 'inPhoto':
    case 'inPhotoFromAlbum':
      isFromAlbum = status['state'] === 'inPhotoFromAlbum';
      return PhotoPage({uris, status, onStatus: setStatus, isFromAlbum});
  }
}

// Gets photos' uri, then set new folders and albums with them.
const setFolderAndAlbum = async (setUrisByFolder, setFoldersByAlbum) => {
  // NOTE: Configure this to your desire photo amount
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
