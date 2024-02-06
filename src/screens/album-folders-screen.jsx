import {FlatList, SafeAreaView} from 'react-native';
import {useContext} from 'react';

import Folder from '../components/folder';
import {AlbumsContext} from '../contexts/albums-context';

import {GALLERY_FLAT_LIST_NUM_COLUMNS} from '../../app-configs';

// A page that shows folders inside an album.
export default function AlbumFoldersScreen({navigation, route: {params}}) {
  const albums = useContext(AlbumsContext);
  // splat it as it is Set
  const folderData = [...albums[params.title]].map((title, i) => {
    return {key: i, title};
  });

  const renderFolder = ({item: {key, title}}) => {
    return <Folder key={key} title={title} navigation={navigation} />;
  };

  return (
    <SafeAreaView style={{flex: 1, paddingLeft: 5}}>
      <FlatList
        numColumns={GALLERY_FLAT_LIST_NUM_COLUMNS}
        data={folderData}
        renderItem={renderFolder}
      />
    </SafeAreaView>
  );
}
