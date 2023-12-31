import {useContext} from 'react';
import {FlatList, SafeAreaView} from 'react-native';

import Album from '../components/Album';
import Folder from '../components/Folder';

import {AlbumsContext} from '../../contexts/AlbumsContext';
import {FoldersContext} from '../../contexts/FoldersContext';

import {
  GALLERY_FLAT_LIST_NUM_COLUMNS,
  NON_GROUP_FOLDERS,
} from '../../appConfigs';
import FlashMessage from 'react-native-flash-message';

// The screen that shows the albums and folders.
export default function HomeScreen({navigation}) {
  const albums = useContext(AlbumsContext);
  const folders = useContext(FoldersContext);

  // TODO: Include a commit button at header that open commit modal

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
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        numColumns={GALLERY_FLAT_LIST_NUM_COLUMNS}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <FlashMessage />
    </SafeAreaView>
  );
}
