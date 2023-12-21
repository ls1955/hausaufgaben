import {FlatList, SafeAreaView} from 'react-native';

import Folder from './Folder';

import {GALLERY_FLAT_LIST_NUM_COLUMNS} from '../appConfigs';

// A page that shows folders inside an album.
export default function AlbumFoldersPage({folderTitles, status, onStatus}) {
  const data = folderTitles.map((title, i) => ({id: i, title}));

  const renderItem = ({item}) => {
    return (
      <Folder
        key={item.id}
        title={item.title}
        status={status}
        onStatus={onStatus}
        isFromAlbum={true}
      />
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        numColumns={GALLERY_FLAT_LIST_NUM_COLUMNS}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}
