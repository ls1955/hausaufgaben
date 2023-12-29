import {FlatList, Image, TouchableOpacity} from 'react-native';
import {useContext, useEffect, useState} from 'react';

import Loading from './Loading';
import {FoldersContext} from '../../contexts/FoldersContext';

import {PHOTO_FLAT_LIST_NUM_COLUMNS} from '../../appConfigs';
import {getMediaUris} from '../../utils';

// The medias inside a folder.
export default function Medias({title, navigation}) {
  // tell Medias to rerender itself after finish lazy loading mediaUris
  const [_, setRerender] = useState(false);
  const folders = useContext(FoldersContext);

  useEffect(() => {
    const lazyLoadMediaUris = async () => {
      // mediaUris is already loaded, not need to load again
      // if mediaUris length is one, it usually means only the thumbnail is being load (TODO)
      if (folders[title].mediaUris.length >= 1) return;

      folders[title].mediaUris = await getMediaUris({folderTitle: title});
      setRerender(true);
    };
    lazyLoadMediaUris();
  }, []);

  const mediaUris = folders[title].mediaUris;
  const mediaData = mediaUris.map((uri, i) => ({id: i, uri, index: i}));
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

  return mediaUris != null ? (
    <FlatList
      numColumns={PHOTO_FLAT_LIST_NUM_COLUMNS}
      data={mediaData}
      renderItem={renderMedia}
      keyExtractor={item => item.id}
    />
  ) : (
    <Loading />
  );
}
