import {FlatList, TouchableOpacity} from 'react-native';
import {useContext, useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';

import Loading from './Loading';
import {FoldersContext} from '../../contexts/FoldersContext';

import {PHOTO_FLAT_LIST_NUM_COLUMNS} from '../../appConfigs';
import {getMediaUris} from '../../utils';

// The medias inside a folder.
export default function Medias({title, navigation}) {
  // tell Medias to rerender itself after finish lazy loading mediaUris
  const [_, setRerender] = useState(false);
  const folders = useContext(FoldersContext);
  const {mediaUris, count} = folders[title];

  useEffect(() => {
    const lazyLoadMediaUris = async () => {
      // already load content before (including thumbnail)
      // the second condition take care of scenario when folder only have 1 image
      if (mediaUris.length > 1 || (mediaUris.length === count)) return;

      folders[title].mediaUris = await getMediaUris({folderTitle: title});
      setRerender(true);
    };
    lazyLoadMediaUris();
  }, []);

  const mediaData = mediaUris.map((uri, i) => ({key: i, uri, index: i}));
  const renderMedia = ({item: {key, uri, index}}) => {
    return <Media key={key} uri={uri} onPress={handleNav(index)} />;
  };
  const handleNav = index => {
    return () => navigation.navigate('Media', {index, folderTitle: title});
  };

  // has every photo been loaded?
  return mediaUris.length === count ? (
    <FlatList
      numColumns={PHOTO_FLAT_LIST_NUM_COLUMNS}
      data={mediaData}
      renderItem={renderMedia}
      contentContainerStyle={{paddingRight: 5}}
    />
  ) : (
    <Loading />
  );
}

// The small touchable image shows inside the Folder content.
const Media = ({uri, onPress}) => {
  return (
    <TouchableOpacity style={{width: '25%'}} onPress={onPress}>
      <FastImage
        style={{width: '100%', minHeight: 100}}
        source={{uri}}
        onError={e => console.error(e.nativeEvent.error)}
      />
    </TouchableOpacity>
  );
};
