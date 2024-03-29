import {useContext} from 'react';
import {FlatList, SafeAreaView, StatusBar} from 'react-native';
import FlashMessage from 'react-native-flash-message';

import Album from '../components/album';
import Folder from '../components/folder';
import {AlbumsContext} from '../contexts/albums-context';
import {FoldersContext} from '../contexts/folders-context';
import {
  GALLERY_FLAT_LIST_NUM_COLUMNS,
  NON_GROUP_FOLDERS,
} from '../../app-configs';

// The screen that shows the albums and folders.
export default function HomeScreen({navigation}) {
  const albums = useContext(AlbumsContext);
  const folders = useContext(FoldersContext);

  // albums and folders data for FlatList, folders data will be append after albums'
  const data = Object.keys(albums).map((title, i) => {
    return {id: i, title, isAlbum: true};
  });
  // as using index as key, avoid duplicate key by adding previous data length as offset
  const offset = data.length;
  [...NON_GROUP_FOLDERS]
    .filter(title => folders[title] != null)
    .forEach((title, i) => data.push({id: i + offset, title, isAlbum: false}));

  // renderItem function for FlatList
  const renderItem = ({item: {id, title, isAlbum}}) => {
    const props = {key: id, title, navigation};
    return isAlbum ? <Album {...props} /> : <Folder {...props} />;
  };

  return (
    <SafeAreaView style={{flex: 1, paddingLeft: 5}}>
      <StatusBar hidden />
      <FlatList
        numColumns={GALLERY_FLAT_LIST_NUM_COLUMNS}
        data={data}
        renderItem={renderItem}
      />
      <FlashMessage />
    </SafeAreaView>
  );
}
