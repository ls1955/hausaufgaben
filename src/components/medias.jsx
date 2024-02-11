import {FlatList, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import FileViewer from 'react-native-file-viewer';

import useMediaUris from '../hooks/useMediaUris';
import Loading from './loading';

// The medias inside a folder. It is the grid of media you see before viewing individual image.
export default function Medias({title, navigation}) {
  const {mediaUris, actualSize} = useMediaUris(title);

  const mediaData = mediaUris.map((uri, i) => ({key: i, uri, index: i}));
  const renderMedia = ({item: {key, uri, index}}) => {
    return <Media key={key} uri={uri} onPress={handleNav(index)} />;
  };
  const handleNav = index => async () => {
    try {
      await FileViewer.open(mediaUris[index]);
    } catch (error) {
      console.error(error);
    }
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
