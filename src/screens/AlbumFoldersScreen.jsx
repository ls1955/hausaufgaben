import {FlatList, SafeAreaView} from 'react-native';
import {useContext} from 'react';

import Folder from '../components/Folder';
import {AlbumsContext} from '../../contexts/AlbumsContext';

import {GALLERY_FLAT_LIST_NUM_COLUMNS} from '../../appConfigs';

// A page that shows folders inside an album.
export default function AlbumFoldersScreen({navigation, route: {params}}) {
  const albums = useContext(AlbumsContext);
  // splat it as it is Set
  const folderData = [...albums[params.title]].map((title, i) => {
    return {id: i, title};
  });

  const renderFolder = ({item: {id, title}}) => {
    return <Folder key={id} title={title} navigation={navigation} />;
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        numColumns={GALLERY_FLAT_LIST_NUM_COLUMNS}
        data={folderData}
        renderItem={renderFolder}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}
