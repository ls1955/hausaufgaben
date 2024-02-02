import {useEffect, useState} from 'react';
import {Button} from 'react-native';
import {DarkTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from './src/screens/home-screen';
import AlbumFoldersScreen from './src/screens/album-folders-screen';
import FolderContentScreen from './src/screens/folder-contents-screen';
import MediaScreen from './src/screens/media-screen';
import OrganizeDownloadModal from './src/components/organize-download-modal';

import {FoldersContext} from './src/contexts/folders-context';
import {AlbumsContext} from './src/contexts/albums-context';

import {getPermission, loadFolders, getGroupedAlbums} from './init';

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

  return (
    <FoldersContext.Provider value={folders}>
      <AlbumsContext.Provider value={albums}>
        <NavigationContainer theme={DarkTheme}>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={({navigation}) => ({
                title: '',
                headerRight: () => (
                  // TODO: Extract out an Nav component, that contains more button underneath
                  <Button
                    onPress={() => navigation.navigate('OrganizeDownload')}
                    title="Organize"
                    color="#555"
                  />
                ),
              })}
            />
            <Stack.Screen
              name="AlbumFolders"
              component={AlbumFoldersScreen}
              options={({route}) => ({
                title: route.params.title,
                headerTitleStyle: {fontWeight: 'normal'},
              })}
            />
            <Stack.Screen
              name="FolderContents"
              component={FolderContentScreen}
              options={({route}) => ({
                title: route.params.title,
                headerTitleStyle: {fontWeight: 'normal'},
              })}
            />
            <Stack.Screen
              name="Media"
              component={MediaScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="OrganizeDownload"
              component={OrganizeDownloadModal}
              options={{headerShown: false, presentation: 'transparentModal'}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AlbumsContext.Provider>
    </FoldersContext.Provider>
  );
}
