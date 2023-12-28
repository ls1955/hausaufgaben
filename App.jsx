import {useEffect, useState} from 'react';
import {DarkTheme, NavigationContainer} from '@react-navigation/native';

import HomeScreen from './src/screens/HomeScreen';
import AlbumFoldersScreen from './src/screens/AlbumFoldersScreen';
import FolderContentScreen from './src/screens/FolderContentsScreen';

import {getPermission, loadFolders, getGroupedAlbums} from './init';
import {getImageUris} from './utils';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {FoldersContext} from './contexts/FoldersContext';
import {AlbumsContext} from './contexts/AlbumsContext';

const Stack = createNativeStackNavigator();

export default function App() {
  const [folders, setFolders] = useState({});
  const [albums, setAlbums] = useState({});

  // settle read storage permission and initialize essential folders and albums...
  useEffect(() => {
    getPermission()
      .then(() => loadFolders())
      .then(newFolders => {
        setFolders(newFolders);
        setAlbums(getGroupedAlbums(newFolders));
      });
  }, []);

  // NOTE: Where the changes started
  return (
    <FoldersContext.Provider value={folders}>
      <AlbumsContext.Provider value={albums}>
        <NavigationContainer theme={DarkTheme}>
          <Stack.Navigator initialRouteName="Home" screenOptions={{}}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AlbumFolders" component={AlbumFoldersScreen} />
            <Stack.Screen name="FolderContents" component={FolderContentScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AlbumsContext.Provider>
    </FoldersContext.Provider>
  );
}

