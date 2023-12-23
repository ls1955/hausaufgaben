import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Pressable,
  Modal,
  View,
  Text,
} from 'react-native';
import {useState} from 'react';

import Album from './Album';
import Folder from './Folder';

import {
  TOP_NAV_BAR_HEIGHT,
  GALLERY_FLAT_LIST_NUM_COLUMNS,
  NON_GROUP_FOLDERS,
} from '../appConfigs';

// The page that shows the albums and folders. It also include a top navbar for everyday operation.
export default function HomePage({albums, folders, status, onStatus}) {
  const [isShowModal, setIsShowModal] = useState(false);

  if (isShowModal) {
    const dialog = (
      <Modal visible={isShowModal} style={styles.modal} transparent={true}>
        <Text>Some text inside the model. Will replace with user input</Text>
        <Pressable onPress={() => setIsShowModal(false)}>
          <Text>Close this dialog</Text>
        </Pressable>
      </Modal>
    );

    return (
      <SafeAreaView style={{flex: 1}}>
        {dialog}
      </SafeAreaView>
    )
  }

  // albums and folders data, folders data will be append after albums'
  const data = Object.keys(albums).map((title, i) => {
    return {id: i, title, isAlbum: true};
  });

  // as using index as key, avoid duplicate key by adding previous data length as offset
  const offset = data.length;
  [...NON_GROUP_FOLDERS]
    .filter(title => folders[title] != null)
    .forEach((title, i) => data.push({id: i + offset, title, isAlbum: false}));

  const renderItem = ({item}) => {
    const props = {key: item.id, title: item.title, status, onStatus};
    return item.isAlbum ? <Album {...props} /> : <Folder {...props} />;
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.navbar}>
        <Pressable onPress={() => setIsShowModal(true)}>
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
  navbar: {
    height: TOP_NAV_BAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
  },
  modal: {
    margin: 20,
    padding: 35,
    backgroundColor: 'red',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
