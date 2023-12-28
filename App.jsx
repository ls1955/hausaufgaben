import {useEffect, useState} from 'react';
import {DarkTheme, NavigationContainer} from '@react-navigation/native';

import HomeScreen from './src/screens/HomeScreen';
import AlbumFoldersScreen from './src/screens/AlbumFoldersScreen';
// import AlbumFoldersPage from './components/AlbumFoldersPage';
// import FolderPhotosPage from './components/FolderPhotosPage';
// import PhotoPage from './components/PhotoPage';
// import LoadingPage from './components/LoadingPage';

import {getPermission, loadFolders, getGroupedAlbums} from './init';
import {getImageUris} from './utils';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {FoldersContext} from './contexts/FoldersContext';
import {AlbumsContext} from './contexts/AlbumsContext';

const Stack = createNativeStackNavigator();

export default function App() {
  const [folders, setFolders] = useState({});
  const [albums, setAlbums] = useState({});
  const [status, setStatus] = useState({
    state: 'home', // home | inAlbum | inFolder | inPhoto | inFolderFromAlbum | inPhotoFromAlbum
    selectedFolder: null,
    selectedAlbum: null,
    selectedPhotoIndex: -1,
    showModal: false,
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

  // NOTE: Where the changes started
  return (
    <FoldersContext.Provider value={folders}>
      <AlbumsContext.Provider value={albums}>
        <NavigationContainer theme={DarkTheme}>
          <Stack.Navigator initialRouteName="Home" screenOptions={{}}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AlbumFolders" component={AlbumFoldersScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AlbumsContext.Provider>
    </FoldersContext.Provider>
  );

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
  if (uris == null) return <LoadingPage />;

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

