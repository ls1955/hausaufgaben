import {FlatList, Image, TouchableOpacity} from 'react-native';
import {useContext, useEffect, useState} from 'react';

import {FoldersContext} from '../../contexts/FoldersContext';
import {PHOTO_FLAT_LIST_NUM_COLUMNS} from '../../appConfigs';
import {getImageUris} from '../../utils';

// The medias inside a folder.
export default function Medias({title, navigation}) {
  // a flag to rerender in case we hasn't cache mediaUris beforehand
  const [hadUpdate, setHadUpdate] = useState(false);
  const folders = useContext(FoldersContext);
  const mediaUris = folders[title].imageUris;

  useEffect(() => {
    const cacheMediaUris = async () => {
      if (folders[title].imageUris != null) return;

      folders[title].imageUris = await getImageUris({folderTitle: title});
      setHadUpdate(true);
    };
    cacheMediaUris();
  }, []);

  const mediaData = mediaUris?.map((uri, i) => ({id: i, uri, index: i}));
  const renderMedia = ({item: {id, uri, index}}) => {
    return (
      <TouchableOpacity
        key={id}
        style={{width: '25%'}}
        onPress={handleNav(index)}>
        <Image
          style={{width: '100%', minHeight: 100}}
          source={{uri}}
          onError={e => console.error(e.nativeEvent.error)}
        />
      </TouchableOpacity>
    );
  };
  const handleNav = index => {
    return () => navigation.navigate('Media', {index, folderTitle: title});
  };

  return (
    <FlatList
      key={hadUpdate}
      numColumns={PHOTO_FLAT_LIST_NUM_COLUMNS}
      data={mediaData}
      renderItem={renderMedia}
      keyExtractor={item => item.id}
    />
  );
}
