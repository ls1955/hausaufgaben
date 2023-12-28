import {useContext} from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Album from '../components/Album';
import Folder from '../components/Folder';
// import CommitModal from './CommitModal';

import {AlbumsContext} from '../../contexts/AlbumsContext';
import {FoldersContext} from '../../contexts/FoldersContext';

import {
  TOP_NAV_BAR_HEIGHT,
  GALLERY_FLAT_LIST_NUM_COLUMNS,
  NON_GROUP_FOLDERS,
} from '../../appConfigs';

// The screen that shows the albums and folders.
export default function HomeScreen({route, navigation}) {
  const albums = useContext(AlbumsContext);
  const folders = useContext(FoldersContext);

  const status = {};
  const onStatus = () => {};

  // if (status.showModal) {
  //   return <CommitModal status={status} onStatus={onStatus} />;
  // }

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
      <View style={styles.navBar}>
        <Pressable onPress={() => onStatus({...status, showModal: true})}>
          <Text style={{fontSize: 30}}>C</Text>
        </Pressable>
      </View>
      <FlatList
        numColumns={GALLERY_FLAT_LIST_NUM_COLUMNS}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  navBar: {
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: TOP_NAV_BAR_HEIGHT,
  },
});
