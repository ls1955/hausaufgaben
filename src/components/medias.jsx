import {useContext, useEffect} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';

import Loading from './loading';
import {FoldersContext} from '../contexts/folders-context';
import {getMediaUris} from '../../utils';

// The medias inside a folder. It is the grid of media you see before viewing individual image.
export default function Medias({title, navigation}) {
  const {folders, setFolders} = useContext(FoldersContext);
  const {mediaUris, count} = folders[title];

  useEffect(() => {
    const loadMediaUris = async () => {
      if (mediaUris.length === count) return;

      const newMediaUris = await getMediaUris({folderTitle: title});
      setFolders(prev => ({...prev, title: {mediaUris: newMediaUris, count}}));
    };
    loadMediaUris();
  }, []);

  const mediaData = mediaUris.map((uri, i) => ({key: i, uri, index: i}));
  const renderMedia = ({item: {key, uri, index}}) => {
    return <Media key={key} uri={uri} onPress={handleNav(index)} />;
  };
  const handleNav = index => {
    return () => navigation.navigate('Media', {index, folderTitle: title});
  };

  return mediaUris.length === actualSize ? (
    <FlatList
      numColumns={4}
      data={mediaData}
      renderItem={renderMedia}
      contentContainerStyle={{paddingRight: 5}}
    />
  ) : (
    <Loading />
  );
}

// The small touchable media shows inside the Folder content.
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
