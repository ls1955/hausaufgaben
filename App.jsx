import {useEffect, useState} from 'react';
import {DarkTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import AlbumFoldersScreen from './src/screens/AlbumFoldersScreen';
import FolderContentScreen from './src/screens/FolderContentsScreen';
import MediaScreen from './src/screens/MediaScreen';

import {FoldersContext} from './contexts/FoldersContext';
import {AlbumsContext} from './contexts/AlbumsContext';

import {getPermission, loadFolders, getGroupedAlbums} from './init';
import {formatTitle} from './utils';

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
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{title: ''}}
            />
            <Stack.Screen
              name="AlbumFolders"
              component={AlbumFoldersScreen}
              options={({route}) => ({
                title: formatTitle({title: route.params.title, length: 15}),
                headerTitleStyle: {fontWeight: 'normal'},
              })}
            />
            <Stack.Screen
              name="FolderContents"
              component={FolderContentScreen}
              options={({route}) => ({
                title: formatTitle({title: route.params.title, length: 15}),
                headerTitleStyle: {fontWeight: 'normal'},
              })}
            />
            <Stack.Screen name="Media" component={MediaScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AlbumsContext.Provider>
    </FoldersContext.Provider>
  );
}
