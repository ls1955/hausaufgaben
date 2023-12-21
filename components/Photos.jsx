import {FlatList, Image, TouchableOpacity} from 'react-native';

import {PHOTO_FLAT_LIST_NUM_COLUMNS} from '../appConfigs';

// The photos inside a Folder component. This component will be render when a folder has been clicked.
export default function Photos({uris, status, onStatus, isFromAlbum}) {
  const handleStatus = index => () => {
    const newState = isFromAlbum ? 'inPhotoFromAlbum' : 'inPhoto';
    return onStatus({...status, state: newState, selectedPhotoIndex: index});
  };

  const data = uris.map((uri, i) => ({id: i, uri}));

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={{width: '25%'}}
        onPress={handleStatus(item.id)}>
        <Image
          style={{width: '100%', minHeight: 100}}
          source={{uri: item.uri}}
          onError={e => console.error(e.nativeEvent.error)}
        />
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      numColumns={PHOTO_FLAT_LIST_NUM_COLUMNS}
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
}
