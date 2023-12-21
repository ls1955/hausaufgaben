import {useEffect, useState} from 'react';
import {BackHandler} from 'react-native';

import HomePage from './components/HomePage';
import AlbumFoldersPage from './components/AlbumFoldersPage';
import FolderPhotosPage from './components/FolderPhotosPage';
import PhotoPage from './components/PhotoPage';

import getPermission from './initializers/getPermission';
import loadFolders from './initializers/loadFolders';
import getGroupedAlbums from './initializers/getGroupedAlbums';

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

  // start rendering the page according to state...
  let uris = folders[status['selectedFolder']]?.['imageUris'];
  let isFromAlbum = false;

  switch (status['state']) {
    case 'home':
      return HomePage({albums, folders, status, onStatus: setStatus});
    case 'inAlbum':
      const folderNames = [...albums[status['selectedAlbum']]];
      return AlbumFoldersPage({folderNames, status, onStatus: setStatus});
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
